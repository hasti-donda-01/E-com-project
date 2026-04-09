import express from 'express';
import multer from 'multer';
import path from 'path';
import { auth } from '../middleware/auth.js';
import { getAllDisputes, raiseDispute, resolveDispute } from '../controller/dispute.js';
const router = express.Router();


router.post('/raisedespute', auth(["customer"]), raiseDispute);
router.get('/getAllDisputes',auth(["Admin"]),getAllDisputes);
router.post('/resolveDispute/:id',auth(["Admin"]),resolveDispute)


export default router;