import mongoose from "mongoose";

const paymentAttemptSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Address"
    },
    items: [{
        cartItem: mongoose.Schema.Types.ObjectId,
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        unitPrice: {
            type: Number,
            required: true
        }
    }],
    amountPaise: {
        type: Number,
        required: true
    },
    razorpayOrderId: {
        type: String,
        required: true,
        unique: true
    },
    razorpayPaymentId: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ["pending", "processing", "paid", "failed"],
        default: "pending"
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    }]
}, { timestamps: true });

export const PaymentAttempt = mongoose.model("PaymentAttempt", paymentAttemptSchema);
