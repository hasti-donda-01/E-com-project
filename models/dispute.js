import mongoose from "mongoose";

const disputeSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    reason: {
        type: String,
        enum: ['not_delivered', 'wrong_item', 'damaged', 'refund_request', 'other'],
        required: true
    },

    description: { type: String },

    status: {
        type: String,
        enum: ['open', 'under_review', 'resolved', 'rejected'],
        default: 'open'
    },

    resolution: {
        type: String,
        enum: ['refund', 'replacement', 'rejected', null],
        default: null
    },

    resolvedAt: { type: Date, default: null }

}, { timestamps: true });

export const Dispute = mongoose.model('Dispute', disputeSchema);