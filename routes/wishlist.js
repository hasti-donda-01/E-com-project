


import express from 'express';
import { addtowish, clearwishlist, getproducts, movetocart, removefromwishlist } from '../controller/wishlist.js';
import { auth } from '../middleware/auth.js';


const router = express.Router();

router.post('/addtowish', auth(["custmer"]), addtowish);
router.delete('/remove/:id', auth(["custmer"]), removefromwishlist);
router.get('/get', auth(["custmer"]), getproducts);
router.delete('/clear', auth(["custmer"]), clearwishlist)
router.get('/movetocart/:id', auth(["custmer"]), movetocart)




export default router;