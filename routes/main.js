import express from 'express';
import product from './product.js';
import category from './category.js'
import seller from './seller.js';
import admin from './admin.js'
import cart from './cart.js';
import user from './user.js';
import address from './address.js';
import subcategory from './subcategory.js';
import wish from './wishlist.js';
import order from './order.js'
import sellerp from './sellerp.js';
import despute from './dispute.js'

const router = express.Router();
router.use('/product', product);
router.use('/category', category);
router.use('/seller', seller);
router.use('/admin', admin)
router.use('/cart', cart);
router.use('/user', user);
router.use('/address', address)
router.use('/subcat', subcategory)
router.use('/wish', wish);
router.use('/order', order)
router.use('/sellerp', sellerp);
router.use('/despute', despute)


export default router;