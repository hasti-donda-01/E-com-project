


import express from 'express';
import { auth } from '../middleware/auth.js';
import { getUserProfile } from '../controller/user.js';

const router = express.Router();

router.post('/getUserProfile/:id', getUserProfile);




export default router;