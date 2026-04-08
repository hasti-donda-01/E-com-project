import mongoose from "mongoose";

const subcategorySchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

export const subCategory = mongoose.model("subCategory", subcategorySchema);