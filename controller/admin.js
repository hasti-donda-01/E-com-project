import mongoose from "mongoose";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { Seller } from "../models/seller.js"
import { User } from "../models/user.js";
import fs from 'fs'
import { Payment } from "../models/payment.js";

export const getallseller = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const perPage = 3;
        const totlaPost = await Seller.countDocuments();
        const totalpage = Math.ceil(totlaPost / perPage);
        if (page > totalpage) {
            return res.status(404).json({
                message: "page not found",
                success: false
            })
        }

        const sellers = await Seller.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "result"
                }
            },
            {
                $unwind: "$result"
            },
            {
                $project: {
                    // specification(s)
                    userId: 1,
                    storeName: 1,
                    storeDesc: 1,
                    category: 1,
                    businessType: 1,
                    gstin: 1,
                    panNumber: 1,
                    name: "$result.name",
                    email: "$result.email",
                    phone: "$result.phone",
                    role: "$result.seller"
                }
            }
        ]).skip((page - 1) * perPage).limit(perPage).exec();
        console.log(sellers, "seller")
        res.status(200).json({
            message: "All sellers get successfully",
            success: true,
            data: [sellers, "Total Pages : " + totalpage, "Page : " + page]
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const getalluser = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = 3;
        const totlaPost = await User.countDocuments();
        const totalpage = Math.ceil(totlaPost / perPage);
        if (page > totalpage) {
            return res.status(404).json({
                message: "page not found",
                success: false
            })
        }
        const users = await User.find().skip((page - 1) * perPage).limit(perPage).exec();
        return res.status(200).json({
            message: "Users Get Successfully",
            data: [users, "totalpage : " + totalpage, "page : " + page],
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}


export const getallproducts = async (req, res) => {
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

        const products = await Product.aggregate([
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "result"
                }
            },
            {
                $unwind: "$result"
            },
            {
                $project: {
                    price: 1,
                    brand: 1,
                    image: 1,
                    category_name: "$result.category_name",
                    category_Image: "$result.category_Image",
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]).skip((page - 1) * perPage).limit(perPage).exec();
        console.log(products)
        return res.status(200).json({
            message: "products get successfully",
            data: [products, "totalpage :  " + totalpage, "page : " + page],
            success: true
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.fondOneAndDelete({ _id: req.params.id });
        if (!product) {
            return res.status(404).json({
                message: "product not found",
                success: false
            })
        }
        fs.unlinkSync(`./public/product/${product.imagename}`);

        return res.status(200).json({
            message: "Product deleted successfully",
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}


//block - unblock user
export const accountstatus = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        console.log(user);
        if (!user) {
            return res.status(404).json({
                messsage: "user ot found",
                success: false
            })
        }

        if (user.role == 'Admin') {
            return res.status(400).json({
                message: 'You can not block or unblock admin',
                success: false
            })
        }
        if (user.status == 'blocked') {
            user.status = "unblocked";
            user.save()
        }
        else {
            user.status = "blocked";
            user.save()
        }

        return res.status(200).json({
            message: "done",
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

// export const monitorallorder = async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const perPage = 3;
//         const totlaPost = await Order.countDocuments();
//         const totalpage = Math.ceil(totlaPost / perPage);
//         if (page > totalpage) {
//             return res.status(404).json({
//                 message: "page not found",
//                 success: false
//             })
//         }

//         const orders = await Order.find().skip((page - 1) * perPage).limit(perPage).exec();
//         return res.status(200).json({
//             message: "get orders successfully",
//             success: true,
//             data: [orders, "totalpages : " + totalpage, "page : " + page]
//         })
//     } catch (error) {
//         return res.status(500).json({
//             message: error.message,
//             success: false
//         })
//     }
// }
export const monitorallorder = async (req, res) => {
    try {
        const { orderStatus, paymentStatus, paymentMethod, page = 1, limit = 1 } = req.query;

        const filter = {};

        // apply filters only if provided
        if (orderStatus) filter.orderStatus = orderStatus;
        if (paymentStatus) filter.paymentStatus = paymentStatus;
        if (paymentMethod) filter.paymentMethod = paymentMethod;

        const totalOrders = await Order.countDocuments(filter);

        const orders = await Order.find(filter)
            .populate('userId', 'name email -_id')   // buyer details
            .populate('sellerId', 'name email -_id')   // seller details
            .populate('product', 'name price -_id')   // product details
            .populate('address')                  // delivery address
            .sort({ createdAt: -1 })              // latest first
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        return res.status(200).json({
            success: true,
            totalOrders,
            currentPage: page,
            totalPages: Math.ceil(totalOrders / limit),
            orders
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateorderstatus = async (req, res) => {
    try {
        console.log(req.body, "order")
        console.log(req.params.id, "order")
        const order = await Order.findOneAndUpdate({ _id: req.params.id }, { $set: { orderStatus: req.body.orderStatus } });
        console.log(order, "order")
        if (!order) {
            return res.status(404).json({
                message: "orderId not found",
                success: false
            })
        }
        return res.status(200).json({
            message: "order status updated successfully",
            success: true,
            data: order
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}
//monitor customer activity
export const getCustomerDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        console.log(user, "user")
        if (user.role != 'customer') {

            return res.status(400).json({
                message: "User is not Customer"
            })
        }
        const orders = await Order.find({ userId: id });

        const totalOrders = orders.length;

        const totalSpent = orders.reduce((acc, order) => acc + order.totalAmount, 0);

        const cancelledOrders = orders.filter(o => o.orderStatus === "cancelled").length;

        res.status(200).json({
            success: true,
            user,
            totalOrders,
            totalSpent,
            cancelledOrders
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const approveSeller = async (req, res) => {
    try {
        const seller = await Seller.findOne({ userId: req.params.id });

        if (!seller) {
            return res.status(404).json({
                message: "Seller not found",
                success: false
            });
        }

        if (seller.isApproved) {
            return res.status(400).json({
                message: "Seller is already approved",
                success: false
            });
        }

        if (seller.isRejected) {
            return res.status(400).json({
                message: "Seller was rejected. Reset their status before approving.",
                success: false
            });
        }

        seller.isApproved = true;
        seller.isRejected = false;
        seller.rejectionReason = null;
        await seller.save();

        return res.status(200).json({
            message: "Seller approved successfully",
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};

export const rejectSeller = async (req, res) => {
    try {
        const { reason } = req.body;

        if (!reason) {
            return res.status(400).json({
                message: "Please provide a rejection reason",
                success: false
            });
        }

        const seller = await Seller.findOne({ userId: req.params.id });

        if (!seller) {
            return res.status(404).json({
                message: "Seller not found",
                success: false
            });
        }

        if (seller.isApproved) {
            return res.status(400).json({
                message: "Seller is already approved. Revoke approval before rejecting.",
                success: false
            });
        }

        if (seller.isRejected) {
            return res.status(400).json({
                message: "Seller is already rejected",
                success: false
            });
        }

        seller.isApproved = false;
        seller.isRejected = true;
        seller.rejectionReason = reason;
        await seller.save();

        return res.status(200).json({
            message: "Seller rejected successfully",
            success: true,
            data: {
                sellerId: seller._id,
                rejectionReason: seller.rejectionReason
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};

export const verifySeller = async (req, res) => {
    try {
        const seller = await Seller.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(req.params.id)

                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "result"
                }
            },
            {
                $unwind: "$result"
            },
            {
                $project: {
                    userId: 1,
                    isApproved: 1,
                    storeName: 1,
                    storeDesc: 1,
                    category: 1,
                    businessType: 1,
                    gstin: 1,
                    panNumber: 1,
                    sellerName: "$result.name",
                    sellerEmail: "$result.email",
                    phoneNo: "$result.phone",
                    isverify: "$result.isverify",
                    isApproved: "$result.isApproved",
                    Sellerstatus: "$result.status"
                }
            }
        ]);
        console.log("seller", seller);
        return res.status(200).json({
            data: seller
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}


//monitor seller activity

export const getSellerReport = async (req, res) => {
    try {
        const { id } = req.params;

        const orders = await Order.find({ sellerId: id });
        console.log(await Order.find(), "o");
        console.log(orders, "orders")
        const totalOrders = orders.length;

        const deliveredOrders = orders.filter(
            (o) => o.orderStatus === "delivered"
        ).length;

        const cancelledOrders = orders.filter(
            (o) => o.orderStatus === "cancelled"
        ).length;

        const pendingOrders = orders.filter(
            (o) => o.orderStatus === "pending"
        ).length;

        const revenue = orders
            .filter((o) => o.orderStatus === "delivered")
            .reduce((sum, o) => sum + o.totalAmount, 0);

        const totalProducts = await Product.countDocuments({ user: id });

        return res.status(200).json({
            success: true,
            data: {
                totalProducts,
                totalOrders,
                deliveredOrders,
                cancelledOrders,
                pendingOrders,
                revenue
            }
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};