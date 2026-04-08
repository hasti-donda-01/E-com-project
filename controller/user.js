import { Order } from "../models/order.js";
import { Seller } from "../models/seller.js";
import { User } from "../models/user.js";

export const getUserProfile = async (req, res) => {
    try {
        console.log(req.user, "req.user");
        const user = await User.findOne({ _id: req.user._id }).select('-password -otp -otpExpireAt -resetToken -resetTokenExpireAt -__v');
        const orders = await Order.find({ userId: req.user._id }).select('-__v -cancelledAt -deliveredAt')
            .sort({ createdAt: -1 });
        console.log(orders, "orders");
        return res.status(200).json({
            message: "User get Successfully",
            success: true,
            data: [user, orders]
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const deleteUser = async (req, res) => {
    try {



        const user = await User.findOneAndDelete({ _id: req.params.id });
        console.log(user);

        if (!user) {
            return res.status(404).json({
                messsage: "User not found",
                success: false
            })
        }

        if (user.role == 'seller') {
            const inSeller = await Seller.findOneAndDelete({ userId: req.params.id });
        }
        return res.status(200).json({
            message: "deleted successfully",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const updateUser = async (req, res) => {
    try {



        const user = await User.findOneAndUpdate({ _id: req.params.id }, { $set: req.body });
        if (!user) {
            return res.status(404).json({
                messsage: "User not found",
                success: false
            })
        }

        if (user.role == 'seller') {
            const inSeller = await Seller.findOneAndUpdate({ userId: req.params.id }, { $set: req.body });
        }
        return res.status(200).json({
            message: "deleted successfully",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}