import express from 'express';
import multer from 'multer';
import path from 'path';
import { auth } from '../middleware/auth.js';
import { accountstatus, approveSeller, getallproducts, getallseller, getalluser, getCustomerDetails, monitorallorder, updateorderstatus, verifySeller } from '../controller/admin.js';
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
router.get('/getallproducts', getallproducts);
router.get('/accountstatus/:id', accountstatus);
router.get('/getallorder', auth(["Admin"]), monitorallorder);
router.get('/updateorderstatus/:id', auth(["Admin"]), updateorderstatus);
router.get('/getcustomerdetail/:id', auth(["Admin"]), getCustomerDetails);
router.post('/sellerapprove/:id', auth(["Admin"]), approveSeller);
router.get('/verifySeller/:id', auth(["Admin"]), verifySeller);
export default router;