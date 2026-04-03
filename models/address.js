import mongoose from "mongoose";


const addressSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    city: {
        type: String,
        require: true
    },
    state: {
        type: String,
        require: true
    },
    pincode: {
        type: String,
        require: true
    },
    country: {
        type: String,
        require: true
    },
    type: {
        type: String,
        enum: ['home', 'work', 'other'],
        default: 'home'
    },
    addressline: {
        type: String,
        require: true
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