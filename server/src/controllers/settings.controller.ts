import { Response } from 'express';

import pool from '../config/database.js';

import { AuthRequest } from '../middleware/auth.middleware.js';

// GET SETTINGS
export async function getSettings(req: AuthRequest, res: Response) {
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
        project_created_notifications,
        project_updated_notifications,
        project_deleted_notifications
      FROM users
      WHERE id = $1;
      `,
      [userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    return res.status(200).json({
      settings: result.rows[0],
    });
  } catch (error) {
    console.error('GET SETTINGS ERROR:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

// UPDATE SETTINGS
export async function updateSettings(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const {
      project_created_notifications,
      project_updated_notifications,
      project_deleted_notifications,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE users
      SET
        project_created_notifications = $1,
        project_updated_notifications = $2,
        project_deleted_notifications = $3,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING
        project_created_notifications,
        project_updated_notifications,
        project_deleted_notifications;
      `,
      [
        project_created_notifications,
        project_updated_notifications,
        project_deleted_notifications,
        userId,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    return res.status(200).json({
      message: 'Settings updated successfully',
      settings: result.rows[0],
    });
  } catch (error) {
    console.error('UPDATE SETTINGS ERROR:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}
