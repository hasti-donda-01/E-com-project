import { Seller } from "../models/seller.js";
import nodemailer from 'nodemailer';
import path from 'path';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'

console.log(path.extname('index.html'))
import fs from 'fs';
const hello = fs.readFileSync('./index.html', 'utf8')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }

})


const genOTP = () => {
    return Math.floor(Math.random() * 9000) + 1000;
}


export const registerSeller = async (req, res) => {
    try {
        const { name, email, address, password, phone, confirm_password } = req.body;
        if (!name || !email || !address || !password || !phone) {
            return res.status(400).json({
                message: "Please fill all the fields",
                success: false
            })
        }

        const user = await Seller.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "User Already Exist",
                success: false
            })
        }
        if (password !== confirm_password) {
            return res.status(400).json({
                message: "password does not match",
                success: false
            })
        }
        const otp = genOTP();
        const otpExpireAt = Date.now() + 5 * 60 * 1000;
        const temp = hello.replace("{{otp}}", otp).replace("{{name}}", name)


        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "node js",
            html: temp
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
            }
            else {
                console.log(info.response)
            }
        })

        const payload = {

            name, email, address, password, phone, otp, otpExpireAt
        }

        await Seller.create(payload);
        return res.status(201).json({
            message: "Seller Registered Sucessfully",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const verifyOTP = async (req, res) => {
    try {
        const { sellerId, OTP } = req.body;
        if (!sellerId || !OTP) {
            return res.status(400).json({
                message: "please fill all the fields",
                success: false
            })
        }
        const seller = await Seller.findOne({ _id: sellerId });
        console.log(seller, "seller");

        await seller.updateOne({
            otp: null, otpExpireAt: null,
            isVerify: true
        })
        return res.status(200).json({
            messsage: "OTP Verified",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "please enter email and password",
                success: false
            })
        }
        const seller = await Seller.findOne({
            email, password
        });
        if (!seller) {
            return res.status(400).json({
                message: "Seller not found",
                success: false
            })
        }

        const token = jwt.sign({
            email, id: seller._id, name: seller.name
        }, process.env.PRIVATEKEY);
        console.log(token)
        return res.status(200).json({
            message: "Seller Logged In successfully",
            success: true,
            token: token
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const verifyEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                message: "please enter your email",
                success: false
            })
        }
        const seller = await Seller.findOne({ email });
        if (!seller) {
            return res.status(400).json({
                message: "seller not found",
                success: false
            })
        }
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpireAt = Date.now() + 5 * 60 * 1000;
        await seller.updateOne({
            resetToken,
            resetTokenExpireAt
        })
        return res.status(200).json({
            message: "done",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}