import {
	createProduct,
	deleteProduct,
	getProduct,
	getProductById,
	updateProductById,
} from '../controllers/product.controller.js';

import { checkPermission } from '../middlewares/checkPermission.middleware.js';
import express from 'express';

const router = express.Router();

// routers

// POST /api/products
router.post('/products', checkPermission, createProduct);
// Lấy ra danh sách sản phẩm
// GET /api/products
router.get('/products', getProduct);
// Lấy ra 1 sản phẩm theo id
// GET /api/products/:id
router.get('/products/:id', getProductById);
// Xóa sản phẩm
// DELETE /api/products/:id
router.delete('/products/:id', checkPermission, deleteProduct);
// cập nhật sản phẩm
// PUT /api/products/:id
router.put('/products/:id', checkPermission, updateProductById);
// PATCH /api/products/:id
router.patch('/products/:id', checkPermission, updateProductById);

export default router;
