

import express from 'express';
import { login, registerSeller, verifyEmail, verifyOTP } from '../controller/seller.js';

const router = express.Router();

router.post('/create', registerSeller);
router.post('/verifyOTP', verifyOTP);
router.post('/login', login);
router.post('/verifyEmail', verifyEmail);



export default router;