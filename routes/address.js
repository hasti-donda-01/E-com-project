import express from 'express';
import multer from 'multer';
import path from 'path';
import { auth } from '../middleware/auth.js';
import { add_address, getaddressofuser, remove_address, setdefaultAddress, update_address } from '../controller/address.js';
import { updateorderstatus } from '../controller/admin.js';

const router = express.Router();

router.get('/add', auth(["Admin", "seller", "customer"]), add_address);
router.delete('/remove/:id',auth(["Admin", "seller", "customer"]), remove_address);
router.post('/update/:id',auth(["Admin", "seller", "customer"]), update_address)
router.get('/getaddressofuser',auth(["Admin", "seller", "customer"]), getaddressofuser)
router.get('/setdefaultAddress',auth(["Admin", "seller", "customer"]),  setdefaultAddress);
router.post('/updateorderstatus',auth(["Admin", "seller", "customer"]), updateorderstatus)



export default router;  