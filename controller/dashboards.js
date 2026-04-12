import { Order } from "../models/order.js";
import { Payment } from "../models/payment.js";
import { Product } from "../models/product.js";
import { Seller } from "../models/seller.js";
import { User } from "../models/user.js";

//seller dashboard
// export const getalluser = async (req, res) => {
//     try {
//         const sellerId = req.params.id;

//         const orders = await Order.find({ sellerId:sellerId });

//         const payments = await Payment.find({ user: sellerId });
//         console.log(payments)

//         const totalOrders = orders.length;
//         const completedOrders = orders.filter(o => o.orderStatus === "delivered").length;
//         const pendingOrders = orders.filter(o => o.orderStatus === "pending").length;
//         console.log(completedOrders, "pendingOrders");
//         const cancelledOrders = orders.filter(o => o.orderStatus === "cancelled").length;
//         const totalEarnings = payments
//             .filter(p => p.status === "paid")
//             .reduce((sum, p) => sum + p.amount, 0);

//         const pendingEarnings = payments
//             .filter(p => p.status === "pending")
//             .reduce((sum, p) => sum + p.amount, 0);

//         console.log(pendingEarnings, "pendingEarnings")
//         const earningsByMethod = payments
//             .filter(p => p.status === "paid")
//             .reduce((acc, p) => {
//                 acc[p.paymentMethod] = ([p.paymentMethod] || 0) + p.amount;
//                 return acc;
//             }, {});

//         const totalProducts = await Product.countDocuments({ seller: sellerId });

//         const orderStats = {
//             total: totalOrders,
//             completed: completedOrders,
//             pending: pendingOrders,
//             cancelled: cancelledOrders,
//             completionRate: totalOrders
//                 ? ((completedOrders / totalOrders) * 100).toFixed(2) + "%"
//                 : "0%"
//         };

//         return res.status(200).json({
//             success: true,
//             data: {
//                 salesSummary: {
//                     totalOrders,
//                     completedOrders,
//                     pendingOrders,
//                     cancelledOrders,
//                     totalProducts
//                 },
//                 earningsOverview: {
//                     totalEarnings,
//                     pendingEarnings,
//                     earningsByMethod
//                 },
//                 orderStatistics: orderStats
//             }
//         });

//     } catch (error) {
//         return res.status(500).json({
//             message: error.message,
//             success: false
//         });
//     }
// };


export const getalluser = async (req, res) => {
    try {
        const sellerId = req.params.id;

        // Fetch orders for this seller
        const orders = await Order.find({ sellerId: sellerId });

        // Fetch payments for this seller's orders
        const orderIds = orders.map(o => o._id);
        const payments = await Payment.find({ order: { $in: orderIds } });

        // Order stats
        const totalOrders = orders.length;
        const completedOrders = orders.filter(o => o.orderStatus === "delivered").length;
        const pendingOrders = orders.filter(o => o.orderStatus === "placed" || o.orderStatus === "confirmed" || o.orderStatus === "shipped").length;
        const cancelledOrders = orders.filter(o => o.orderStatus === "cancelled").length;

        // Earnings — your Payment schema uses "success" not "paid"
        const totalEarnings = payments
            .filter(p => p.status === "success")
            .reduce((sum, p) => sum + p.amount, 0);

        const pendingEarnings = payments
            .filter(p => p.status === "pending")
            .reduce((sum, p) => sum + p.amount, 0);

        const earningsByMethod = payments
            .filter(p => p.status === "success")
            .reduce((acc, p) => {
                acc[p.paymentMethod] = (acc[p.paymentMethod] || 0) + p.amount;
                return acc;
            }, {});

        // Total products by this seller
        const totalProducts = await Product.countDocuments({ user: sellerId });

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
                orderStatistics: {
                    total: totalOrders,
                    completed: completedOrders,
                    pending: pendingOrders,
                    cancelled: cancelledOrders,
                    completionRate: totalOrders
                        ? ((completedOrders / totalOrders) * 100).toFixed(2) + "%"
                        : "0%"
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

export const adminDashboard = async (req, res) => {
    try {

        // ─── USERS & SELLERS ─────────────────────────────
        const totalUsers = await User.countDocuments({ role: "customer" });
        const totalSellers = await User.countDocuments({ role: "seller" });
        const totalAdmins = await User.countDocuments({ role: "Admin" });
        const blockedUsers = await User.countDocuments({ status: "blocked" });
        const activeUsers = await User.countDocuments({ isActive: true });

        const approvedSellers = await Seller.countDocuments({ isApproved: true });
        const pendingSellers = await Seller.countDocuments({ isApproved: false });

        // ─── ORDERS ──────────────────────────────────────
        const orders = await Order.find();

        const totalOrders = orders.length;
        const placedOrders = orders.filter(o => o.orderStatus === "placed").length;
        const confirmedOrders = orders.filter(o => o.orderStatus === "confirmed").length;
        const shippedOrders = orders.filter(o => o.orderStatus === "shipped").length;
        const deliveredOrders = orders.filter(o => o.orderStatus === "delivered").length;
        const cancelledOrders = orders.filter(o => o.orderStatus === "cancelled").length;

        // ─── REVENUE ANALYTICS ───────────────────────────
        const payments = await Payment.find();

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

        const revenueByMethod = payments
            .filter(p => p.status === "success")
            .reduce((acc, p) => {
                acc[p.paymentMethod] = (acc[p.paymentMethod] || 0) + p.amount;
                return acc;
            }, {});

        // ─── PLATFORM STATISTICS ─────────────────────────
        const totalProducts = await Product.countDocuments();
        const totalPayments = payments.length;

        const successPayments = payments.filter(p => p.status === "success").length;
        const pendingPayments = payments.filter(p => p.status === "pending").length;
        const failedPayments = payments.filter(p => p.status === "failed").length;
        const refundedPayments = payments.filter(p => p.status === "refunded").length;

        const successRate = totalPayments
            ? ((successPayments / totalPayments) * 100).toFixed(2) + "%"
            : "0%";

        const averageOrderValue = successPayments
            ? (totalRevenue / successPayments).toFixed(2)
            : 0;

        const orderCompletionRate = totalOrders
            ? ((deliveredOrders / totalOrders) * 100).toFixed(2) + "%"
            : "0%";

        return res.status(200).json({
            success: true,
            data: {
                usersAndSellers: {
                    totalUsers,
                    activeUsers,
                    blockedUsers,
                    totalSellers,
                    approvedSellers,
                    pendingSellers,
                    totalAdmins
                },
                orders: {
                    totalOrders,
                    placedOrders,
                    confirmedOrders,
                    shippedOrders,
                    deliveredOrders,
                    cancelledOrders,
                    orderCompletionRate
                },

                revenueAnalytics: {
                    totalRevenue,
                    pendingRevenue,
                    refundedRevenue,
                    netRevenue,
                    revenueByMethod: {
                        COD: revenueByMethod["COD"] || 0,
                        upi: revenueByMethod["upi"] || 0,
                        bank_transfer: revenueByMethod["bank_transfer"] || 0,
                    }
                },

                // 4. Platform Statistics
                platformStatistics: {
                    totalProducts,
                    totalPayments,
                    successPayments,
                    pendingPayments,
                    failedPayments,
                    refundedPayments,
                    successRate,
                    averageOrderValue
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