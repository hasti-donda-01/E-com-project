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
        enum: ["COD", "upi", "card", "netbanking", "wallet", "online", "bank_transfer"],
        default: "COD"
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
    },
    gatewayOrderId: {
        type: String
    }
});

export const Payment = mongoose.model('Payment', paymentSchema);
