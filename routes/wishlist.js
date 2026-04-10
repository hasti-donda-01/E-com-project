


import express from 'express';
import { addtowish, clearwishlist, getproducts, movetocart, removefromwishlist } from '../controller/wishlist.js';
import { auth } from '../middleware/auth.js';


const router = express.Router();

router.post('/addtowish', auth(["customer"]), addtowish);
router.delete('/remove/:id', auth(["customer"]), removefromwishlist);
router.get('/get', auth(["customer"]), getproducts);
router.delete('/clear', auth(["customer"]), clearwishlist)
router.get('/movetocart/:id', auth(["customer"]), movetocart)




export default router;