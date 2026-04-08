import { Cart } from "../models/cart.js";
import { Product } from "../models/product.js";

export const addtocart = async (req, res) => {
    try {
        const { product, quantity } = req.body;
        if (!product) {
            return res.status(400).json({
                message: "please enter produts",
                success: false
            })
        }

        const products = await Product.findOne({ _id: product })
        console.log(products, "product");
        if (!products) {
            return res.status(404).json({
                message: "product not found",
                success: false
            })
        }

        const productFind = await Cart.findOne({ user: req.user.id, product: req.body.product });
        console.log(productFind, "p");
        if (productFind) {
            return res.status(400).json({
                message: "product is already in your cart",
                success: false
            })
        }
        // if(products)
        // {
        //     return res.status(400).json({
        //         message:"product alreadyin your cart",
        //         success:false
        //     })
        // }
        const total = products.price * quantity;


        const payload = {
            user: req.user.id, product, quantity, total
        }
        await Cart.create(payload)
        return res.status(200).json({
            message: "product added to cart",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const removeproductfromcart = async (req, res) => {
    try {
        const product = Cart.findOne({ _id: req.params.id });

        if (!product) {
            return res.status(404).json({
                message: "product not found",
                success: false
            })
        }

        await Cart.deleteOne({ _id: req.params.id });
        return res.status(200).json({
            messsage: "product is removed from the cart",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }

}

export const getcartofuser = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const perPage = 3;
        const totlaPost = await Product.countDocuments();
        const totalpage = Math.ceil(totlaPost / perPage);
        if (page > totalpage) {
            return res.status(404).json({
                message: "page not found",
                success: false
            })
        }

        const cart = await Cart.find({ user: req.user.id }).skip((page - 1) * perPage).limit(perPage).exec();
        const cartproduct = await Cart.find({ user: req.params.id });
        console.log(cartproduct, "cartproduct")
        const totalbill = await cartproduct.reduce((sum, item) => sum + parseInt(item.total), 0);
        return res.status(200).json({
            data: [cart, "totalpages : " + totalpage, "page no : " + page, "totalBill : " + totalbill]
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const updatequantity = async (req, res) => {
    try {
        const { quantity } = req.body;
        if (!quantity) {
            return res.status(400).json({
                message: "Enter quantity",
                success: false
            })
        }
        const cart = await Cart.findOne({ _id: req.params.id })
        console.log(cart, "cart");
        const products = await Product.findOne({ _id: cart.product })
        console.log("products", products)
        const total = products.price * req.body.quantity;

        const payload = {
            quantity, total
        }

        await Cart.findOneAndUpdate({ _id: req.params.id }, { $set: payload });

        return res.status(200).json({
            message: "product quntity updated successfully",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const clearcart = async (req, res) => {
    try {
        const user = await Cart.deleteMany({ user: req.params.id });
        if (!user) {
            return res.status(404).json({
                message: "User not Found",
                success: false
            })
        }
        return res.status(200).json({
            message: "clear cart",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}