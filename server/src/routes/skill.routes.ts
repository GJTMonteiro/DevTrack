import { Router } from 'express';

import {
  getSkills,
  createSkill,
  deleteSkill,
} from '../controllers/skill.contoller.js';

import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticateToken, getSkills);

router.post('/', authenticateToken, createSkill);

router.delete('/:id', authenticateToken, deleteSkill);

export default router;
