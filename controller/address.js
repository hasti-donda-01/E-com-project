import { Address } from "../models/address.js";
import { User } from "../models/user.js";

export const add_address = async (req, res) => {
    try {
        const { city, pincode, state, country, addressline, type } = req.body;
        if (!city || !pincode || !state || !country || !addressline) {
            return res.status(400).json({
                message: "please fill all the fields",
                success: false
            })
        }

        const payload = {
            user: req.user.id, city, pincode, state, country, addressline, type
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
        const address = await Address.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });
        if (!address) {
            return res.status(400).json({
                message: "not found",
                success: false
            })
        }
        return res.status(200).json({
            message: "Address Removed",
            success: true
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
        await Address.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, { $set: req.body });
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
                $match: {
                    user: new mongoose.Types.ObjectId(userId)
                }
            },
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

export const setdefaultAddress = async (req, res) => {
    try {
        const { addressId } = req.body;
        if (!addressId) {
            return res.status(400).json({
                message: "please enter addressId",
                success: true
            })
        }

        const userId = req.user.id;
        const finuser = await User.findById(userId);
        if (!finuser) {
            return res.status(404).json({ message: "User not found" });
        }
        const a = await Address.findOneAndUpdate({ _id: addressId, user: userId }, { $set: { isDefault: true } }, { new: true });
        console.log(a)
        return res.status(200).json({
            message: `${a.type} address set as default address`,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

// const addDeliveryDetail = async (req, res) => {
//   try {
//     const { orderId, userId, addressId, receiverName,
//             receiverPhone, deliveryDate, timeSlot, instructions } = req.body;

//     // Step 1 - Check user exists
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Step 2 - Check address exists and belongs to user
//     const address = await Address.findOne({ _id: addressId, user: userId });
//     if (!address) {
//       return res.status(404).json({ message: "Address not found" });
//     }

//     // Step 3 - Create delivery detail
//     const delivery = await DeliveryDetail.create({
//       orderId,
//       userId,
//       addressId,
//       receiverName,
//       receiverPhone,
//       deliveryDate,
//       timeSlot,
//       instructions,
//       status: "pending"           // default status
//     });

//     return res.status(201).json({
//       message: "Delivery detail added successfully",
//       data: delivery
//     });

//   } catch (error) {
//     return res.status(500).json({
//       message: "Something went wrong",
//       error: error.message
//     });
//   }
// };