import { Router } from 'express';

import {
  register,
  login,
  me,
  changePassword,
} from '../controllers/authcontroller.js';

import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', register);

router.post('/login', login);

router.get('/me', authenticateToken, me);

router.put('/change-password', authenticateToken, changePassword);

export default router;
