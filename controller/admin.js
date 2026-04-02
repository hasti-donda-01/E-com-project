import { Product } from "../models/product.js";
import { Seller } from "../models/seller.js"
import { User } from "../models/user.js";

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