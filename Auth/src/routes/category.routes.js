import {
	createCategory,
	deleteCategory,
	getCategoty,
	getCategotyById,
	updateCategoryById,
} from '../controllers/category.controller.js';

import express from 'express';
import { checkPermission } from '../middlewares/checkPermission.middleware.js';

const router = express.Router();

router.post('/categories', checkPermission, createCategory);
router.get('/categories', getCategoty);
router.get('/categories/:id', getCategotyById);
router.delete('/categories/:id', checkPermission, deleteCategory);
router.patch('/categories/:id', checkPermission, updateCategoryById);

export default router;
