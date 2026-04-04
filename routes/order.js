import express from 'express';
import { cancelOrder, createOrder, trackOrder, vieworderhistory } from '../controller/order.js';


const router = express.Router();
router.post('/place', createOrder);
router.delete('/cancel/:id', cancelOrder)
router.get('/track/:id',trackOrder);
router.get('/viewhistory/:id',vieworderhistory)



export default router;