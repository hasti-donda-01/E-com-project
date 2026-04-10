import mongoose from "mongoose";
const paymentSchema = mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    paymentMethod:
    {
        type: String,
        enum: ["COD", "online", "wallet"]
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed', 'refunded'],
        default: 'pending'
    },
    amount: {
        type: Number,
        required: true
    },
    transactionId: {
        type: String,
        // required: true
    }
});

export const Payment = mongoose.model('Payment', paymentSchema);
