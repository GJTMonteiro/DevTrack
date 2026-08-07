import { Response } from 'express';
import pool from '../config/database.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

// GET USER SKILLS

export async function getSkills(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const result = await pool.query(
      `
      SELECT
        id,
        skill,
        created_at

      FROM user_skills

      WHERE user_id = $1

      ORDER BY skill ASC;
      `,
      [userId],
    );

    return res.status(200).json({
      skills: result.rows,
    });
  } catch (error) {
    console.error('GET SKILLS ERROR:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

// CREATE SKILL

export async function createSkill(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;

    const { skill } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    if (!skill?.trim()) {
      return res.status(400).json({
        message: 'Skill is required',
      });
    }

    const result = await pool.query(
      `
      INSERT INTO user_skills
      (
        user_id,
        skill
      )

      VALUES
      (
        $1,
        $2
      )

      RETURNING *;
      `,
      [userId, skill.trim()],
    );

    return res.status(201).json({
      skill: result.rows[0],
    });
  } catch (error) {
    console.error('CREATE SKILL ERROR:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

// DELETE SKILL

export async function deleteSkill(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;

    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const result = await pool.query(
      `
      DELETE FROM user_skills

      WHERE id = $1
      AND user_id = $2

      RETURNING *;
      `,
      [id, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Skill not found',
      });
    }

    return res.status(200).json({
      message: 'Skill deleted successfully',
    });
  } catch (error) {
    console.error('DELETE SKILL ERROR:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}
