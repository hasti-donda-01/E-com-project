import express from 'express';
import multer from 'multer';
import path from 'path';
import { auth } from '../middleware/auth.js';
import { add_address, getaddressofuser, remove_address, update_address } from '../controller/address.js';
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

router.get('/add', add_address);
router.delete('/remove/:id', remove_address);
router.post('/update/:id', update_address)
router.get('/getaddressofuser/:id', getaddressofuser)


export default router;