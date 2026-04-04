import { Address } from "../models/address.js";
import { Cart } from "../models/cart.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";

export const createOrder = async (req, res) => {
    try {
        const { product, userId, total, quantity, paymentMethod, paymentStatus, orderStatus, buyNow, address } = req.body;

        const user = await User.findOne({ _id: req.body.userId });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }
        let deliveryaddress;
        if (address) {
            deliveryaddress = await Address.findOne({ _id: address, user: req.body.userId })
        }
        else {
            deliveryaddress = await Address.findOne({ isDefault: true, user: req.body.userId })
        }
        if (buyNow) {

            const products = await Product.findOne({ _id: product });
            console.log(products);
            const totalbill = quantity * products.price;
            console.log(parseInt(products), "totalbill")
            const payload = {
                product, userId, totalAmount: totalbill, quantity, address, paymentMethod, paymentStatus, orderStatus
            }
            await Order.create(payload);
            return res.status(201).json({
                messsage: "order placed successfully",
                success: true
            })
        }
        else {
            const cartItems = await Cart.find({ user: userId });
            cartItems.forEach(async (q) => {
                console.log(q, "cartItems");
                // const totalbill = await q.quantity * q.price;
                // console.log(totalbill)
                // const totalbill = await q.quantity * q.price;totalAmount: totalbill,
                const payloadcart = {
                    product: q.product, userId, quantity: q.quantity, totalAmount: q.total, address, paymentMethod, paymentStatus, orderStatus
                }


                await Order.create(payloadcart);
                await Cart.findOneAndDelete({ user: userId })

                return res.status(201).json({
                    messsage: "order placed successfully",
                    success: true
                })
            })

        }

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const trackOrder = async (req, res) => {
    try {

        const order = await Order.findOne({ _id: req.params.id });
        console.log(order)
        if (!order) {
            return res.status(404).json({
                message: "order not found",
                success: false
            })
        }
        return res.status(200).json({
            message: `your order is ${order.orderStatus}..`
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}


export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findOneAndUpdate({ _id: req.params.id }, { $set: { orderStatus: "cancelled" } });
        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                success: false
            })
        }
        return res.status(200).json({
            message: "order is cancelled",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const vieworderhistory = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const perPage = 3;
        const totlaPost = await Order.countDocuments();
        const totalpage = Math.ceil(totlaPost / perPage);
        if (page > totalpage) {
            return res.status(404).json({
                message: "page not found",
                success: false
            })
        }

        const orders = await Order.find({ userId: req.params.id }).skip((page - 1) * perPage).limit(perPage).exec();
        if (!orders) {
            return res.status(404).json({
                messagfe: "you don't have any order history",
                success: false
            })
        }


        return res.status(200).json({
            data: [orders, "totalpages : " + totalpage, "page no : " + page]
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}