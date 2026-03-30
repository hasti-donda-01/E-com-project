import { Category } from "../models/category.js";
import fs from 'fs';
export const createCategory = async (req, res) => {
    try {

        console.log(req.file, "reqfile");
        const category_Image = req.file.filename
        const { category_name } = req.body;


        if (!category_name || !category_Image) {
            return res.status(400).json({
                message: "please fill all the fields",
                success: false
            });

        }
        const category = await Category.findOne({ category_name });
        if (category) {
            return res.status(400).json({
                message: "Category Name already exist",
                success: false
            })
        }

        const payload = { category_name, category_Image: `http://localhost:7000/category_Image/${req.file.filename}`, imagename: req.file.filename }
        await Category.create(payload);
        return res.status(201).json({
            message: "Category Created successfully",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const getcategory = async (req, res) => {
    try {
        const category = await Category.find();
        console.log(category)
        return res.status(200).json({
            message: "categories get successfully",
            data: category,
            success: true
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getcategorybyid = async (req, res) => {
    try {

        const category = await Category.findOne({ _id: req.params.id });
        if (!category) {
            return res.status(400).json({
                message: "category not found",
                success: false
            })
        }
        return res.status(200).json({
            message: "category get successfully",
            success: true,
            data: category
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const deletecategory = async (req, res) => {
    try {

        const category = await Category.findOneAndDelete({ _id: req.params.id });
        // console.log(product)
        await fs.unlinkSync(`./public/category/${category.imagename}`)
        return res.status(200).json({
            message: " category deleted successfully",
            success: false
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const updatecategory = async (req, res) => {
    try {
        console.log(req.file, "file")
        const { category_name, category_Image } = req.body;

        const payload = {
            category_name, category_Image: `http://localhost:7000/category_Image/${req.file.filename}`, imagename: req.file.filename
        }

        const category = await Category.findOneAndUpdate({ _id: req.params.id }, { $set: payload });
        console.log(category, "category")
        await fs.unlinkSync(`./public/category/${category.imagename}`)
        return res.status(200).json({
            message: "product update successfully",
            success: true,
            data: category
        })
    } catch (error) {
        return res.status(500).json({
            message: error.details,
            success: false
        })
    }
}