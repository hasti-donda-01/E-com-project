
import express from 'express';
import { addtocart, clearcart, getcartofuser, removeproductfromcart, updatequantity } from '../controller/cart.js';
import { auth } from '../middleware/auth.js';


const router = express.Router();

router.post('/addtocart', auth(["Admin", "seller", "customer"]), addtocart);
router.delete('/removeproductfromcart/:id', removeproductfromcart)
router.get('/getcartofuser', auth(["Admin", "seller", "customer"]), getcartofuser)
router.get('/updatequantity/:id', updatequantity);
router.delete('/clearcart/:id', clearcart)


export default router;