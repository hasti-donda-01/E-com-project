import { Order } from "../models/order.js";
import { Payment } from "../models/payment.js";
import { Product } from "../models/product.js";
import { Return } from "../models/return.js";

export const requestReturn = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(req.params, "p")
        const { reason } = req.body;
        console.log(id, "req.user")
        const userId = req.user.id;

        const order = await Order.findOne({ _id: id, userId });
        console.log(order, "order")
        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                success: false
            });
        }

        if (order.orderStatus !== "delivered") {
            return res.status(400).json({
                message: "Only delivered orders can be returned",
                success: false
            });
        }
        if (order.returnRequest?.isRequested) {
            return res.status(400).json({
                message: "Return already requested for this order",
                success: false
            });
        }
        const payment = await Payment.findOne({ order: id });
        order.returnRequest = await Return.create({
            order: id,
            user: userId,
            product: order.product,
            payment: payment._id,
            reason,
            refundAmount: order.totalAmount
        });
        // await order.save();

        return res.status(200).json({
            success: true,
            message: "Return requested successfully",
            data: order
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};

export const approvereq = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const returnRequest = await Return.findById(id);
        if (!returnRequest) {
            return res.status(404).json({
                message: "Return request not found",
                success: false
            });
        }

        if (returnRequest.status !== "pending") {
            return res.status(400).json({
                message: `Return already ${returnRequest.status}`,
                success: false
            });
        }

        returnRequest.status = status;
        returnRequest.resolvedAt = new Date();
        await returnRequest.save();

        if (status === "approved") {

            await Payment.findByIdAndUpdate(returnRequest.payment, {
                status: "refunded"
            });
            await Order.findByIdAndUpdate(returnRequest.order, {
                orderStatus: "cancelled",
                paymentStatus: "failed"
            });

            const order = await Order.findById(returnRequest.order);
            await Product.findByIdAndUpdate(returnRequest.product, {
                $inc: { stock: order.quantity }
            });
        }

        return res.status(200).json({
            success: true,
            message: `Return ${status} successfully`,
            data: returnRequest
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};


export const getSellerRefundRequests = async (req, res) => {
    try {
        const sellerId = req.user.id;

        const products = await Product.find({ user: sellerId });
        const productIds = products.map(p => p._id);

        if (productIds.length === 0) {
            return res.status(200).json({
                message: "No products found for this seller",
                success: true,
                data: []
            });
        }

        const returnRequests = await Return.find({
            product: { $in: productIds }
        })
            .populate("user", "name email phone")
            .populate("product", "name price image")
            .populate("order", "totalAmount orderStatus paymentStatus quantity")
            .populate("payment", "paymentMethod status amount")
            .sort({ createdAt: -1 });

        const pending = returnRequests.filter(r => r.status === "pending");
        const approved = returnRequests.filter(r => r.status === "approved");
        const rejected = returnRequests.filter(r => r.status === "rejected");

        return res.status(200).json({
            success: true,
            message: "Refund requests fetched successfully",
            data: {
                summary: {
                    total: returnRequests.length,
                    pending: pending.length,
                    approved: approved.length,
                    rejected: rejected.length
                },
                requests: {
                    pending,
                    approved,
                    rejected
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

export const sellerHandleRefund = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, sellerNote } = req.body;
        const sellerId = req.user.id;

        const validStatus = ["approved", "rejected"];
        if (!validStatus.includes(status)) {
            return res.status(400).json({
                message: "Status must be approved or rejected",
                success: false
            });
        }

        const returnRequest = await Return.findById(id)
            .populate("product");

        if (!returnRequest) {
            return res.status(404).json({
                message: "Return request not found",
                success: false
            });
        }

        if (returnRequest.product.user.toString() !== sellerId.toString()) {
            return res.status(403).json({
                message: "Unauthorized — this return request does not belong to your product",
                success: false
            });
        }

        if (returnRequest.status !== "pending") {
            return res.status(400).json({
                message: `Return request already ${returnRequest.status}`,
                success: false
            });
        }

        // ✅ update return request
        returnRequest.status = status;
        returnRequest.resolvedBy = "seller";
        returnRequest.resolvedAt = new Date();
        returnRequest.sellerNote = sellerNote || null;
        await returnRequest.save();

        if (status === "approved") {

            await Payment.findByIdAndUpdate(returnRequest.payment, {
                status: "refunded"
            });

            await Order.findByIdAndUpdate(returnRequest.order, {
                orderStatus: "cancelled",
                paymentStatus: "failed"
            });

            const order = await Order.findById(returnRequest.order);
            await Product.findByIdAndUpdate(returnRequest.product._id, {
                $inc: { stock: order.quantity }
            });
        }

        return res.status(200).json({
            success: true,
            message: `Refund request ${status} successfully`,
            data: {
                returnId: returnRequest._id,
                status: returnRequest.status,
                resolvedBy: returnRequest.resolvedBy,
                resolvedAt: returnRequest.resolvedAt,
                sellerNote: returnRequest.sellerNote
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};

export const trackrefund = async (req, res) => {
    try {
        const returns = await Return.find()
            .populate("user", "name email phone")
            .populate("order", "totalAmount orderStatus paymentStatus")
            .populate("payment", "paymentMethod amount status")
            .populate("product", "name price image");

        const pending = returns.filter(r => r.status === "pending");
        const approved = returns.filter(r => r.status === "approved");
        const rejected = returns.filter(r => r.status === "rejected");

        const totalRefundedAmount = approved
            .reduce((sum, r) => sum + r.refundAmount, 0);

        return res.status(200).json({
            success: true,
            data: {
                summary: {
                    total: returns.length,
                    pending: pending.length,
                    approved: approved.length,
                    rejected: rejected.length,
                    totalRefundedAmount
                },
                returns: {
                    pending,
                    approved,
                    rejected
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


export const adjustPaymentRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, amount } = req.body;

        const validStatus = ["pending", "success", "failed", "refunded"];
        if (status && !validStatus.includes(status)) {
            return res.status(400).json({
                message: `Invalid status. Must be one of: ${validStatus.join(", ")}`,
                success: false
            });
        }

        const payment = await Payment.findById(id)
            .populate("order")
            .populate("user", "name email");

        if (!payment) {
            return res.status(404).json({
                message: "Payment not found",
                success: false
            });
        }

        if (status) payment.status = status;
        if (amount) payment.amount = amount;
        await payment.save();

        if (status) {
            await Order.findByIdAndUpdate(payment.order._id, {
                paymentStatus: status === "success" ? "paid" :
                    status === "refunded" ? "failed" : status
            });
        }

        return res.status(200).json({
            success: true,
            message: "Payment record adjusted successfully",
            data: payment
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};


