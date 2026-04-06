


import express from 'express';
import { auth } from '../middleware/auth.js';
import { deleteUser, getUserProfile } from '../controller/user.js';
import { getalluser } from '../controller/sellerdetail.js';

const router = express.Router();

router.post('/getUserProfile/:id', getUserProfile);
router.delete('/deleteUser/:id', deleteUser);
// router.update('/update/:id')

router.get("/getuser/:id", getalluser)


export default router;