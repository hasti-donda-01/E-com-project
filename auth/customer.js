
import 'dotenv/config';
import fs from 'fs';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { User } from '../models/user.js';

const hello = fs.readFileSync('./index.html', 'utf8');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST { email }
export const sendCustomerOtp = async (req, res) => {
    try {
        const email = String(req.body.email || '').trim().toLowerCase();

        if (!EMAIL_RE.test(email)) {
            return res.status(400).json({
                message: "Enter a valid email address",
                success: false
            });
        }

        let user = await User.findOne({ email });

        if (user && user.role !== 'customer') {
            return res.status(403).json({
                message: "This email is registered with a different account type",
                success: false
            });
        }

        if (user && user.status === 'blocked') {
            return res.status(403).json({
                message: "Your account is blocked",
                success: false
            });
        }

        // 30-second resend limit
        if (
            user?.otpExpireAt &&
            user.otpExpireAt.getTime() - 4.5 * 60 * 1000 > Date.now()
        ) {
            return res.status(429).json({
                message: "Please wait 30 seconds before requesting another OTP",
                success: false
            });
        }

        const otp = crypto.randomInt(100000, 1000000).toString();

        const update = {
            otp: await bcrypt.hash(otp, 10),
            otpExpireAt: new Date(Date.now() + 5 * 60 * 1000),
            otpAttempts: 0
        };

        if (!user) {
            await User.create({
                email,
                role: 'customer',
                ...update
            });
        } else {
            await user.updateOne(update);
        }

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Your verification code",
            html: hello
                .replace("{{otp}}", otp)
                .replace("{{name}}", "there")
        });

        return res.status(200).json({
            message: "OTP sent to your email",
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};

// POST { email, otp }
export const verifyCustomerOtp = async (req, res) => {
    try {
        const email = String(req.body.email || '').trim().toLowerCase();
        const { otp } = req.body;

        if (!otp) {
            return res.status(400).json({
                message: "OTP is required",
                success: false
            });
        }

        const user = await User.findOne({
            email,
            role: 'customer'
        });

        if (!user || !user.otp) {
            return res.status(400).json({
                message: "Invalid or expired OTP",
                success: false
            });
        }

        if (user.otpAttempts >= 5) {
            return res.status(429).json({
                message: "Too many attempts. Request a new OTP.",
                success: false
            });
        }

        if (new Date() > user.otpExpireAt) {
            return res.status(400).json({
                message: "OTP expired. Request a new one.",
                success: false
            });
        }

        if (!(await bcrypt.compare(String(otp), user.otp))) {
            await user.updateOne({
                $inc: { otpAttempts: 1 }
            });

            return res.status(400).json({
                message: "Invalid OTP",
                success: false
            });
        }

        await user.updateOne({
            otp: null,
            otpExpireAt: null,
            otpAttempts: 0,
            isVerify: true,
            isActive: true,
            isLogin: true
        });

        const token = jwt.sign(
            {
                email: user.email,
                id: user._id,
                role: user.role
            },
            process.env.PRIVATEKEY,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            message: "Logged in successfully",
            success: true,
            token
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};