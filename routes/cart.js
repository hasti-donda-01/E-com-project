
import express from 'express';
import { addtocart, clearcart, getcartofuser, removeproductfromcart, updatequantity } from '../controller/cart.js';
import { auth } from '../middleware/auth.js';


const router = express.Router();

router.post('/addtocart', auth(["customer"]), addtocart);
router.delete('/removeproductfromcart/:id', auth(["customer"]), removeproductfromcart)
router.get('/getcartofuser', auth(["customer"]), getcartofuser)
router.get('/updatequantity/:id', auth(["customer"]), updatequantity);
router.delete('/clearcart', auth(["customer"]), clearcart)


export default router;