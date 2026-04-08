import express from 'express';
import { cancelOrder, createOrder, revenue, trackOrder, trackpayment, updatepaymentstatus, vieworderhistory } from '../controller/order.js';
import { auth } from '../middleware/auth.js';
import { adjustPaymentRecord, approvereq, requestReturn, trackrefund } from '../controller/return.js';


const router = express.Router();
router.post('/place', createOrder);
router.delete('/cancel/:id', cancelOrder)
router.get('/track/:id', trackOrder);
router.get('/viewhistory/:id', vieworderhistory)


router.post('/updatepaymentstatus', auth(["Admin"]), updatepaymentstatus)
router.post('/trackpayment/:id', auth(["Admin"]), trackpayment);
router.get('/revenue', auth(["Admin"]), revenue)

//manage revenue
export default router;


//return order

router.post('/requestReturn/:id', auth(['customer']), requestReturn)
router.post('/approvereq/:id', auth(["Admin"]), approvereq);
router.post('/trackrefund/:id', trackrefund);
router.post('/adjustPaymentRecord/:id', adjustPaymentRecord)
//  auth(["Admin"])