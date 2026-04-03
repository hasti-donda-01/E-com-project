import mongoose from 'mongoose';
const wishlistSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }, product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
});

export const Wishlist = mongoose.model('Wishlist', wishlistSchema);