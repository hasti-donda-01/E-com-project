import mongoose from "mongoose";

const returnSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
    },
    reason: {
        type: String,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    refundAmount: {
        type: Number,
        default: 0
    },
    requestedAt: {
        type: Date,
        default: Date.now
    },
    resolvedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });
export const Return = mongoose.model("Return", returnSchema);