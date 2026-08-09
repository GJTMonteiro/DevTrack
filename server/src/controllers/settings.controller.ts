import { Response } from 'express';

import pool from '../config/database.js';

import { AuthRequest } from '../middleware/auth.middleware.js';

// ============================================================
// GET SETTINGS
// ============================================================

export async function getSettings(req: AuthRequest, res: Response) {
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
    // GET SETTINGS
    // =========================

    const result = await pool.query(
      `
      SELECT
        project_created_notifications,
        project_updated_notifications,
        project_deleted_notifications,

        task_created_notifications,
        task_updated_notifications,
        task_deleted_notifications

      FROM users

      WHERE id = $1;
      `,
      [userId],
    );

    // =========================
    // NOT FOUND
    // =========================

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    // =========================
    // RESPONSE
    // =========================

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

// ============================================================
// UPDATE SETTINGS
// ============================================================

export async function updateSettings(req: AuthRequest, res: Response) {
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
    // GET SETTINGS FROM BODY
    // =========================

    const {
      project_created_notifications,
      project_updated_notifications,
      project_deleted_notifications,

      task_created_notifications,
      task_updated_notifications,
      task_deleted_notifications,
    } = req.body;

    // =========================
    // UPDATE SETTINGS
    // =========================

    const result = await pool.query(
      `
      UPDATE users

      SET
        project_created_notifications = $1,
        project_updated_notifications = $2,
        project_deleted_notifications = $3,

        task_created_notifications = $4,
        task_updated_notifications = $5,
        task_deleted_notifications = $6,

        updated_at = CURRENT_TIMESTAMP

      WHERE id = $7

      RETURNING
        project_created_notifications,
        project_updated_notifications,
        project_deleted_notifications,

        task_created_notifications,
        task_updated_notifications,
        task_deleted_notifications;
      `,
      [
        project_created_notifications,
        project_updated_notifications,
        project_deleted_notifications,

        task_created_notifications,
        task_updated_notifications,
        task_deleted_notifications,

        userId,
      ],
    );

    // =========================
    // NOT FOUND
    // =========================

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    // =========================
    // RESPONSE
    // =========================

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
