


import express from 'express';
import { auth } from '../middleware/auth.js';
import { acceptRejectOrder, getmyproducts, getMyProfile, getSellerOrder, getSellerPayments, monitorPayoutStatus, processFulfillment, trackSellerEarnings, updateMyProfile } from '../controller/seller.js';
import { getSellerRefundRequests, sellerHandleRefund } from '../controller/return.js';

const router = express.Router();

router.post('/getSellerPayments', auth(["seller"]), getSellerPayments);
router.get('/getSellerOrder/:id',auth(["seller"]),getSellerOrder)
router.post('/acceptRejectOrder/:id', auth(['seller']), acceptRejectOrder);
router.post('/processFulfillment/:id', auth(['seller']), processFulfillment);
router.post('/trackSellerEarnings', auth(['seller']), trackSellerEarnings);
router.post('/monitorPayoutStatus', auth(['seller']), monitorPayoutStatus);
router.get('/getmyproducts', auth(['seller']), getmyproducts);

router.get('/refundrequests', auth(["seller"]), getSellerRefundRequests);
router.post('/handlerefund/:id', auth(["seller"]), sellerHandleRefund);

router.get('/getMyProfile', auth(["Admin", "seller", "customer"]), getMyProfile)
router.post('/updateMyProfile', auth(["Admin", "seller", "customer"]), updateMyProfile)


export default router;