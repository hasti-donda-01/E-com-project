// All users

import express from 'express';
import { changePassword, login, logout, registerSeller, resetPassword, verifyEmail, verifyOTP } from '../auth/seller.js';
import { auth } from '../middleware/auth.js';
import { getalluser } from '../controller/dashboards.js';

const router = express.Router();

router.post('/create', registerSeller);
router.post('/verifyOTP', verifyOTP);
router.post('/login', login);
router.post('/logout/:id', logout);
router.post('/verifyEmail', verifyEmail);
router.post('/resetPassword', resetPassword);
router.post('/changePassword', auth(["seller"]), changePassword);




export default router;