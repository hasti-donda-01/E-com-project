import mongoose from 'mongoose';


const sellerSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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
    address: {
        type: String,
        required: true
    }
});

export const Seller = mongoose.model('Seller', sellerSchema)