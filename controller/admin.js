import mongoose from "mongoose";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { Seller } from "../models/seller.js"
import { User } from "../models/user.js";
import { Payment } from "../models/payment.js";
import { cloudinary } from "../config/cloudinary.js";

export const getallseller = async (req, res) => {
    try {
        const requestedPage = Number.parseInt(req.query.page, 10) || 1;
        const page = Math.max(requestedPage, 1);
        const perPage = 20;
        const total = await Seller.countDocuments();
        const totalPages = Math.ceil(total / perPage);
        if (totalPages > 0 && page > totalPages) {
            return res.status(404).json({
                message: "Page not found",
                success: false
            });
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
                $unwind: {
                    path: "$result",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    storeName: 1,
                    storeDesc: 1,
                    category: 1,
                    businessType: 1,
                    gstin: 1,
                    panNumber: 1,
                    isApproved: 1,
                    isRejected: 1,
                    rejectionReason: 1,
                    name: { $ifNull: ["$result.name", "—"] },
                    email: { $ifNull: ["$result.email", "—"] },
                    phone: { $ifNull: ["$result.phone", "—"] },
                    isActive: { $ifNull: ["$result.isActive", true] },
                    accountStatus: { $ifNull: ["$result.status", "unblocked"] },
                    createdAt: 1
                }
            },
            {
                $sort: { createdAt: -1, _id: -1 }
            }
        ]).skip((page - 1) * perPage).limit(perPage);
        return res.status(200).json({
            message: "All sellers get successfully",
            success: true,
            data: sellers,
            pagination: {
                page,
                perPage,
                total,
                totalPages
            }
        });
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
        const parsedPage = Number.parseInt(req.query.page, 10);
        const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
        const perPage = 24;
        const totalProducts = await Product.countDocuments();
        const totalPages = Math.ceil(totalProducts / perPage);
        const products = await Product.find()
            .populate('categoryId', 'category_name')
            .sort({ createdAt: -1 })
            .skip((page - 1) * perPage)
            .limit(perPage)
            .lean();

        return res.status(200).json({
            message: "Products fetched successfully",
            data: products.map((product) => ({
                ...product,
                category_name: product.categoryId?.category_name || null
            })),
            pagination: {
                page,
                perPage,
                totalProducts,
                totalPages
            },
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({
                message: "product not found",
                success: false
            })
        }
        let warning;
        if (product.imagename && product.image?.includes("res.cloudinary.com")) {
            try {
                await cloudinary.uploader.destroy(product.imagename);
            } catch (error) {
                console.error("Product image cleanup failed:", error);
                warning = "The product was deleted, but its image could not be removed.";
            }
        }

        return res.status(200).json({
            message: "Product deleted successfully",
            success: true,
            warning
        });
    } catch (error) {
        return res.status(error.name === "CastError" ? 400 : 500).json({
            message: error.message,
            success: false
        })
    }
}

export const updateAdminProduct = async (req, res) => {
    try {
        const { name, brand, price, stock } = req.body;
        const numericPrice = Number(price);
        const numericStock = Number(stock);

        if (
            typeof name !== "string" || !name.trim() ||
            typeof brand !== "string" || !brand.trim() ||
            !Number.isFinite(numericPrice) || numericPrice <= 0 ||
            !Number.isInteger(numericStock) || numericStock < 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Enter a product name, brand, positive price, and valid stock."
            });
        }

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        product.name = name.trim();
        product.brand = brand.trim();
        product.price = numericPrice;
        product.stock = numericStock;
        if (Number.isFinite(product.discountPercent)) {
            product.discountPrice = numericPrice * (1 - product.discountPercent / 100);
        }
        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product updated successfully.",
            data: product
        });
    } catch (error) {
        return res.status(error.name === "CastError" ? 400 : 500).json({
            success: false,
            message: error.message
        });
    }
};


// block - unblock user / seller
export const accountstatus = async (req, res) => {
    try {
        const id = req.params.id;
        let user = null;
        if (mongoose.isValidObjectId(id)) {
            user = await User.findById(id);
            if (!user) {
                const seller = await Seller.findById(id);
                if (seller && seller.userId) {
                    user = await User.findById(seller.userId);
                }
            }
        }

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        if (String(user.role).toLowerCase() === 'admin') {
            return res.status(400).json({
                message: 'You cannot block or unblock admin',
                success: false
            });
        }

        const isCurrentlyBlocked = user.status === 'blocked' || user.isActive === false;
        if (isCurrentlyBlocked) {
            user.status = "unblocked";
            user.isActive = true;
        } else {
            user.status = "blocked";
            user.isActive = false;
        }
        await user.save();

        return res.status(200).json({
            message: `Seller account ${user.status === 'blocked' ? 'blocked' : 'unblocked'} successfully`,
            success: true,
            data: {
                userId: user._id,
                status: user.status,
                isActive: user.isActive
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
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
        const validStatuses = ["placed", "confirmed", "shipped", "delivered", "cancelled"];
        if (!validStatuses.includes(req.body.orderStatus)) {
            return res.status(400).json({
                message: "Invalid order status.",
                success: false
            });
        }
        const updateData = { orderStatus: req.body.orderStatus };
        if (req.body.orderStatus === "delivered") {
            updateData.deliveredAt = new Date();
        }
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );
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
        });

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
        const id = req.params.id;
        let seller = null;
        if (mongoose.isValidObjectId(id)) {
            seller = await Seller.findById(id);
            if (!seller) {
                seller = await Seller.findOne({ userId: id });
            }
        }

        if (!seller) {
            return res.status(404).json({
                message: "Seller not found",
                success: false
            });
        }

        seller.isApproved = true;
        seller.isRejected = false;
        seller.rejectionReason = null;
        await seller.save();

        if (seller.userId) {
            await User.findByIdAndUpdate(seller.userId, {
                isActive: true,
                status: "unblocked"
            });
        }

        return res.status(200).json({
            message: "Seller approved successfully",
            success: true,
            data: seller
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
        const id = req.params.id;
        const { reason } = req.body;

        let seller = null;
        if (mongoose.isValidObjectId(id)) {
            seller = await Seller.findById(id);
            if (!seller) {
                seller = await Seller.findOne({ userId: id });
            }
        }

        if (!seller) {
            return res.status(404).json({
                message: "Seller not found",
                success: false
            });
        }

        seller.isApproved = false;
        seller.isRejected = true;
        seller.rejectionReason = reason || "Application rejected by admin";
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

export const getAllSellerPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate({
                path: "order",
                select: "sellerId totalAmount orderStatus paymentMethod",
                populate: {
                    path: "sellerId",
                    select: "name email"
                }
            })
            .populate("user", "name email");

        const formatted = payments.map(p => ({
            paymentId: p._id,
            amount: p.amount,
            status: p.status,
            paymentMethod: p.paymentMethod,
            transactionId: p.transactionId,
            seller: {
                id: p.order?.sellerId?._id,
                name: p.order?.sellerId?.name,
                email: p.order?.sellerId?.email
            },
            order: {
                id: p.order?._id,
                totalAmount: p.order?.totalAmount,
                orderStatus: p.order?.orderStatus,
            },
            buyer: {
                id: p.user?._id,
                name: p.user?.name,
                email: p.user?.email
            }
        }));

        return res.status(200).json({
            success: true,
            total: payments.length,
            data: formatted
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};