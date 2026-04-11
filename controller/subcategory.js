import { subCategory } from "../models/subcategory.js";
import fs from 'fs';

export const createsubCategory = async (req, res) => {
    try {

        console.log(req.file, "reqfile");
        const image = req.file.filename
        const { name, category } = req.body;


        if (!name || !image || !category) {
            return res.status(400).json({
                message: "please fill all the fields",
                success: false
            });

        }
        const subcategory = await subCategory.findOne({ name });
        if (subcategory) {
            return res.status(400).json({
                message: "Category Name already exist",
                success: false
            })
        }

        const payload = { name, image: `http://localhost:7000/category_Image/${req.file.filename}`, imagename: req.file.filename, category }
        await subCategory.create(payload);
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

export const getsubcategory = async (req, res) => {
    try {
        console.log(req.user, "req.user")
        const page = parseInt(req.query.page) || 1;
        const perPage = 3;
        const totlaPost = await subCategory.countDocuments();
        const totalpage = Math.ceil(totlaPost / perPage);
        if (page > totalpage) {
            return res.status(404).json({
                message: "page not found",
                success: false
            })
        }


        if (req.user.role == "seller" || req.user.role == "customer") {
            const subcategory = await subCategory.find({ isActive: true }).skip((page - 1) * perPage).limit(perPage).exec();;
            console.log(subcategory)
            return res.status(200).json({
                message: "categories get successfully",
                data: [subcategory, "totalpages : " + totalpage, "page : " + page],
                success: true
            })
        }
        const subcategory = await subCategory.find().skip((page - 1) * perPage).limit(perPage).exec();;
        console.log(subcategory)
        return res.status(200).json({
            message: "categories get successfully",
            data: [subcategory, "totalpages : " + totalpage, "page : " + page],
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

        const category = await subCategory.findOne({ _id: req.params.id });
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

        const subcategory = await subCategory.findOneAndDelete({ _id: req.params.id });
        // console.log(product)
        console.log(subcategory, "subcategory");
        if (!subcategory) {
            return res.status(404).json({
                message: "SubCategory not found",
                success: false
            })
        }
        await fs.unlinkSync(`./public/subcategory/${subcategory.imagename}`)
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
        const { name, image } = req.body;

        const payload = {
            name, image: `http://localhost:7000/category_Image/${req.file.filename}`, imagename: req.file.filename
        }

        const category = await subCategory.findOneAndUpdate({ _id: req.params.id }, { $set: payload });
        console.log(category, "category")
        await fs.unlinkSync(`./public/subcategory/${category.imagename}`)
        return res.status(200).json({
            message: "product update successfully",
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
