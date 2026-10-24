    // All users

    import express from 'express';
    import { changePassword, getUserSession, login, logout, logoutUser, registerSeller, resetPassword, verifyEmail, verifyOTP } from '../auth/seller.js';
    import { sendCustomerOtp, verifyCustomerOtp } from '../auth/customer.js';
    import { auth } from '../middleware/auth.js';
    import { uploadProfile } from '../config/cloudinary.js';

    const router = express.Router();

    router.post('/customer/send-otp', sendCustomerOtp);
    router.post('/customer/verify-otp', verifyCustomerOtp);

    router.post('/create', uploadProfile.single("profileImage"), registerSeller);
    router.post('/verifyOTP', verifyOTP);
    router.post('/login', login);
    router.get('/session', auth(["seller", "user", "customer", "admin", "Admin"]), getUserSession);
    router.post('/logout', auth(["seller", "user", "customer", "admin", "Admin"]), logoutUser);
    router.post('/logout/:id', logout);
    router.post('/verifyEmail', verifyEmail);
    router.post('/resetPassword', resetPassword);
    router.post('/changePassword', auth(["seller", "user", "customer", "admin", "Admin"]), changePassword);

    export default router;