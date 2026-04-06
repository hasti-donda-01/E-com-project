import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // required: true
    },

    quantity: {
        type: Number,
        default: 1
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        // required: true
    },

    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        // required: true
    },

    paymentMethod: {
        type: String,
        enum: ["COD", "online", "wallet"],
        // required: true
    },

    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },

    orderStatus: {
        type: String,
        enum: ["placed", "confirmed", "shipped", "delivered", "cancelled"],
        default: "placed"
    },

    totalAmount: {
        type: Number,
        // required: true
    },

    placedAt: {
        type: Date,
        default: Date.now
    },

    cancelledAt: {
        type: Date,
        default: null
    },

    deliveredAt: {
        type: Date,
        default: null
    }

}, { timestamps: true });


export const Order = mongoose.model('Order', orderSchema);