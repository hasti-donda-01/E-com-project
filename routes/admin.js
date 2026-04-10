import express from 'express';
import multer from 'multer';
import path from 'path';
import { auth } from '../middleware/auth.js';
import { accountstatus, approveSeller, deleteProduct, getallproducts, getallseller, getalluser, getCustomerDetails, getSellerReport, monitorallorder, updateorderstatus, verifySeller } from '../controller/admin.js';
import { adminDashboard } from '../controller/dashboards.js';
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

router.get('/getallsellers', auth(["Admin"]), getallseller);
router.get('/getalluser', auth(["Admin"]), getalluser);
router.get('/getallproducts', auth(["Admin", "seller", "customer"]), getallproducts);
router.delete('/deleteProduct/:id', auth(["Admin"]), deleteProduct)
router.get('/accountstatus/:id', auth(["Admin"]), accountstatus);//block unblock user
router.get('/getallorder', auth(["Admin"]), monitorallorder);
router.get('/updateorderstatus/:id', auth(["Admin"]), updateorderstatus);
router.get('/getcustomerdetail/:id', auth(["Admin"]), getCustomerDetails);//monitor customer activity
router.post('/sellerapprove/:id', auth(["Admin"]), approveSeller);
router.get('/verifySeller/:id', auth(["Admin"]), verifySeller);
router.get('/adminDashboard', auth(["Admin"]), adminDashboard)


router.get('/getSellerReport/:id', getSellerReport)//monitor seller activity
export default router;