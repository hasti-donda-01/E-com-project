import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true  
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        default: null
    },
    otpExpireAt: {
        type: Date,
        default: null
    },
    resetToken: {
        type: String,
        default: null
    },
    resetTokenExpireAt: {
        type: Date,
        default: null
    },
    isVerify: {
        type: Boolean,
        default: false
    },
    isLogin: {
        type: Boolean,
        default: false
    },
    // profileImage: {
    //     type: String,
    //     required: true
    // },
    role: {
        type: String,
        enum: ["Admin", "customer", "seller"],
        default: "customer"
    },
    isActive: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["blocked", "unblocked"],
        default: "unblocked"
    }
}, {
    timestamps: true
})

export const User = mongoose.model('User', userSchema);
