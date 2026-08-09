import { Response } from 'express';

import pool from '../config/database.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

// ============================================================
// GET RECENT ACTIVITIES
// ============================================================

export async function getRecentActivities(
  req: AuthRequest,
  res: Response,
) {
  try {
    const userId = req.user?.id;

    // =========================
    // AUTHENTICATION
    // =========================

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    // =========================
    // GET ACTIVITIES
    // =========================

    const result = await pool.query(
      `
      SELECT
        id,
        type,
        title,
        description,
        created_at
      FROM activities
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 10;
      `,
      [userId],
    );

    // =========================
    // RESPONSE
    // =========================

    return res.status(200).json({
      activities: result.rows,
    });
  } catch (error) {
    console.error('GET RECENT ACTIVITIES ERROR:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}