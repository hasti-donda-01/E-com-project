import { Address } from "../models/address.js";
import { Cart } from "../models/cart.js";
import { Order } from "../models/order.js";
import { Payment } from "../models/payment.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";

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
        const { product, paymentMethod, quantity, paymentStatus, orderStatus, buyNow, address } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
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

        // ─── BUY NOW ───────────────────────────────────────────
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
                sellerId: productDoc.user,  // ✅ fixed — was product.user._id (wrong)
                totalAmount,
                quantity,
                address: deliveryAddress._id,
                paymentMethod,
                paymentStatus,
                orderStatus
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

        // ─── CART CHECKOUT ─────────────────────────────────────
        else {
            const cartItems = await Cart.find({ user: userId }).populate('product');
            //                                                    ✅ populate to get sellerId

            if (cartItems.length === 0) {
                return res.status(400).json({
                    message: "Cart is empty",
                    success: false
                });
            }

            const orders = await Promise.all(
                cartItems.map(async (item) => {
                    const order = await Order.create({
                        product: item.product._id,
                        userId: userId,
                        sellerId: item.product.user,  // ✅ fixed — now possible after populate
                        quantity: item.quantity,
                        totalAmount: item.total,
                        address: deliveryAddress._id,
                        paymentMethod,
                        paymentStatus,
                        orderStatus
                    });

                    await Payment.create({
                        order: order._id,
                        user: userId,
                        amount: item.total,
                        paymentMethod,
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
    const { orderId } = req.params;
    const { status } = req.body;

    // find payment using orderId
    const payment = await Payment.findOne({ orderId });

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
        const order = await Order.findOneAndUpdate({ _id: req.params.id }, { $set: { orderStatus: "cancelled" } });
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

