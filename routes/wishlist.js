


import express from 'express';
import { addtowish, clearwishlist, getproducts, removefromwishlist } from '../controller/wishlist.js';


const router = express.Router();

router.post('/addtowish', addtowish);
router.delete('/remove/:id', removefromwishlist);
router.get('/get/:id', getproducts);
router.delete('/clear/:id', clearwishlist)
// router.get('/movetocart/:id', movetocart)




export default router;