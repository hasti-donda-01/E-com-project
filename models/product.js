import mongoose from 'mongoose';
const productSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    brand: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true,
    },
    stock: {
        type: Number,
        require: true,
    },
    imagename: {
        type: String,
        require: true,
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subCategory'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    discountPrice: {
        type: Number,
        default: null       
    },
    discountPercent: {
        type: Number,
        default: null       
    },

}, {
    timestamps: true
});

export const Product = mongoose.model('Product', productSchema);