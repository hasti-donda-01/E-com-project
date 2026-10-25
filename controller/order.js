import crypto from "node:crypto";
import Razorpay from "razorpay";
import { Address } from "../models/address.js";
import { Cart } from "../models/cart.js";
import { Order } from "../models/order.js";
import { Payment } from "../models/payment.js";
import { PaymentAttempt } from "../models/paymentAttempt.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { Customer } from "../models/customer.js";

const getRazorpayClient = () => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
        return null;
    }
    return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

export const createRazorpayOrder = async (req, res) => {
    try {
        const razorpay = getRazorpayClient();
        if (!razorpay) {
            return res.status(503).json({
                message: "UPI checkout is not configured. Set the Razorpay keys on the server.",
                success: false
            });
        }

        const userId = req.user.id;
        const { address } = req.body;
        const deliveryAddress = await Address.findOne({ _id: address, user: userId });
        if (!deliveryAddress) {
            return res.status(404).json({
                message: "Address not found",
                success: false
            });
        }

        const cartItems = await Cart.find({ user: userId }).populate("product");
        if (cartItems.length === 0) {
            return res.status(400).json({ message: "Cart is empty", success: false });
        }

        const items = [];
        let amountPaise = 0;
        for (const cartItem of cartItems) {
            const quantity = Number(cartItem.quantity);
            if (!cartItem.product || !Number.isInteger(quantity) || quantity < 1) {
                return res.status(400).json({
                    message: "A cart item is no longer available. Please refresh your cart.",
                    success: false
                });
            }
            if (cartItem.product.stock < quantity) {
                return res.status(400).json({
                    message: `${cartItem.product.name} does not have enough stock.`,
                    success: false
                });
            }

            const unitPrice = Number(cartItem.product.discountPrice) || Number(cartItem.product.price);
            amountPaise += Math.round(unitPrice * 100) * quantity;
            items.push({
                cartItem: cartItem._id,
                product: cartItem.product._id,
                quantity,
                unitPrice
            });
        }
        if (!Number.isSafeInteger(amountPaise) || amountPaise < 1) {
            return res.status(400).json({
                message: "The cart total is invalid.",
                success: false
            });
        }

        const gatewayOrder = await razorpay.orders.create({
            amount: amountPaise,
            currency: "INR",
            receipt: `cart_${String(userId).slice(-12)}_${Date.now()}`
        });
        await PaymentAttempt.create({
            user: userId,
            address: deliveryAddress._id,
            items,
            amountPaise,
            razorpayOrderId: gatewayOrder.id
        });

        return res.status(201).json({
            success: true,
            data: {
                keyId: process.env.RAZORPAY_KEY_ID,
                orderId: gatewayOrder.id,
                amount: gatewayOrder.amount,
                currency: gatewayOrder.currency
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Could not start UPI checkout.",
            success: false
        });
    }
};

export const verifyRazorpayPayment = async (req, res) => {
    let attempt;
    let razorpay;
    let claimed = false;
    let paymentCaptured = false;
    const decrementedProducts = [];
    const createdOrders = [];
    const createdOrderDocs = [];
    const createdPayments = [];
    let paymentId;

    try {
        const { razorpay_order_id: orderId, razorpay_payment_id, razorpay_signature: signature } = req.body;
        paymentId = razorpay_payment_id;
        if (!orderId || !paymentId || !signature) {
            return res.status(400).json({
                message: "Razorpay payment details are required.",
                success: false
            });
        }

        razorpay = getRazorpayClient();
        if (!razorpay) {
            return res.status(503).json({
                message: "UPI checkout is not configured on the server.",
                success: false
            });
        }

        attempt = await PaymentAttempt.findOne({ razorpayOrderId: orderId, user: req.user.id });
        if (!attempt) {
            return res.status(404).json({ message: "Payment attempt not found.", success: false });
        }
        if (attempt.status === "paid") {
            if (attempt.razorpayPaymentId !== paymentId) {
                return res.status(400).json({ message: "Payment does not match this order.", success: false });
            }
            const orders = await Order.find({ _id: { $in: attempt.orders } });
            return res.status(200).json({
                message: "Payment was already confirmed.",
                success: true,
                totalOrders: orders.length,
                orders
            });
        }
        if (attempt.status !== "pending") {
            return res.status(409).json({
                message: "This payment attempt is already being processed or has failed.",
                success: false
            });
        }

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${orderId}|${paymentId}`)
            .digest();
        const receivedSignature = Buffer.from(signature, "hex");
        if (
            receivedSignature.length !== expectedSignature.length ||
            !crypto.timingSafeEqual(receivedSignature, expectedSignature)
        ) {
            return res.status(400).json({ message: "Payment signature is invalid.", success: false });
        }

        const [gatewayOrder, payment] = await Promise.all([
            razorpay.orders.fetch(orderId),
            razorpay.payments.fetch(paymentId)
        ]);
        if (
            gatewayOrder.amount !== attempt.amountPaise ||
            gatewayOrder.currency !== "INR" ||
            payment.order_id !== orderId ||
            payment.amount !== attempt.amountPaise ||
            payment.currency !== "INR"
        ) {
            return res.status(400).json({ message: "Payment amount could not be verified.", success: false });
        }

        if (!["authorized", "captured"].includes(payment.status)) {
            return res.status(400).json({
                message: "UPI payment has not been captured. Please try again.",
                success: false
            });
        }

        const claimedAttempt = await PaymentAttempt.findOneAndUpdate(
            { _id: attempt._id, status: "pending" },
            { $set: { status: "processing", razorpayPaymentId: paymentId } },
            { new: true }
        );
        if (!claimedAttempt) {
            return res.status(409).json({
                message: "This payment attempt is already being processed.",
                success: false
            });
        }
        claimed = true;

        let capturedPayment = payment;
        if (payment.status === "authorized") {
            capturedPayment = await razorpay.payments.capture(paymentId, attempt.amountPaise, "INR");
        }
        if (capturedPayment.status !== "captured") {
            throw new Error("UPI payment could not be captured. Please try again.");
        }
        paymentCaptured = true;

        const productIds = attempt.items.map((item) => item.product);
        const products = await Product.find({ _id: { $in: productIds } });
        const productsById = new Map(products.map((productDoc) => [String(productDoc._id), productDoc]));

        for (const item of attempt.items) {
            const productDoc = productsById.get(String(item.product));
            if (!productDoc) {
                throw new Error("A purchased product is no longer available.");
            }
            const updatedProduct = await Product.findOneAndUpdate(
                { _id: item.product, stock: { $gte: item.quantity } },
                { $inc: { stock: -item.quantity } },
                { new: true }
            );
            if (!updatedProduct) {
                throw new Error(`${productDoc.name} is now out of stock. Please contact support for a refund.`);
            }
            decrementedProducts.push({ product: item.product, quantity: item.quantity });

            const totalAmount = Math.round(item.unitPrice * 100) * item.quantity / 100;
            const order = await Order.create({
                product: productDoc._id,
                userId: req.user.id,
                sellerId: productDoc.user,
                quantity: item.quantity,
                totalAmount,
                address: attempt.address,
                paymentMethod: "upi",
                paymentStatus: "paid",
                orderStatus: "placed"
            });
            createdOrders.push(order._id);
            createdOrderDocs.push(order);

            const paymentRecord = await Payment.create({
                order: order._id,
                user: req.user.id,
                amount: totalAmount,
                paymentMethod: "upi",
                status: "success",
                transactionId: paymentId,
                gatewayOrderId: orderId
            });
            createdPayments.push(paymentRecord._id);
        }

        await Cart.deleteMany({
            user: req.user.id,
            _id: { $in: attempt.items.map((item) => item.cartItem) }
        });
        attempt.status = "paid";
        attempt.razorpayPaymentId = paymentId;
        attempt.orders = createdOrders;
        await attempt.save();

        return res.status(200).json({
            message: "UPI payment successful and order placed.",
            success: true,
            totalOrders: createdOrders.length,
            orders: createdOrderDocs
        });
    } catch (error) {
        if (claimed) {
            try {
                await Promise.all([
                    Order.deleteMany({ _id: { $in: createdOrders } }),
                    Payment.deleteMany({ _id: { $in: createdPayments } }),
                    ...decrementedProducts.map(({ product, quantity }) =>
                        Product.updateOne({ _id: product }, { $inc: { stock: quantity } })
                    )
                ]);
            } catch (cleanupError) {
                console.error("Unable to roll back a failed Razorpay order:", cleanupError);
            }

            if (paymentCaptured) {
                try {
                    const refund = await razorpay.payments.refund(paymentId, {
                        amount: attempt.amountPaise,
                        notes: { reason: "Order could not be placed" }
                    });
                    try {
                        await PaymentAttempt.updateOne(
                            { _id: attempt._id },
                            { $set: { status: "failed", razorpayPaymentId: paymentId } }
                        );
                    } catch (attemptUpdateError) {
                        console.error("Unable to update the refunded Razorpay attempt:", attemptUpdateError);
                    }
                    return res.status(409).json({
                        message: `Payment was received but the order could not be placed. A refund has been initiated (${refund.id}).`,
                        success: false
                    });
                } catch (refundError) {
                    console.error("Automatic Razorpay refund failed:", refundError);
                    return res.status(502).json({
                        message: "Payment was captured but the order could not be confirmed. Please contact support with your Razorpay payment ID.",
                        success: false
                    });
                }
            }

            await PaymentAttempt.updateOne(
                { _id: attempt._id, status: "processing" },
                { $set: { status: "pending" } }
            );
        }
        return res.status(500).json({
            message: error.message || "Could not confirm the UPI payment.",
            success: false
        });
    }
};

// export const createOrder = async (req, res) => {

//     try {
//         // console.log(req.user, "req.user")
//         const { product, paymentMethod, quantity, paymentStatus, orderStatus, buyNow, address } = req.body;
//         const userId = req.user.id;
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({
//                 message: "User not found",
//                 success: false
//             });
//         }

//         let deliveryAddress;
//         if (address) {
//             deliveryAddress = await Address.findOne({ _id: address, user: userId });
//         } else {
//             deliveryAddress = await Address.findOne({ isDefault: true, user: userId });
//         }

//         if (!deliveryAddress) {
//             return res.status(404).json({
//                 message: "Address not found",
//                 success: false
//             });
//         }

//         if (buyNow) {
//             const products = await Product.findById(product);
//             if (!products) {
//                 return res.status(404).json({
//                     message: "Product not found",
//                     success: false
//                 });
//             }

//             const totalAmount = parseInt(quantity) * products.price;
//             console.log(quantity, "totalAmount")
//             const order = await Order.create({
//                 product,
//                 userId: req.user.id,
//                 sellerId: product.user._id,
//                 totalAmount,
//                 quantity,
//                 address: deliveryAddress._id,
//                 paymentMethod,
//                 paymentStatus,
//                 orderStatus
//             });

//             await Payment.create({
//                 order: order._id,
//                 user: user._id,
//                 amount: totalAmount,
//                 paymentMethod,
//             });

//             return res.status(201).json({
//                 message: "Order placed successfully",
//                 success: true
//             });
//         }

//         else {
//             console.log(req.user, "req.user")
//             const cartItems = await Cart.find({ user: req.user.id });
//             console.log(cartItems, "cartItems")
//             if (cartItems.length === 0) {
//                 return res.status(400).json({
//                     message: "Cart is empty",
//                     success: false
//                 });
//             }
//             const orders = await Promise.all(
//                 cartItems.map(async (item) => {
//                     const order = await Order.create({
//                         product: item.product,
//                         userId,
//                         quantity: item.quantity,
//                         totalAmount: item.total,
//                         address: deliveryAddress._id,
//                         paymentMethod,
//                         paymentStatus,
//                         orderStatus
//                     });



//                     await Payment.create({
//                         order: order._id,
//                         user: user._id,
//                         amount: item.total,
//                         paymentMethod,
//                     });

//                     return order;
//                 })
//             );

//             await Cart.deleteMany({ user: userId });

//             return res.status(201).json({
//                 message: "Orders placed successfully",
//                 success: true,
//                 totalOrders: orders.length
//             });
//         }

//     } catch (error) {
//         return res.status(500).json({
//             message: error.message,
//             success: false
//         });
//     }
// };

// update payment status


export const createOrder = async (req, res) => {
    try {
        const { product, paymentMethod, quantity, buyNow, address } = req.body;
        const userId = req.user.id;

        if (paymentMethod !== "COD") {
            return res.status(400).json({
                message: "Online payments must be completed through the payment gateway.",
                success: false
            });
        }

        const user = await User.findById(userId) || await Customer.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        let deliveryAddress;
        if (address) {
            deliveryAddress = await Address.findOne({ _id: address, user: userId });
        } else {
            deliveryAddress = await Address.findOne({ isDefault: true, user: userId });
        }

        if (!deliveryAddress) {
            return res.status(404).json({
                message: "Address not found",
                success: false
            });
        }

        if (buyNow) {
            const productDoc = await Product.findById(product);
            if (!productDoc) {
                return res.status(404).json({
                    message: "Product not found",
                    success: false
                });
            }

            const totalAmount = parseInt(quantity) * productDoc.price;

            const order = await Order.create({
                product: productDoc._id,
                userId: userId,
                sellerId: productDoc.user,
                totalAmount,
                quantity,
                address: deliveryAddress._id,
                paymentMethod,
                orderStatus: "placed",
                paymentStatus: "pending"
            });

            await Product.findByIdAndUpdate(productDoc._id, {
                $inc: { stock: -parseInt(quantity) }
            });



            await Payment.create({
                order: order._id,
                user: userId,
                amount: totalAmount,
                paymentMethod,
            });

            return res.status(201).json({
                message: "Order placed successfully",
                success: true,
                order
            });
        }

        else {
            const cartItems = await Cart.find({ user: userId }).populate('product');

            if (cartItems.length === 0) {
                return res.status(400).json({
                    message: "Cart is empty",
                    success: false
                });
            }

            const orderItems = [];
            for (const item of cartItems) {
                const itemQuantity = Number(item.quantity);
                if (!item.product || !Number.isInteger(itemQuantity) || itemQuantity < 1) {
                    return res.status(400).json({
                        message: "A cart item is no longer available. Please refresh your cart.",
                        success: false
                    });
                }
                if (item.product.stock < itemQuantity) {
                    return res.status(400).json({
                        message: `${item.product.name} does not have enough stock.`,
                        success: false
                    });
                }
                const unitPrice = Number(item.product.discountPrice) || Number(item.product.price);
                orderItems.push({
                    product: item.product,
                    quantity: itemQuantity,
                    totalAmount: unitPrice * itemQuantity
                });
            }

            const orders = await Promise.all(
                orderItems.map(async ({ product: productDoc, quantity: itemQuantity, totalAmount }) => {
                    const order = await Order.create({
                        product: productDoc._id,
                        userId: userId,
                        sellerId: productDoc.user,
                        quantity: itemQuantity,
                        totalAmount,
                        address: deliveryAddress._id,
                        paymentMethod,
                        orderStatus: "placed",
                        paymentStatus: "pending"
                    });

                    await Product.findByIdAndUpdate(productDoc._id, {
                        $inc: { stock: -itemQuantity }
                    });

                    await Payment.create({
                        order: order._id,
                        user: userId,
                        amount: totalAmount,
                        paymentMethod,
                        status: "pending",
                    });

                    return order;
                })
            );

            await Cart.deleteMany({ user: userId });

            return res.status(201).json({
                message: "Orders placed successfully",
                success: true,
                totalOrders: orders.length,
                orders
            });
        }

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};

// export const updatepaymentstatus = async (req, res) => {
//     try {
//         const { orderId, status, transactionId } = req.body;

//         const payment = Payment.findOne({ order: orderId });
//         if (!payment) {
//             return res.status(404).json({
//                 message: "payment not found",
//                 success: false
//             })
//         }
//         // payment.status = "paid";
//         // payment.transactionId = transactionId;
//         // await payment.save();
//         await payment.updateOne({
//             status: "paid", transactionId
//         })

//         return res.status(200).json({
//             message: "done"
//         })
//     } catch (error) {
//         return res.status(500).json({
//             message: error.message,
//             success: false
//         })
//     }
// }

// export const updatepaymentstatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { paymentStatus } = req.body;

//     const order = await Order.findById(id);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found"
//       });
//     }

//     // update status
//     order.paymentStatus = paymentStatus;

//     await order.save();

//     return res.status(200).json({
//       success: true,
//       message: "Payment status updated",
//       data: order
//     });

//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };


export const updatepaymentstatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // find payment using orderId
        const payment = await Payment.findOne({ order: id });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        // update status
        payment.status = status;

        await payment.save();

        return res.status(200).json({
            success: true,
            message: "Payment status updated",
            data: payment
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const trackOrder = async (req, res) => {
    try {

        const order = await Order.findOne({ _id: req.params.id });
        console.log(order)
        if (!order) {
            return res.status(404).json({
                message: "order not found",
                success: false
            })
        }
        return res.status(200).json({
            message: `your order is ${order.orderStatus}..`
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, { $set: { orderStatus: "cancelled" } });
        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                success: false
            })
        }
        return res.status(200).json({
            message: "order is cancelled",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const vieworderhistory = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const perPage = 3;
        const totlaPost = await Order.countDocuments();
        const totalpage = Math.ceil(totlaPost / perPage);
        if (page > totalpage) {
            return res.status(404).json({
                message: "page not found",
                success: false
            })
        }

        const orders = await Order.find({ userId: req.params.id }).skip((page - 1) * perPage).limit(perPage).exec();
        if (!orders) {
            return res.status(404).json({
                messagfe: "you don't have any order history",
                success: false
            })
        }


        return res.status(200).json({
            data: [orders, "totalpages : " + totalpage, "page no : " + page]
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

// export const trackpayment = async (req, res) => {
//     try {
//         const payment = await Payment.findOne({ _id: req.params.id });
//         console.log(payment, "payment");
//         if (!payment) {
//             return res.status(404).json({
//                 message: "payment Id not found",
//                 success: false
//             })
//         }
//         return res.status(200).json({
//             message: `status of the payment is ${payment.status} `,
//             success: true
//         })
//     } catch (error) {
//         return res.status(500).json({
//             message: error.message,
//             success: false
//         })
//     }
// }
export const trackpayment = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate("user", "name email")
            .populate("order");

        const success = payments.filter(p => p.status === "success");
        const pending = payments.filter(p => p.status === "pending");
        const failed = payments.filter(p => p.status === "failed");
        const refunded = payments.filter(p => p.status === "refunded");

        return res.status(200).json({
            success: true,
            data: {
                summary: {
                    total: payments.length,
                    success: success.length,
                    pending: pending.length,
                    failed: failed.length,
                    refunded: refunded.length,
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
        return res.status(500).json({ message: error.message, success: false });
    }
};

// export const revenue = async (req, res) => {
//     try {
//         const paymentspaid = await Payment.find({ status: "paid" });
//         const paymentpending = await Payment.find({ status: "pending" });

//         const totalRevenue = paymentspaid.reduce((sum, p) => {
//             return sum + parseInt(p.amount);
//         }, 0);
//         const pendingrev = paymentpending.reduce((sum, p) => {
//             return sum + parseInt(p.amount);
//         }, 0);

//         return res.status(200).json({
//             data: [totalRevenue + "  paymentspaid", pendingrev + "  pendingRevenue"],
//             // revenue: totalRevenue
//         });
//     } catch (error) {
//         return res.status(500).json({
//             message: error.message,
//             success: false
//         });
//     }
// };

export const revenue = async (req, res) => {
    try {
        const payments = await Payment.find();

        // ─── REVENUE OVERVIEW ─────────────────────────
        const totalRevenue = payments
            .filter(p => p.status === "success")
            .reduce((sum, p) => sum + p.amount, 0);

        const pendingRevenue = payments
            .filter(p => p.status === "pending")
            .reduce((sum, p) => sum + p.amount, 0);

        const refundedRevenue = payments
            .filter(p => p.status === "refunded")
            .reduce((sum, p) => sum + p.amount, 0);

        const netRevenue = totalRevenue - refundedRevenue;

        // ─── REVENUE BY PAYMENT METHOD ────────────────
        const revenueByMethod = payments
            .filter(p => p.status === "success")
            .reduce((acc, p) => {
                acc[p.paymentMethod] = (acc[p.paymentMethod] || 0) + p.amount;
                return acc;
            }, {});

        // ─── REVENUE STATISTICS ───────────────────────
        const totalTransactions = payments.length;
        const successTransactions = payments.filter(p => p.status === "success").length;

        const successRate = totalTransactions
            ? ((successTransactions / totalTransactions) * 100).toFixed(2) + "%"
            : "0%";

        const averageOrderValue = successTransactions
            ? (totalRevenue / successTransactions).toFixed(2)
            : 0;

        return res.status(200).json({
            success: true,
            data: {
                revenueOverview: {
                    totalRevenue,
                    pendingRevenue,
                    refundedRevenue,
                    netRevenue,
                },
                revenueByMethod: {
                    COD: revenueByMethod["COD"] || 0,
                    upi: revenueByMethod["upi"] || 0,
                    bank_transfer: revenueByMethod["bank_transfer"] || 0,
                },
                statistics: {
                    totalTransactions,
                    successTransactions,
                    successRate,
                    averageOrderValue
                }
            }
        });

    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};
