import { Address } from "../models/address.js";
import { User } from "../models/user.js";

export const add_address = async (req, res) => {
    try {
        const { user, city, pincode, state, country, addressline, type } = req.body;
        if (!user || !city || !pincode || !state || !country || !addressline) {
            return res.status(400).json({
                message: "please fill all the fields",
                success: false
            })
        }

        const payload = {
            user, city, pincode, state, country, addressline, type
        }
        await Address.create(payload);
        return res.status(201).json({
            message: "Address Add successfully",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const remove_address = async (req, res) => {
    try {
        const address = await Address.findOneAndDelete({ _id: req.params.id });
        if (!address) {
            return res.status(400).json({
                message: "not found",
                success: false
            })
        }
        return res.status(200).json({
            message: "Address Removed",
            success: false
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const update_address = async (req, res) => {
    try {
        await Address.findOneAndUpdate({ _id: req.params.id }, { $set: req.body });
        return res.status(200).json({
            message: "address Updated ",
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const getaddressofuser = async (req, res) => {
    try {
        const hello = await Address.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "users"
                }
            },
            {
                $unwind: "$users"
            },
            {
                $project: {
                    city: 1,
                    state: 1,
                    country: 1,
                    type: 1,
                    addressline: 1,
                    username: "$users.name",
                    userEmail: "$users.email",
                    user_mobile: "$users.phone"
                }
            }
        ]);

        // const user = await User.findOne({ _id: hello.user });
        // console.log(user, "user")
        return res.status(200).json({
            message: "Done",
            success: true,
            data: hello
        })
    } catch (error) {
        return res.status(500).json({
            messsage: error.message,
            success: false
        })
    }
}