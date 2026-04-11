import mongoose from 'mongoose';


const sellerSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    storeName: {
        type: String,
        required: true
    },
    storeDesc: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    businessType: {
        type: String,
        required: true
    },
    gstin: {
        type: String,
        required: true
    },
    panNumber: {
        type: String,
        required: true
    },
    isRejected: {
        type: Boolean,
        default: false
    },
    rejectionReason: {
        type: String,
        default: null
    }
});

export const Seller = mongoose.model('Seller', sellerSchema)