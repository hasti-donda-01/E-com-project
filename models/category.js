import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    category_name: {
        type: String,
        requiredd: true,
        unique: true   
    },
    category_Image: {
        type: String,
        requiredd: true
    },
    imagename: {
        type: String,
    },
    description: {
        type: String,
        default: null      
    },
    isActive: {
        type: Boolean,
        default: true       
    }
}, { timestamps: true });   

export const Category = mongoose.model("Category", categorySchema);