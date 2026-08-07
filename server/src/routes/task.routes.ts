import { Router } from 'express';

import {
  createTask,
  getTasks,
  deleteTask,
  updateTask,
} from '../controllers/task.controller.js';

import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', authenticateToken, createTask);

router.get('/', authenticateToken, getTasks);

router.put('/:id', authenticateToken, updateTask);

router.delete('/:id', authenticateToken, deleteTask);

export default router;
