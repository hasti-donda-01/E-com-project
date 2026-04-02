import { Product } from "../models/product.js"

export const filterProducts = async (req, res) => {
    try {
        const product = await Product.find(req.query);
        return res.status(200).json({
            data: product
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const categorybasedbrowse = async (req, res) => {
    try {
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
        ]);
        return res.status(200).json({
            data: products
        })
    } catch (error) {
        return res.status(500).json({
            messsage: error.message,
            success: false
        })
    }
}