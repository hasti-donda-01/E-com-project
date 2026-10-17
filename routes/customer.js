import { sendCustomerOtp, verifyCustomerOtp } from '../auth/customer.js';

router.post('/customer/send-otp', sendCustomerOtp);
router.post('/customer/verify-otp', verifyCustomerOtp);