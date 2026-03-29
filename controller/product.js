import { assert } from "node:console";
import { Product } from "../models/product.js";
import fs from 'fs';

export const createProduct = async (req, res) => {
    try {

        const { name, price, brand, stock } = req.body;
        console.log(req.file.filename, "fle");
        const image = req.file.filename;
        if (!name || !price || !brand || !image || !stock) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields"
            });
        }

        const payload = {
            name, price, brand, image: `http://localhost:7000/image/${req.file.filename}`, stock, imagename: req.file.filename
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
        const products = await Product.find();
        console.log(products)
        return res.status(200).json({
            message: "products get successfully",
            data: products,
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
        console.log(req.file,"file")
        const { name, price, brand, stock, image } = req.body;

        const payload = {
            name, price, brand, image: `http://localhost:7000/image/${req.file.filename}`, stock, imagename: req.file.filename
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