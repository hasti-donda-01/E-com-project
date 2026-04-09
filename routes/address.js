import express from 'express';
import multer from 'multer';
import path from 'path';
import { auth } from '../middleware/auth.js';
import { add_address, getaddressofuser, remove_address, setdefaultAddress, update_address } from '../controller/address.js';
import { updateorderstatus } from '../controller/admin.js';

const router = express.Router();

router.get('/add', auth(["Admin", "seller", "customer"]), add_address);
router.delete('/remove/:id', remove_address);
router.post('/update/:id', update_address)
router.get('/getaddressofuser/:id', getaddressofuser)
router.get('/setdefaultAddress', auth(["Admin", "seller", "customer"]), setdefaultAddress);
router.post('/updateorderstatus', updateorderstatus)


export default router;  