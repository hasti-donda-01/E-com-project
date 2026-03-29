import express from 'express';
import multer from 'multer';
import path from 'path';
import { createProduct, deleteproduct, getproducts, getproductsbyid, updateproduct } from '../controller/product.js';
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/product')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + `${path.extname(file.originalname)}`;
        console.log(uniqueSuffix, "unique")
        cb(null, uniqueSuffix);
        console.log(uniqueSuffix);
    }
})

const upload = multer({ storage: storage })

const router = express.Router();

router.post('/create', upload.single('image'), createProduct);
router.post('/update/:id', upload.single('image'), updateproduct);
router.get('/get', getproducts);
router.get('/get/:id', getproductsbyid);
router.delete('/delete/:id', deleteproduct);


export default router;