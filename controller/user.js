import { User } from "../models/user.js";

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        return res.status(200).json({
            message: "User get Successfully",
            success: true,
            data: user
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}