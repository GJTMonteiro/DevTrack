import { Router } from 'express';

import {
  getProfile,
  updateProfile,
  changePassword,
} from '../controllers/profile.controller.js';

import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// GET PROFILE
router.get('/', authenticateToken, getProfile);

// UPDATE PROFILE
router.put('/', authenticateToken, updateProfile);

// CHANGE PASSWORD
router.put('/password', authenticateToken, changePassword);

export default router;
