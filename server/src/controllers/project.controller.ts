import { Response } from 'express';

import pool from '../config/database.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { createNotification } from '../utils/notification.js';

// ============================================================
// CREATE PROJECT
// ============================================================

export async function createProject(req: AuthRequest, res: Response) {
  try {
    const { title, description, color, status, priority } = req.body;

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
    // VALIDATION
    // =========================

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: 'Project title is required',
      });
    }

    // =========================
    // CREATE PROJECT
    // =========================

    const result = await pool.query(
      `
        INSERT INTO projects
        (
          user_id,
          title,
          description,
          color,
          status,
          priority
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `,
      [
        userId,
        title.trim(),
        description?.trim() ?? '',
        color ?? '#3B82F6',
        status ?? 'Planning',
        priority ?? 'Medium',
      ],
    );

    const project = result.rows[0];

    console.log('PROJECT CREATED:', project);

    // =========================
    // CHECK CREATE NOTIFICATIONS
    // =========================

    const settingsResult = await pool.query(
      `
        SELECT project_created_notifications
        FROM users
        WHERE id = $1;
      `,
      [userId],
    );

    const notificationsEnabled =
      settingsResult.rows[0]?.project_created_notifications === true;

    console.log('PROJECT CREATED NOTIFICATIONS:', notificationsEnabled);

    // =========================
    // CREATE NOTIFICATION
    // =========================

    if (notificationsEnabled) {
      await createNotification(
        userId,
        'project_created',
        'Project Created',
        `Project "${project.title}" was created successfully.`,
      );

      console.log('CREATE NOTIFICATION CREATED');
    }

    // =========================
    // RESPONSE
    // =========================

    return res.status(201).json({
      message: 'Project created successfully',
      project,
    });
  } catch (error) {
    console.error('CREATE PROJECT ERROR:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

// ============================================================
// GET ALL USER PROJECTS
// ============================================================

export async function getProjects(req: AuthRequest, res: Response) {
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
    // GET PROJECTS
    // =========================

    const result = await pool.query(
      `
        SELECT
          id,
          title,
          description,
          color,
          status,
          priority,
          created_at,
          updated_at
        FROM projects
        WHERE user_id = $1
        ORDER BY created_at DESC;
      `,
      [userId],
    );

    return res.status(200).json({
      projects: result.rows,
    });
  } catch (error) {
    console.error('GET PROJECTS ERROR:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

// ============================================================
// GET SINGLE PROJECT
// ============================================================

export async function getProjectById(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    // =========================
    // AUTHENTICATION
    // =========================

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    // =========================
    // GET PROJECT
    // =========================

    const result = await pool.query(
      `
        SELECT
          id,
          user_id,
          title,
          description,
          color,
          status,
          priority,
          created_at,
          updated_at
        FROM projects
        WHERE id = $1
        AND user_id = $2;
      `,
      [id, userId],
    );

    // =========================
    // NOT FOUND
    // =========================

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Project not found',
      });
    }

    // =========================
    // RESPONSE
    // =========================

    return res.status(200).json({
      project: result.rows[0],
    });
  } catch (error) {
    console.error('GET PROJECT ERROR:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

// ============================================================
// UPDATE PROJECT
// ============================================================

export async function updateProject(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const { title, description, color, status, priority } = req.body;

    // =========================
    // AUTHENTICATION
    // =========================

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    // =========================
    // VALIDATION
    // =========================

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: 'Project title is required',
      });
    }

    // =========================
    // UPDATE PROJECT
    // =========================

    const result = await pool.query(
      `
        UPDATE projects
        SET
          title = $1,
          description = $2,
          color = $3,
          status = $4,
          priority = $5,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $6
        AND user_id = $7
        RETURNING *;
      `,
      [
        title.trim(),
        description?.trim() ?? '',
        color ?? '#3B82F6',
        status ?? 'Planning',
        priority ?? 'Medium',
        id,
        userId,
      ],
    );

    // =========================
    // NOT FOUND
    // =========================

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Project not found',
      });
    }

    const project = result.rows[0];

    console.log('PROJECT UPDATED:', project);

    // =========================
    // CHECK UPDATE NOTIFICATIONS
    // =========================

    const settingsResult = await pool.query(
      `
        SELECT project_updated_notifications
        FROM users
        WHERE id = $1;
      `,
      [userId],
    );

    const notificationsEnabled =
      settingsResult.rows[0]?.project_updated_notifications === true;

    console.log('PROJECT UPDATED NOTIFICATIONS:', notificationsEnabled);

    // =========================
    // CREATE NOTIFICATION
    // =========================

    if (notificationsEnabled) {
      await createNotification(
        userId,
        'project_updated',
        'Project Updated',
        `Project "${project.title}" was updated successfully.`,
      );

      console.log('UPDATE NOTIFICATION CREATED');
    }

    // =========================
    // RESPONSE
    // =========================

    return res.status(200).json({
      message: 'Project updated successfully',
      project,
    });
  } catch (error) {
    console.error('UPDATE PROJECT ERROR:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

// ============================================================
// DELETE PROJECT
// ============================================================

export async function deleteProject(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    // =========================
    // AUTHENTICATION
    // =========================

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    // =========================
    // GET PROJECT BEFORE DELETE
    // =========================

    const projectResult = await pool.query(
      `
        SELECT
          id,
          title
        FROM projects
        WHERE id = $1
        AND user_id = $2;
      `,
      [id, userId],
    );

    // =========================
    // NOT FOUND
    // =========================

    if (projectResult.rows.length === 0) {
      return res.status(404).json({
        message: 'Project not found',
      });
    }

    const project = projectResult.rows[0];

    console.log('PROJECT TO DELETE:', project);

    // =========================
    // DELETE PROJECT
    // =========================

    await pool.query(
      `
        DELETE FROM projects
        WHERE id = $1
        AND user_id = $2;
      `,
      [id, userId],
    );

    console.log('PROJECT DELETED:', project);

    // =========================
    // CHECK DELETE NOTIFICATIONS
    // =========================

    const settingsResult = await pool.query(
      `
        SELECT project_deleted_notifications
        FROM users
        WHERE id = $1;
      `,
      [userId],
    );

    const notificationsEnabled =
      settingsResult.rows[0]?.project_deleted_notifications === true;

    console.log('PROJECT DELETED NOTIFICATIONS:', notificationsEnabled);

    // =========================
    // CREATE DELETE NOTIFICATION
    // =========================

    if (notificationsEnabled) {
      await createNotification(
        userId,
        'project_deleted',
        'Project Deleted',
        `Project "${project.title}" was deleted successfully.`,
      );

      console.log('DELETE NOTIFICATION CREATED');
    }

    // =========================
    // RESPONSE
    // =========================

    return res.status(200).json({
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('DELETE PROJECT ERROR:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}
