import express from 'express';
import multer from 'multer';
import path from 'path';
import { createCategory, deletecategory, getcategory, getcategorybyid, updatecategory } from '../controller/category.js';
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/category')
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

router.post('/create', upload.single('category_Image'), createCategory);
router.post('/update/:id', upload.single('category_Image'), updatecategory);
router.get('/get', getcategory)
router.get('/get/:id', getcategorybyid);
router.delete('/delete/:id', deletecategory)


export default router;