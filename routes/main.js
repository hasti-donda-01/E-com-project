import express from 'express';
import product from './product.js';
import category from './category.js'

const router = express.Router();
router.use('/product',product);
router.use('/category',category);


export default router;