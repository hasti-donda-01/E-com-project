


import express from 'express';
import { auth } from '../middleware/auth.js';
import { acceptRejectOrder, getmyproducts, getSellerPayments, monitorPayoutStatus, processFulfillment, trackSellerEarnings } from '../controller/seller.js';

const router = express.Router();

router.post('/getSellerPayments', auth(["seller"]), getSellerPayments);
router.post('/acceptRejectOrder/:id', auth(['seller']), acceptRejectOrder);
router.post('/processFulfillment/:id', auth(['seller']), processFulfillment);
router.post('/trackSellerEarnings', auth(['seller']), trackSellerEarnings);
router.post('/monitorPayoutStatus', auth(['seller']), monitorPayoutStatus);
router.post('/getmyproducts', auth(['seller']), getmyproducts);

router.get('/refundrequests', auth(["seller"]), getSellerRefundRequests);
router.post('/handlerefund/:id', auth(["seller"]), sellerHandleRefund);


export default router;