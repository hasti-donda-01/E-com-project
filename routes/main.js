import express from 'express';
import product from './product.js';
import category from './category.js'
import seller from './seller.js';
import admin from './admin.js'
import cart from './cart.js';
import user from './user.js';
import address from './address.js'

const router = express.Router();
router.use('/product', product);
router.use('/category', category);
router.use('/seller', seller);
router.use('/admin', admin)
router.use('/cart', cart);
router.use('/user',user);
router.use('/address',address)


export default router;