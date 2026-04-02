import { User } from "../models/user.js";
import { Seller } from '../models/seller.js'
import nodemailer from 'nodemailer';
import path from 'path';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

console.log(path.extname('index.html'))
import fs from 'fs';
import { Admin } from "../models/admin.js";
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
        const { name, email, address, password, phone, confirm_password, role } = req.body;
        if (!name || !email || !address || !password || !phone) {
            return res.status(400).json({
                message: "Please fill all the fields",
                success: false
            })
        }
        const user = await User.findOne({ email });
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
        const hashpassword = await bcrypt.hash(password, 10);
        console.log(hashpassword, "hash")
        const payload = {

            name, email, address, password: hashpassword, phone, otp, otpExpireAt, role
        }

        const createduser = await User.create(payload);
        console.log("createduser", createduser)

        if (role == "seller") {
            const { storeName, storeDesc, category, businessType, gstin, panNumber } = req.body
            const a = await User.findOne({ _id: createduser._id });
            console.log(a, "a")
            const payloadseller = {
                userId: createduser._id,
                storeName,

                storeDesc,
                category,
                businessType,
                gstin,
                panNumber,
                address
            }
            const b = await Seller.create(payloadseller);
            console.log(b.userId, "b")
            const sellerWithUser = await Seller.findOne({ _id: b._id })
                .populate('userId', 'name email phone role');
            console.log("sellerWithUser", sellerWithUser);
            return res.status(201).json({
                message: "done",
                data: sellerWithUser,
                success: true
            })
        }


        if (role == "Admin") {
            const admin = await Admin.find();
            console.log(admin, "admin");


            if (admin.length == 1) {
                return res.status(400).json({
                    message: "You can not register as an admin",
                    success: false
                })
            }

            if (password !== confirm_password) {
                return res.status(400).json({
                    message: "password does not match! ",
                    success: false
                })
            }
            const hashpassword = await bcrypt.hash(password, 10)
            await Admin.create({ name, email, phone, password: hashpassword, confirm_password });
            return res.status(200).json({
                message: "done",
                success: true
            })
        }


        return res.status(201).json({
            message: "Seller Registered Sucessfully",
            success: true
        });
    }
    catch (error) {
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
        const seller = await User.findOne({ _id: sellerId });
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

        const seller = await User.findOne({
            email
        });
        const isMatch = await bcrypt.compare(password, seller.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials",
                success: false
            });
        }
        if (!seller) {
            return res.status(400).json({
                message: "Seller not found",
                success: false
            })
        }

        const token = jwt.sign({
            email, id: seller._id, name: seller.name, role: seller.role
        }, process.env.PRIVATEKEY, { expiresIn: '1d' });
        console.log(token)
        seller.isLogin = true;
        seller.save();
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

export const logout = async (req, res) => {


    const user = await Seller.findOne({ _id: req.params.id });
    if (!user) {
        return res.status(404).json({
            message: "user not found",
            success: false
        });

    }
    if (user.isLogin == false) {
        return res.status(400).json({
            message: "not login",
            success: false
        })
    }
    user.isLogin = false;
    user.save();
    return res.status(200).cookie('AccessToken', '', {
        expires: new Date(0),

    }).json({
        message: "LogOut successfully"
    })
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
        const seller = await User.findOne({ email });
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

export const resetPassword = async (req, res) => {
    try {
        const { sellerId, resetToken, newpassword, confirm_password } = req.body;
        if (!sellerId || !resetToken || !newpassword || !confirm_password) {
            return res.status(400).json({
                message: "please fill all the fields",
                success: false
            })
        }

        const seller = await User.findOne({ _id: sellerId, resetToken });
        if (!seller) {
            return res.status(404).json({
                message: "seller not found",
                success: false
            })
        }
        const hashedPassword = await bcrypt.hash(newpassword, 10);
        await seller.updateOne({
            resetToken: null,
            resetTokenExpireAt: null,
            password: hashedPassword
        });

        return res.status(200).json({
            message: "password reset successfully",
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const changePassword = async (req, res) => {
    try {
        const { sellerId, password, newpassword, confirm_password } = req.body;
        if (!sellerId || !password || !newpassword || !confirm_password) {
            return res.status(400).json({
                message: "please fill all the fields",
                success: false
            })
        }

        const seller = await User.findOne({ _id: sellerId });
        console.log(seller)
        if (!seller) {
            return res.status(404).json({
                message: "Seller not found",
                success: false
            })
        }

        if (seller.resetTokenExpireAt > Date.now()) {
            return res.status(400).json({
                message: "Reset token expired",
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(newpassword, 10);

        await seller.updateOne({
            password: hashedPassword
        });
        return res.status(200).json({
            message: "password change successfully",
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}





// .cookie('AccessToken', token, {

//             maxAge: 1 * 24 * 60 * 60 * 1000,
//             httpOnly: true,
//             secure: true
//         })