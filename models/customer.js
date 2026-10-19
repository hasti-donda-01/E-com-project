import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
    {
        phone: {
            type: String,
            required: true,
            unique: true,
            sparse: true,
            trim: true
        },
        // filled in when the customer verifies the OTP for the first time
        email: {
            type: String,
            lowercase: true,
            trim: true,
            unique: true,
            sparse: true,
            default: undefined
        },
        password: { type: String, default: null },        // bcrypt hash
        otp: { type: String, default: null },             // bcrypt hash
        otpAttempts: { type: Number, default: 0 },
        isVerify: { type: Boolean, default: false }
    },
    { timestamps: true }
);

export const Customer = mongoose.model('Customer', customerSchema);