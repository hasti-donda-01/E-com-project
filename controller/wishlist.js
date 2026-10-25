import { Cart } from "../models/cart.js";
import { Product } from "../models/product.js";
import { Wishlist } from "../models/wishlist.js"

export const addtowish = async (req, res) => {
    try {
        if (!req.body.product) {
            return res.status(400).json({
                message: "Product is required",
                success: false
            });
        }
        const products = await Wishlist.findOne({
            user: req.user.id,
            product: req.body.product
        });

        if (products) {
            return res.status(200).json({
                message: "Product is already in your wishlist",
                success: true,
                data: products
            })
        }

        const newWishlist = await Wishlist.create({
            user: req.user.id,
            product: req.body.product
        });

        return res.status(201).json({
            message: "Product added to wishlist",
            success: true,
            data: newWishlist
        });



    } catch (error) {
        return res.status(500).json({
            messsage: error.message,
            success: false
        })
    }
}

export const removefromwishlist = async (req, res) => {
    try {
        await Wishlist.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });
        return res.status(200).json({
            message: "product removed from your wishlist",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            messgae: error.message,
            success: false
        })
    }
}

export const getproducts = async (req, res) => {
    try {
        const products = await Wishlist.find({ user: req.user.id })
            .populate("product")
            .sort({ _id: -1 })
            .lean();
        return res.status(200).json({
            success: true,
            data: products
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const clearwishlist = async (req, res) => {
    try {
        await Wishlist.deleteMany({ user: req.user.id });
        return res.status(200).json({
            message: "WishList is Empty now!",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: "error.message",
            success: false
        })
    }
}

export const movetocart = async (req, res) => {
    try {
        const wishlistItem = await Wishlist.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!wishlistItem) {
            return res.status(404).json({
                message: "Wishlist item not found",
                success: false
            });
        }
        const product = await Product.findById(wishlistItem.product);
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false
            });
        }

        if (product.stock < 1) {
            return res.status(400).json({
                message: "Product is out of stock",
                success: false
            });
        }

        const alreadyInCart = await Cart.findOne({
            user: req.user.id,
            product: wishlistItem.product
        });

        if (alreadyInCart) {
            return res.status(400).json({
                message: "Product is already in your cart",
                success: false
            });
        }

        await Cart.create({
            user: req.user.id,
            product: wishlistItem.product,
            quantity: 1,
            total: Number(product.discountPrice) || Number(product.price)
        });

        await Wishlist.findOneAndDelete({ _id: req.params.id });

        return res.status(200).json({
            message: "Product moved to cart successfully",
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}
