


import express from 'express';
import { auth } from '../middleware/auth.js';
import { acceptRejectOrder, getSellerPayments, monitorPayoutStatus, processFulfillment, trackSellerEarnings } from '../controller/seller.js';

const router = express.Router();

router.post('/getSellerPayments', auth(["seller"]), getSellerPayments);
router.post('/acceptRejectOrder/:id', auth(['seller']), acceptRejectOrder);
router.post('/processFulfillment/:id', auth(['seller']), processFulfillment);
router.post('/trackSellerEarnings', auth(['seller']), trackSellerEarnings);
router.post('/monitorPayoutStatus', auth(['seller']), monitorPayoutStatus);


export default router;