import mongoose from "mongoose";


const addressSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['home', 'work', 'other'],
        default: 'home'
    },
    addressline: {
        type: String,
        required: true
    },
    addressline2: {
        type: String,
    },
    isDefault: {
        type: Boolean,
        default: false
    }

});
export const Address = mongoose.model('Address', addressSchema)