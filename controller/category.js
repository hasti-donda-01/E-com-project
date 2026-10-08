import { Category } from "../models/category.js";
import fs from 'fs';
import { cloudinary } from '../config/cloudinary.js';

export const createCategory = async (req, res) => {
    try {
        const { category_name, description } = req.body;
        const imageUrl = req.file?.path;
        const publicId = req.file?.filename;

        if (!category_name || !imageUrl) {
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
            });
        }

        await Category.create({
            category_name,
            description,
            category_Image: imageUrl,
            imagename: publicId
        });

        return res.status(201).json({
            message: "Category Created successfully",
            success: true
        });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};

export const getcategory = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = 3;
        const totlaPost = await Category.countDocuments();
        const totalpage = Math.ceil(totlaPost / perPage);
        if (page > totalpage) {
            return res.status(404).json({
                message: "page not found",
                success: false
            })
        }


        const category = await Category.find().skip((page - 1) * perPage).limit(perPage).exec();
        console.log(category)

        return res.status(200).json({
            message: "categories get successfully",
            data: [category, "totalpages : " + totalpage, "page : " + page],
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
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category not found", success: false });
        }

        if (category.imagename) {
            try {
                await cloudinary.uploader.destroy(category.imagename);
            } catch (err) {
                console.log("Cloudinary delete skipped:", err.message);
            }
        }

        await Category.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            message: "Category deleted successfully",
            success: true
        });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};

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