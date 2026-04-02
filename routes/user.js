


import express from 'express';
import { auth } from '../middleware/auth.js';
import { deleteUser, getUserProfile } from '../controller/user.js';

const router = express.Router();

router.post('/getUserProfile/:id', getUserProfile);
router.delete('/deleteUser/:id', deleteUser);




export default router;