import { Product } from "../models/product.js";
import fs from 'fs';

export const createProduct = async (req, res) => {
    try {
        const { name, price, brand, stock, categoryId } = req.body;

        // Check file
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            });
        }

        const imageName = req.file.filename;

        if (!name || !price || !brand || !stock || !categoryId) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields"
            });
        }

        // Dynamic URL (important)
        const imageUrl = `${req.protocol}://${req.get("host")}/image/${imageName}`;

        const payload = {
            name,
            price,
            brand,
            stock,
            categoryId,
            user: req.user.id,
            image: imageUrl,
            imagename: imageName
        };

        await Product.create(payload);

        return res.status(201).json({
            success: true,
            message: "Product added successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getproducts = async (req, res) => {
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

        const products = await Product.find().skip((page - 1) * perPage).limit(perPage).exec();
        console.log(products, "products")
        return res.status(200).json({
            message: "products get successfully",
            data: [products, "totalpages : " + totalpage, "page : " + page],
            success: true
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getproductsbyid = async (req, res) => {
    try {

        const product = await Product.findOne({ _id: req.params.id });
        if (!product) {
            return res.status(400).json({
                message: "product not found",
                success: false
            })
        }
        return res.status(200).json({
            message: "product get successfully",
            success: true,
            data: product
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const deleteproduct = async (req, res) => {
    try {

        const product = await Product.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        await fs.unlinkSync(`./public/product/${product.imagename}`)
        return res.status(200).json({
            message: " product deleted successfully",
            success: false
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: true
        })
    }
}

export const updateproduct = async (req, res) => {
    try {
        console.log(req.file, "file")
        const { name, price, brand, stock, image, user } = req.body;

        const payload = {
            name, price, brand, image: `http://localhost:7000/image/${req.file.filename}`, user, stock, imagename: req.file.filename
        }

        const product = await Product.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, { $set: payload });
        await fs.unlinkSync(`./public/product/${product.imagename}`)
        return res.status(200).json({
            message: "product update successfully",
            success: true,
            data: product
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const totalProduct = async (req, res) => {

    try {
        const product = await Product.find();
        return res.status(200).json({
            message: "get successfully",
            data: product.length + " " + "product",
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const productbycategory = async (req, res) => {
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

        const products = await Product.find({ categoryId: req.params.id }).skip((page - 1) * perPage).limit(perPage).exec();;
        return res.status(200).json({
            messsage: "done",
            data: [products, "totalpage : " + totalpage, "count : " + products.length, "page no.: " + page],
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const setProductPricing = async (req, res) => {
    try {
        const { id } = req.params;
        const { price, discountPrice } = req.body;

        // calculate discount percent automatically
        const discountPercent = discountPrice
            ? (((price - discountPrice) / price) * 100).toFixed(2)
            : null;

        const product = await Product.findByIdAndUpdate(
            id,
            {
                price,
                discountPrice,
                discountPercent
            },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Pricing updated successfully",
            data: product
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};


export const updateStock = async (req, res) => {
    try {
        const { stock } = req.body;
        const { id } = req.params;

        if (stock === undefined || stock === null) {
            return res.status(400).json({
                message: "Please provide stock value",
                success: false
            });
        }

        if (stock < 0) {
            return res.status(400).json({
                message: "Stock cannot be negative",
                success: false
            });
        }

       
        const product = await Product.findOne({
            _id: id,
            user: req.user.id
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found or you are not authorized",
                success: false
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { $set: { stock } },
            { new: true }
        );

        return res.status(200).json({
            message: "Stock updated successfully",
            success: true,
            data: {
                productId: updatedProduct._id,
                name: updatedProduct.name,
                previousStock: product.stock,  
                updatedStock: updatedProduct.stock
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};