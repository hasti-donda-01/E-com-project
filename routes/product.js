import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadProduct } from '../config/cloudinary.js';
import { createProduct, deleteproduct, getproducts, getproductsbyid, productbycategory, setProductPricing, totalProduct, updateproduct, updateStock } from '../controller/product.js';
import { auth } from '../middleware/auth.js';
import { categorybasedbrowse, filterProducts } from '../controller/customer.js';


const router = express.Router();

router.post('/create', auth(["seller"]), uploadProduct.single('image'), createProduct);
router.post('/update/:id', auth(["seller"]), uploadProduct.single('image'), updateproduct);
router.get('/get', getproducts);
router.get('/getp/:id', getproductsbyid);
router.delete('/delete/:id', auth(["seller"]), deleteproduct);
router.get('/count', auth(["seller"]), totalProduct);
router.get('/productbycategory/:id', productbycategory)
router.get('/filterProducts', filterProducts)
// router.get('/categorybasedbrowse/:name', categorybasedbrowse)
router.post('/setProductPricing/:id', setProductPricing)

router.post('/updateStock/:id', auth(["seller"]), updateStock)
export default router;