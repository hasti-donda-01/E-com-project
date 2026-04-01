import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
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
        enum: ["admin", "customer", "seller"],
        default: "customer"
    }
}, {
    timestamps: true
})

export const User = mongoose.model('User', userSchema);
