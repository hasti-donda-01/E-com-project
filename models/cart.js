import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    quantity: {
        type: Number,
        default: 1
    },
    total: {
        type: Number,
         default: 0
    },
});
export const Cart = mongoose.model('Cart',cartSchema)