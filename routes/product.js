import express from 'express';
import multer from 'multer';
import path from 'path';
import { createProduct, deleteproduct, getproducts, getproductsbyid, totalProduct, updateproduct } from '../controller/product.js';
import { auth } from '../middleware/auth.js';
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

router.post('/create', auth(["seller"]), upload.single('image'), createProduct);
router.post('/update/:id', auth(["seller"]), upload.single('image'), updateproduct);
router.get('/get', auth(["seller"]), getproducts);
router.get('/get/:id', auth(["seller"]), getproductsbyid);
router.delete('/delete/:id', auth(["seller"]), deleteproduct);
router.get('/count', auth(["seller"]), totalProduct);


export default router;