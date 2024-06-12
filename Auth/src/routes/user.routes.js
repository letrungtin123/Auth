import express from 'express';
import { getDetailUser } from '../controllers/user.controller.js';
import { checkAuth } from '../middlewares/checkPermission.middleware.js';

const router = express.Router();

router.get('/user', checkAuth, getDetailUser);

export default router;
