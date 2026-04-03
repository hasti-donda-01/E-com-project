import { Cart } from "../models/cart.js";
import { Wishlist } from "../models/wishlist.js"

export const addtowish = async (req, res) => {
    try {
        // const add = await Wishlist.create(req.body);
        const products = await Wishlist.findOne({ user: req.body.user, product: req.body.product });

        console.log(products, "products")

        if (products) {
            return res.status(200).json({
                message: "already in your cart"
            })
        }

        const newWishlist = await Wishlist.create({
            user: req.body.user,
            product: req.body.product
        });

        return res.status(201).json({
            message: "Product added to wishlist",
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
        await Wishlist.findOneAndDelete({ _id: req.params.id });
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

        const page = parseInt(req.query.page) || 1;
        const perPage = 3;
        const totlaPost = await Wishlist.countDocuments();
        const totalpage = Math.ceil(totlaPost / perPage);
        if (page > totalpage) {
            return res.status(404).json({
                message: "page not found",
                success: false
            })
        }
        const products = await Wishlist.find({ user: req.params.id }).skip((page - 1) * perPage).limit(perPage).exec();
        return res.status(200).json({
            data: [products, "totalpages : " + totalpage, "page : " + page]
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
        const products = await Wishlist.deleteMany({ user: req.params.id });
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

// export const movetocart = async (req, res) => {
//     try {
//         const product = await Wishlist.findOne({ _id: req.params.id });
//         await Cart.create(product)
//         return res.status(200).json({
//             data: product
//         })

//     } catch (error) {
//         return res.status(500).json({
//             message: error.message,
//             success: false
//         })
//     }
// }


