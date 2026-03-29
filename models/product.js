
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
        type: String,
        require: true,
    },
    imagename: {
        type: String,
        require: true,
    }


}, {
    timestamps: true
});

export const Product = mongoose.model('Product', productSchema);