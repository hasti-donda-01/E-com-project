


import express from 'express';
import { auth } from '../middleware/auth.js';
import { deleteUser, getUserProfile, updateUser } from '../controller/user.js';
import { getalluser } from '../controller/dashboards.js';

const router = express.Router();

router.get('/getUserProfile', auth(["customer", "Admin", "seller"]), getUserProfile);
// router.delete('/deleteUser/:id',auth["Admin"], deleteUser);
router.delete('/deleteUser/:id',auth(["Admin"]),deleteUser)
// router.update('/update/:id')
router.post('/update/:id', auth(["customer", "Admin", "seller"]), updateUser);

router.get("/getuser", auth(["seller"]), getalluser)


export default router;