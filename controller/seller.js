import { Order } from "../models/order.js";
import { Payment } from "../models/payment.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";

export const getSellerPayments = async (req, res) => {
    try {
        const sellerId = req.user._id;

        const products = await Product.find({ user: sellerId });
        const productIds = products.map(p => p._id);

        const orders = await Order.find({ product: { $in: productIds } });
        const orderIds = orders.map(o => o._id);
        const payments = await Payment.find({ order: { $in: orderIds } })
            .populate("order", "totalAmount orderStatus paymentStatus")
            .populate("user", "name email phone");

        return res.status(200).json({
            success: true,
            total: payments.length,
            data: payments
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};

export const acceptRejectOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const sellerId = req.user._id;
        const validStatus = ["confirmed", "cancelled"];
        if (!validStatus.includes(status)) {
            return res.status(400).json({
                message: "Status must be confirmed or cancelled",
                success: false
            });
        }
        const order = await Order.findById(id)
            .populate("product");
        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                success: false
            });
        }

        if (order.product.user.toString() !== sellerId.toString()) {
            return res.status(403).json({
                message: "Unauthorized - this order does not belong to you",
                success: false
            });
        }

        if (order.orderStatus !== "placed") {
            return res.status(400).json({
                message: `Order already ${order.orderStatus}`,
                success: false
            });
        }

        order.orderStatus = status;
        if (status === "cancelled") {
            order.cancelledAt = new Date();

            // restore stock if cancelled
            await Product.findByIdAndUpdate(order.product._id, {
                $inc: { stock: order.quantity }
            });
        }
        await order.save();

        return res.status(200).json({
            success: true,
            message: `Order ${status} successfully`,
            data: order
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};

export const processFulfillment = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // "shipped" or "delivered"
        const sellerId = req.user._id;

        const validStatus = ["shipped", "delivered"];
        if (!validStatus.includes(status)) {
            return res.status(400).json({
                message: "Status must be shipped or delivered",
                success: false
            });
        }

        const order = await Order.findById(id)
            .populate("product");
        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                success: false
            });
        }
        if (order.product.user.toString() !== sellerId.toString()) {
            return res.status(403).json({
                message: "Unauthorized - this order does not belong to you",
                success: false
            });
        }

        if (status === "shipped" && order.orderStatus !== "confirmed") {
            return res.status(400).json({
                message: "Order must be confirmed before shipping",
                success: false
            });
        }

        if (status === "delivered" && order.orderStatus !== "shipped") {
            return res.status(400).json({
                message: "Order must be shipped before delivered",
                success: false
            });
        }

        order.orderStatus = status;
        if (status === "delivered") {
            order.deliveredAt = new Date();

            // update payment to success on delivery
            await Payment.findOneAndUpdate(
                { order: orderId },
                { status: "success" }
            );
        }
        await order.save();

        return res.status(200).json({
            success: true,
            message: `Order ${status} successfully`,
            data: order
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};

export const trackSellerEarnings = async (req, res) => {
    try {
        const sellerId = req.user._id;

        // ─── GET SELLER PRODUCTS ──────────────────────────
        const products = await Product.find({ user: sellerId });
        const productIds = products.map(p => p._id);

        // ─── GET ORDERS FOR SELLER PRODUCTS ───────────────
        const orders = await Order.find({ product: { $in: productIds } });
        const orderIds = orders.map(o => o._id);

        // ─── GET PAYMENTS ─────────────────────────────────
        const payments = await Payment.find({ order: { $in: orderIds } });

        // ─── EARNINGS BREAKDOWN ───────────────────────────
        const totalEarnings = payments
            .filter(p => p.status === "success")
            .reduce((sum, p) => sum + p.amount, 0);

        const pendingEarnings = payments
            .filter(p => p.status === "pending")
            .reduce((sum, p) => sum + p.amount, 0);

        const refundedEarnings = payments
            .filter(p => p.status === "refunded")
            .reduce((sum, p) => sum + p.amount, 0);

        const netEarnings = totalEarnings - refundedEarnings;

        // ─── EARNINGS BY PAYMENT METHOD ───────────────────
        const earningsByMethod = payments
            .filter(p => p.status === "success")
            .reduce((acc, p) => {
                acc[p.paymentMethod] = (acc[p.paymentMethod] || 0) + p.amount;
                return acc;
            }, {});

        return res.status(200).json({
            success: true,
            data: {
                totalEarnings,
                pendingEarnings,
                refundedEarnings,
                netEarnings,
                earningsByMethod: {
                    COD: earningsByMethod["COD"] || 0,
                    upi: earningsByMethod["upi"] || 0,
                    bank_transfer: earningsByMethod["bank_transfer"] || 0,
                }
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};

export const monitorPayoutStatus = async (req, res) => {
    try {
        const sellerId = req.user._id;

        // ─── GET SELLER PRODUCTS ──────────────────────────
        const products = await Product.find({ user: sellerId });
        const productIds = products.map(p => p._id);

        // ─── GET ORDERS FOR SELLER PRODUCTS ───────────────
        const orders = await Order.find({ product: { $in: productIds } });
        const orderIds = orders.map(o => o._id);

        // ─── GET PAYMENTS ─────────────────────────────────
        const payments = await Payment.find({ order: { $in: orderIds } })
            .populate("order", "totalAmount orderStatus")
            .populate("user", "name email");

        const success = payments.filter(p => p.status === "success");
        const pending = payments.filter(p => p.status === "pending");
        const failed = payments.filter(p => p.status === "failed");
        const refunded = payments.filter(p => p.status === "refunded");

        const totalTransactions = payments.length;
        const successTransactions = success.length;

        const successRate = totalTransactions
            ? ((successTransactions / totalTransactions) * 100).toFixed(2) + "%"
            : "0%";

        return res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalTransactions,
                    successTransactions,
                    pendingTransactions: pending.length,
                    failedTransactions: failed.length,
                    refundedTransactions: refunded.length,
                    successRate
                },
                payments: {
                    success,
                    pending,
                    failed,
                    refunded
                }
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};


export const getmyproducts = async (req, res) => {
    try {


        const page = parseInt(req.query.page) || 1;
        const perPage = 3;
        const totlaPost = await Product.countDocuments();
        const totalpage = Math.ceil(totlaPost / perPage);
        if (page > totalpage) {
            return res.status(404).json({
                message: "page not found",
                success: false
            })
        }

        const products = await Product.find({ user: req.user.id }).skip((page - 1) * perPage).limit(perPage).exec();
        console.log(products, "products")
        return res.status(200).json({
            message: "products get successfully",
            data: [products, "totalpages : " + totalpage, "page : " + page],
            success: true
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password -otp -resetToken'); 

        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
}

export const updateMyProfile = async (req, res) => {
    try {
        const { name, phone } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { name, phone } },
            { new: true }
        ).select('-password -otp -resetToken');

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
}