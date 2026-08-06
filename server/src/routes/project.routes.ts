import { Router } from 'express';

import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from '../controllers/project.controller.js';

import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', authenticateToken, createProject);

router.get('/', authenticateToken, getProjects);

router.get('/:id', authenticateToken, getProjectById);

router.put('/:id', authenticateToken, updateProject);

router.delete('/:id', authenticateToken, deleteProject);

export default router;
