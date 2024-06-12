import express from 'express';
import { userControler } from '../controllers/user.controller.js';

const router = express.Router();
router.post('/register', userControler.register);
router.post('/login', userControler.login);

export default router;
