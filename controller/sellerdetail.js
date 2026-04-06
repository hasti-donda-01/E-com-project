import { Order } from "../models/order.js";
import { Payment } from "../models/payment.js";
import { Product } from "../models/product.js";
import { Seller } from "../models/seller.js";
import { User } from "../models/user.js";

// export const getalluser = async (req, res) => {
//     try {

//         const users = await User.find({ _id: req.params.id });
//         const seller = await Seller.findOne({ userId: req.params.id });
//         const order = await Order.find({ userId: req.params.id });
//         const earning = await order.totalAmount;

//         const totalearning =
//             await order.reduce((sum,o) => sum + o.totalAmount, 0);

//         console.log(order, "order")
//         if (seller.isApproved == false) {
//             return res.status(400).json({
//                 message: "not approved",
//                 success: false
//             })
//         }
//         return res.status(200).json({
//             message: "Users Get Successfully",
//             data: [users, seller, [order], "earning : " + totalearning],
//             success: true
//         })
//     } catch (error) {
//         return res.status(500).json({
//             message: error.message,
//             success: false
//         })
//     }
// }

export const getalluser = async (req, res) => {
    try {
        const sellerId = req.params.id;

        // 1. Get all seller orders
        const orders = await Order.find({ userId: sellerId });

        // 2. Get all seller payments
        const payments = await Payment.find({ user: sellerId });
        console.log(payments)

        // ─── SALES SUMMARY ───────────────────────────────
        const totalOrders = orders.length;
        // console.log(totalOrders,orders)
        const completedOrders = orders.filter(o => o.orderStatus === "delivered").length;
        const pendingOrders = orders.filter(o => o.orderStatus === "pending").length;
        console.log(completedOrders, "pendingOrders");
        const cancelledOrders = orders.filter(o => o.orderStatus === "cancelled").length;

        // ─── EARNINGS OVERVIEW ───────────────────────────
        const totalEarnings = payments
            .filter(p => p.status === "paid")
            .reduce((sum, p) => sum + p.amount, 0);

        const pendingEarnings = payments
            .filter(p => p.status === "pending")
            .reduce((sum, p) => sum + p.amount, 0);

        console.log(pendingEarnings, "pendingEarnings")
        const earningsByMethod = payments
            .filter(p => p.status === "paid")
            .reduce((acc, p) => {
                acc[p.paymentMethod] = ([p.paymentMethod] || 0) + p.amount;
                return acc;
            }, {});

        // ─── ORDER STATISTICS ────────────────────────────
        const totalProducts = await Product.countDocuments({ seller: sellerId });

        const orderStats = {
            total: totalOrders,
            completed: completedOrders,
            pending: pendingOrders,
            cancelled: cancelledOrders,
            completionRate: totalOrders
                ? ((completedOrders / totalOrders) * 100).toFixed(2) + "%"
                : "0%"
        };

        return res.status(200).json({
            success: true,
            data: {
                salesSummary: {
                    totalOrders,
                    completedOrders,
                    pendingOrders,
                    cancelledOrders,
                    totalProducts
                },
                earningsOverview: {
                    totalEarnings,
                    pendingEarnings,
                    earningsByMethod
                },
                orderStatistics: orderStats
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};