import { Response } from 'express';

import pool from '../config/database.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

// =========================
// GET NOTIFICATIONS
// =========================

export async function getNotifications(req: AuthRequest, res: Response) {
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
          type,
          title,
          message,
          is_read,
          created_at
        FROM notifications
        WHERE user_id = $1
        ORDER BY created_at DESC;
      `,
      [userId],
    );

    return res.status(200).json({
      notifications: result.rows,
    });
  } catch (error) {
    console.error('GET NOTIFICATIONS ERROR:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

// =========================
// GET UNREAD NOTIFICATIONS COUNT
// =========================

export async function getUnreadNotificationCount(
  req: AuthRequest,
  res: Response,
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const result = await pool.query(
      `
        SELECT COUNT(*)::int AS count
        FROM notifications
        WHERE user_id = $1
        AND is_read = false;
      `,
      [userId],
    );

    return res.status(200).json({
      count: result.rows[0].count,
    });
  } catch (error) {
    console.error('GET UNREAD NOTIFICATION COUNT ERROR:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

// =========================
// MARK NOTIFICATION AS READ
// =========================

export async function markNotificationAsRead(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const notificationId = Number(id);

    if (!Number.isInteger(notificationId)) {
      return res.status(400).json({
        message: 'Invalid notification id',
      });
    }

    const result = await pool.query(
      `
        UPDATE notifications

        SET is_read = true

        WHERE id = $1
        AND user_id = $2

        RETURNING
          id,
          type,
          title,
          message,
          is_read,
          created_at;
      `,
      [notificationId, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Notification not found',
      });
    }

    return res.status(200).json({
      message: 'Notification marked as read',
      notification: result.rows[0],
    });
  } catch (error) {
    console.error('MARK NOTIFICATION AS READ ERROR:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

// =========================
// MARK ALL NOTIFICATIONS AS READ
// =========================

export async function markAllNotificationsAsRead(
  req: AuthRequest,
  res: Response,
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    await pool.query(
      `
        UPDATE notifications

        SET is_read = true

        WHERE user_id = $1
        AND is_read = false;
      `,
      [userId],
    );

    return res.status(200).json({
      message: 'All notifications marked as read',
    });
  } catch (error) {
    console.error('MARK ALL NOTIFICATIONS AS READ ERROR:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

// =========================
// DELETE ALL NOTIFICATIONS
// =========================

export async function deleteAllNotifications(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    await pool.query(
      `
        DELETE FROM notifications
        WHERE user_id = $1;
      `,
      [userId],
    );

    return res.status(200).json({
      message: 'All notifications deleted successfully',
    });
  } catch (error) {
    console.error('DELETE ALL NOTIFICATIONS ERROR:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}
