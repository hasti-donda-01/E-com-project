import mongoose from "mongoose";
const orderSchema = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    total: {
        type: String,
        require: true
    },
    status: {
        type: String,
        enum: ['pending', 'delivered', 'canceled', 'return'],
    },
    quantity: {
        type: Number,
        default: 1
    }
});

export const Order = mongoose.model('Order', orderSchema);