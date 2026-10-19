import 'dotenv/config';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Customer } from '../models/customer.js';

const PHONE_RE = /^[6-9]\d{9}$/;      // 10-digit Indian mobile number
const OTP_VALID_MS = 5 * 60 * 1000;   // OTP valid for 5 minutes
const RESEND_WAIT_MS = 30 * 1000;     // 30 seconds between requests
const MAX_ATTEMPTS = 5;

// Sends the OTP by SMS (written for Fast2SMS; for MSG91 or Twilio only this function changes)
const sendSms = async (phone, otp) => {
    if (!process.env.SMS_API_KEY) {
        if (process.env.RENDER) {
            throw new Error('SMS provider is not configured');
        }
        console.log(`[DEV ONLY] OTP for ${phone}: ${otp}`);   // local testing without an SMS account
        return;
    }

    const resp = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
            authorization: process.env.SMS_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ route: 'otp', variables_values: otp, numbers: phone })
    });
    const data = await resp.json();
    if (!data.return) {
        throw new Error(data.message || 'Failed to send SMS');
    }
};

// POST { phone }
export const sendCustomerOtp = async (req, res) => {
    try {
        const phone = String(req.body.phone || '').trim();

        if (!PHONE_RE.test(phone)) {
            return res.status(400).json({
                message: "Enter a valid 10-digit mobile number",
                success: false
            });
        }

        const customer = await Customer.findOne({ phone });

        // 30-second resend limit (only while an OTP is pending)
        if (
            customer?.otp &&
            Date.now() - customer.updatedAt.getTime() < RESEND_WAIT_MS
        ) {
            return res.status(429).json({
                message: "Please wait 30 seconds before requesting another OTP",
                success: false
            });
        }

        const otp = crypto.randomInt(100000, 1000000).toString();

        await Customer.updateOne(
            { phone },
            { $set: { otp, otpAttempts: 0 } },
            { upsert: true }
        );

        try {
            await sendSms(phone, otp);
        } catch (smsError) {
            // don't leave an OTP the user never received
            await Customer.updateOne({ phone }, { $set: { otp: null } });
            throw smsError;
        }

        return res.status(200).json({
            message: "OTP sent to your mobile number",
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};

// POST { phone, otp }
// POST { phone, otp, email, password }
// POST { phone, otp, password }
// POST { phone, otp }
export const verifyCustomerOtp = async (req, res) => {
    try {
        const phone = String(req.body.phone || '').trim();
        const { otp } = req.body;

        if (!phone || !otp) {
            return res.status(400).json({
                message: "Phone and OTP are required",
                success: false
            });
        }

        const customer = await Customer.findOne({ phone });

        if (!customer || !customer.otp) {
            return res.status(400).json({
                message: "Invalid or expired OTP",
                success: false
            });
        }

        if (customer.otpAttempts >= MAX_ATTEMPTS) {
            return res.status(429).json({
                message: "Too many attempts. Request a new OTP.",
                success: false
            });
        }

        if (Date.now() - customer.updatedAt.getTime() > OTP_VALID_MS) {
            return res.status(400).json({
                message: "OTP expired. Request a new one.",
                success: false
            });
        }

        // OTP is stored as plain text, so compare directly
        if (String(otp) !== customer.otp) {
            await Customer.updateOne({ _id: customer._id }, { $inc: { otpAttempts: 1 } });
            return res.status(400).json({
                message: "Invalid OTP",
                success: false
            });
        }

        // one-time use
        await Customer.updateOne(
            { _id: customer._id },
            { $set: { otp: null, otpAttempts: 0, isVerify: true } }
        );

        const token = jwt.sign(
            {
                phone: customer.phone,
                id: customer._id,
                role: 'customer'
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