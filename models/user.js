import mongoose from "mongoose";

const needsFullProfile = function () {
    return this.role !== "customer";
};

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    name: {
        type: String,
        required: needsFullProfile,
        default: null
    },
    password: {
        type: String,
        required: needsFullProfile,
        default: null
    },
    phone: {
        type: String,
        required: needsFullProfile,
        unique: true,
        sparse: true,
        default: undefined
    },
    otp: { type: String, default: null },
    otpExpireAt: { type: Date, default: null },
    otpAttempts: { type: Number, default: 0 },
    resetToken: { type: String, default: null },
    resetTokenExpireAt: { type: Date, default: null },
    isVerify: { type: Boolean, default: false },
    isLogin: { type: Boolean, default: false },
    profileImage: { type: String, default: null },
    role: {
        type: String,
        enum: ["admin", "seller", "customer"],
        default: "customer",
        lowercase: true
    },
    isActive: { type: Boolean, default: false },
    status: {
        type: String,
        enum: ["blocked", "unblocked"],
        default: "unblocked"
    },
    profileImageName: { type: String, default: null }
}, {
    timestamps: true
})

export const User = mongoose.model('User', userSchema);