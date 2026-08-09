import { Router } from 'express';

import { getRecentActivities } from '../controllers/activity.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// ============================================================
// GET RECENT ACTIVITIES
// ============================================================

router.get('/', authenticateToken, getRecentActivities);

export default router;
