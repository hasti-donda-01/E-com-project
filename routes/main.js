import express from 'express';
import product from './product.js';
import category from './category.js'
import seller from './seller.js';
import admin from './admin.js'

const router = express.Router();
router.use('/product', product);
router.use('/category', category);
router.use('/seller', seller);
router.use('/admin', admin)


export default router;