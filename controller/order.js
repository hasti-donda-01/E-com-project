import { Order } from "../models/order";

export const createOrder = async (req, res) => {
    try {
        const { productId, userId, total, status, quantity } = req.body;
        if (!productId || !userId || !status || !quantity) {
            return res.status(400).json({
                message: "Please fill all the fields",
                success: false
            })
        }
        const payload = {
            productId, userId, total, status, quantity
        }
        await Order.create(payload);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}