// All users

import express from 'express';
import { changePassword, login, logout, registerSeller, resetPassword, verifyEmail, verifyOTP } from '../auth/seller.js';
import { auth } from '../middleware/auth.js';
import { getalluser } from '../controller/dashboards.js';
import path from 'path'
import multer from 'multer';
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/profile')
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

router.post('/create', upload.single("profileImage"), registerSeller);
router.post('/verifyOTP', verifyOTP);
router.post('/login', login);
router.post('/logout/:id', logout);
router.post('/verifyEmail', verifyEmail);
router.post('/resetPassword', resetPassword);
router.post('/changePassword', auth(["seller", "customer", "Admin"]), changePassword);




export default router;