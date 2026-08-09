import { Router } from 'express';

import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteAllNotifications,
} from '../controllers/notification.controller.js';

import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticateToken, getNotifications);

router.get('/unread-count', authenticateToken, getUnreadNotificationCount);

router.put('/read-all', authenticateToken, markAllNotificationsAsRead);

router.delete('/delete-all', authenticateToken, deleteAllNotifications);

router.put('/:id/read', authenticateToken, markNotificationAsRead);

export default router;
