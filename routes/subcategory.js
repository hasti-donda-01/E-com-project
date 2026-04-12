import express from 'express';
import multer from 'multer';
import path from 'path';
import { auth } from '../middleware/auth.js';
import { createsubCategory, deletecategory, getcategorybyid, getsubcategory, updatecategory } from '../controller/subcategory.js';
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/subcategory')
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

router.post('/create', auth(["Admin"]), upload.single('image'), createsubCategory);
router.post('/update/:id', auth(["Admin"]), upload.single('image'), updatecategory);
router.get('/get', getsubcategory)
router.get('/get/:id', getcategorybyid);
router.delete('/delete/:id', auth(["Admin"]), deletecategory)


export default router;