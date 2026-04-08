import { Category } from "../models/category.js";
import { Product } from "../models/product.js"

// export const filterProducts = async (req, res) => {
//     try {
//         const product = await Product.find(req.query);
//         return res.status(200).json({
//             data: product
//         })
//     } catch (error) {
//         return res.status(500).json({
//             message: error.message,
//             success: false
//         })
//     }
// }

export const filterProducts = async (req, res) => {
    try {
        const {
            name,
            categoryName,
            minPrice,
            maxPrice,
            status,
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            order = 'desc'
        } = req.query;

        const filter = {};

        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }

        // Find category by name then filter by its _id
        if (categoryName) {
            const category = await Category.findOne({
                name: { $regex: categoryName, $options: 'i' }
            });

            if (!category) {
                return res.status(404).json({
                    message: "Category not found",
                    success: false
                });
            }

            filter.categoryId = category._id;
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        if (status) {
            filter.status = status;
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const sortOrder = order === 'asc' ? 1 : -1;

        const [products, total] = await Promise.all([
            Product.find(filter)
                .populate('categoryId', 'category_name')  
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limitNum)
                .select('-__v'),

            Product.countDocuments(filter)
        ]);

        return res.status(200).json({
            message: "Products fetched successfully",
            success: true,
            total,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum),
            data: products
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};

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
