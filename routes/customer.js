import express from 'express';
import { sendCustomerOtp, verifyCustomerOtp } from '../auth/customer.js';
import { getCustomerOrders } from '../controller/order.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// OTP routes
router.post('/send-otp', sendCustomerOtp);
router.post('/verify-otp', verifyCustomerOtp);

// Customer order history route (requires authentication)
router.get('/orders', auth(['customer']), getCustomerOrders);

export default router;