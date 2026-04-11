import express from 'express';
import { cancelOrder, createOrder, revenue, trackOrder, trackpayment, updatepaymentstatus, vieworderhistory } from '../controller/order.js';
import { auth } from '../middleware/auth.js';
import { adjustPaymentRecord, approvereq, getSellerRefundRequests, requestReturn, sellerHandleRefund, trackrefund } from '../controller/return.js';


const router = express.Router();
router.post('/place', auth(["customer"]), createOrder);
router.delete('/cancel/:id',auth(["customer"]), cancelOrder)
router.get('/track/:id', trackOrder);
router.get('/viewhistory/:id', vieworderhistory)


router.post('/updatepaymentstatus/:id', auth(["Admin"]), updatepaymentstatus)
router.post('/trackpayment/:id', auth(["Admin"]), trackpayment);
router.get('/revenue', auth(["Admin"]), revenue)

//manage revenue



//return order

router.post('/requestReturn/:id', auth(['customer']), requestReturn)
router.post('/approvereq/:id', auth(["Admin"]), approvereq);
router.post('/trackrefund/:id', trackrefund);
router.post('/adjustPaymentRecord/:id', adjustPaymentRecord);
router.get('/getSellerRefundRequests',auth(["seller"]),getSellerRefundRequests);
router.post('/sellerHandleRefund/:id',auth(["seller"]),sellerHandleRefund)
//  auth(["Admin"])



export default router;