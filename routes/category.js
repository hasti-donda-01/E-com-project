import express from 'express';
import { createCategory, deletecategory, getcategory, getcategorybyid, updatecategory } from '../controller/category.js';
import { auth } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/create', auth(["Admin"]), upload.single('category_Image'), createCategory);
router.post('/update/:id', auth(["Admin"]), upload.single('category_Image'), updatecategory);
router.get('/get', getcategory);
router.get('/get/:id', getcategorybyid);
router.delete('/delete/:id', auth(["Admin"]), deletecategory);

export default router;