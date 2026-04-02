
import express from 'express';
import { addtocart, getcartofuser, removeproductfromcart, updatequantity } from '../controller/cart.js';


const router = express.Router();

router.get('/addtocart',addtocart);
router.delete('/removeproductfromcart/:id',removeproductfromcart)
router.get('/getcartofuser/:id',getcartofuser)
router.get('/updatequantity/:id',updatequantity)


export default router;