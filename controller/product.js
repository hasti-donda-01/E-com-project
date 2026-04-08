import { Product } from "../models/product.js";
import fs from 'fs';

export const createProduct = async (req, res) => {
    try {

        const { name, price, brand, stock, categoryId, user } = req.body;
        console.log(req.file.filename, "fle");
        const image = req.file.filename;
        if (!name || !price || !brand || !image || !stock || !categoryId) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields"
            });
        }

        const payload = {
            name, price, brand, image: `http://localhost:7000/image/${req.file.filename}`, stock, imagename: req.file.filename, categoryId, user: req.user.id
        }
        await Product.create(payload);
        return res.status(201).json({
            success: true,
            message: "product add successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

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
        console.log(products)
        return res.status(200).json({
            message: "products get successfully",
            data: [products, totalpage, page],
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

        const product = await Product.findOne({ _id: req.user._id });
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

        const product = await Product.findOneAndDelete({ _id: req.params.id });
        // console.log(product)
        await fs.unlinkSync(`./public/product/${product.imagename}`)
        return res.status(200).json({
            message: " product deleted successfully",
            success: false
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
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

        const product = await Product.findOneAndUpdate({ _id: req.params.id }, { $set: payload });
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