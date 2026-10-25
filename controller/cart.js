import { Cart } from "../models/cart.js";
import { Product } from "../models/product.js";

export const addtocart = async (req, res) => {
    try {
        const { product } = req.body;
        const quantity = Number(req.body.quantity || 1);
        if (!product) {
            return res.status(400).json({
                message: "please enter produts",
                success: false
            })
        }
        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be a positive whole number",
                success: false
            })
        }

        const products = await Product.findById(product);
        if (!products) {
            return res.status(404).json({
                message: "product not found",
                success: false
            })
        }

        const productFind = await Cart.findOne({ user: req.user.id, product });
        const nextQuantity = quantity + Number(productFind?.quantity || 0);
        if (nextQuantity > products.stock) {
            return res.status(400).json({
                message: "Requested quantity is not available",
                success: false
            })
        }
        const price = Number(products.discountPrice) || Number(products.price);
        const cartItem = productFind || new Cart({ user: req.user.id, product });
        cartItem.quantity = nextQuantity;
        cartItem.total = price * nextQuantity;
        await cartItem.save();
        return res.status(200).json({
            message: "product added to cart",
            success: true,
            data: cartItem
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
        const product = await Cart.findOne({ _id: req.params.id, user: req.user.id });

        if (!product) {
            return res.status(404).json({
                message: "product not found",
                success: false
            })
        }

        await Cart.deleteOne({ _id: req.params.id });
        return res.status(200).json({
            message: "Product removed from the cart",
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
        const cart = await Cart.find({ user: req.user.id })
            .populate('product')
            .sort({ _id: -1 })
            .exec();
        const totalBill = cart.reduce((sum, item) => {
            const price = Number(item.product?.discountPrice) || Number(item.product?.price) || 0;
            return sum + price * Number(item.quantity || 1);
        }, 0);
        return res.status(200).json({
            success: true,
            data: cart,
            totalBill
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
        const quantity = Number(req.body.quantity);
        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be a positive whole number",
                success: false
            })
        }
        const cart = await Cart.findOne({ _id: req.params.id, user: req.user.id })
            .populate('product');
        if (!cart || !cart.product) {
            return res.status(404).json({
                message: "Cart item not found",
                success: false
            });
        }
        if (quantity > cart.product.stock) {
            return res.status(400).json({
                message: "Requested quantity is not available",
                success: false
            });
        }
        const price = Number(cart.product.discountPrice) || Number(cart.product.price);
        cart.quantity = quantity;
        cart.total = price * quantity;
        await cart.save();

        return res.status(200).json({
            message: "Product quantity updated successfully",
            success: true,
            data: cart
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
        const user = await Cart.deleteMany({ user: req.user.id });
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