import { Seller } from "../models/seller";

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
        const payload = {

            name, email, address, password, phone
        }

        await Seller.create({ payload });
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