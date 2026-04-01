import express from 'express';
import multer from 'multer';
import path from 'path';
import { createCategory, deletecategory, getcategory, getcategorybyid, updatecategory } from '../controller/category.js';
import { auth } from '../middleware/auth.js';
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

router.post('/create', auth(["Admin"]), upload.single('category_Image'), createCategory);
router.post('/update/:id', auth(["Admin"]), upload.single('category_Image'), updatecategory);
router.get('/get', auth(["Admin"]), getcategory)
router.get('/get/:id', auth(["Admin"]), getcategorybyid);
router.delete('/delete/:id', auth(["Admin"]), deletecategory)


export default router;