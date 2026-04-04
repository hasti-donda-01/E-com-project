
import express from 'express';
import { addtocart, clearcart, getcartofuser, removeproductfromcart, updatequantity } from '../controller/cart.js';


const router = express.Router();

router.post('/addtocart',addtocart);
router.delete('/removeproductfromcart/:id',removeproductfromcart)
router.get('/getcartofuser/:id',getcartofuser)
router.get('/updatequantity/:id',updatequantity);
router.delete('/clearcart/:id',clearcart)


export default router;