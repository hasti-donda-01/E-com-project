import express from 'express';
import multer from 'multer';
import path from 'path';
import { auth } from '../middleware/auth.js';
import { getallproducts, getallseller, getalluser } from '../controller/admin.js';
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './public/category')
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + `${path.extname(file.originalname)}`;
//         console.log(uniqueSuffix, "unique")
//         cb(null, uniqueSuffix);
//         console.log(uniqueSuffix);
//     }
// })

// const upload = multer({ storage: storage })

const router = express.Router();

router.get('/getallsellers', getallseller);
router.get('/getalluser', getalluser);
router.get('/getallproducts',getallproducts)


export default router;