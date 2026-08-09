import { Response } from 'express';

import pool from '../config/database.js';

import { AuthRequest } from '../middleware/auth.middleware.js';

import { createNotification } from '../utils/notification.js';

import { createActivity } from '../utils/activity.js';

// ============================================================
// CREATE TASK
// ============================================================

export async function createTask(req: AuthRequest, res: Response) {
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

    const { project_id, title, description, status, priority, due_date } =
      req.body;

    // =========================
    // VALIDATION
    // =========================

    if (!project_id || !title || !title.trim()) {
      return res.status(400).json({
        message: 'Project and title are required',
      });
    }

    // =========================
    // VERIFY PROJECT
    // =========================

    const projectResult = await pool.query(
      `
      SELECT id
      FROM projects
      WHERE id = $1
      AND user_id = $2;
      `,
      [project_id, userId],
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({
        message: 'Project not found',
      });
    }

    // =========================
    // CREATE TASK
    // =========================

    const result = await pool.query(
      `
      INSERT INTO tasks
      (
        project_id,
        title,
        description,
        status,
        priority,
        due_date
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6
      )
      RETURNING *;
      `,
      [
        project_id,
        title.trim(),
        description?.trim() ?? '',
        status ?? 'To Do',
        priority ?? 'Medium',
        due_date ?? null,
      ],
    );

    const task = result.rows[0];

    console.log('TASK CREATED:', task);

    // ========================================================
    // ACTIVITY
    // ========================================================

    await createActivity(
      userId,
      'task_created',
      'Task Created',
      `Task "${task.title}" was created successfully.`,
    );

    console.log('TASK CREATE ACTIVITY CREATED');

    // ========================================================
    // NOTIFICATION SETTINGS
    // ========================================================

    const settingsResult = await pool.query(
      `
      SELECT task_created_notifications
      FROM users
      WHERE id = $1;
      `,
      [userId],
    );

    const notificationsEnabled =
      settingsResult.rows[0]?.task_created_notifications === true;

    console.log('TASK CREATED NOTIFICATIONS:', notificationsEnabled);

    // ========================================================
    // NOTIFICATION
    // ========================================================

    if (notificationsEnabled) {
      await createNotification(
        userId,
        'task_created',
        'Task Created',
        `Task "${task.title}" was created successfully.`,
      );

      console.log('TASK CREATE NOTIFICATION CREATED');
    }

    // ========================================================
    // RESPONSE
    // ========================================================

    return res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    console.error('CREATE TASK ERROR:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

// ============================================================
// GET ALL TASKS
// ============================================================

export async function getTasks(req: AuthRequest, res: Response) {
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
    // GET TASKS
    // =========================

    const result = await pool.query(
      `
      SELECT
        tasks.*,
        projects.title AS project_name
      FROM tasks
      INNER JOIN projects
        ON projects.id = tasks.project_id
      WHERE projects.user_id = $1
      ORDER BY tasks.created_at DESC;
      `,
      [userId],
    );

    return res.status(200).json({
      tasks: result.rows,
    });
  } catch (error) {
    console.error('GET TASKS ERROR:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

// ============================================================
// DELETE TASK
// ============================================================

export async function deleteTask(req: AuthRequest, res: Response) {
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
    // DELETE TASK
    // =========================

    const result = await pool.query(
      `
      DELETE FROM tasks
      WHERE id = $1
      AND project_id IN (
        SELECT id
        FROM projects
        WHERE user_id = $2
      )
      RETURNING *;
      `,
      [id, userId],
    );

    // =========================
    // NOT FOUND
    // =========================

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }

    const task = result.rows[0];

    console.log('TASK DELETED:', task);

    // ========================================================
    // ACTIVITY
    // ========================================================

    await createActivity(
      userId,
      'task_deleted',
      'Task Deleted',
      `Task "${task.title}" was deleted successfully.`,
    );

    console.log('TASK DELETE ACTIVITY CREATED');

    // ========================================================
    // NOTIFICATION SETTINGS
    // ========================================================

    const settingsResult = await pool.query(
      `
      SELECT task_deleted_notifications
      FROM users
      WHERE id = $1;
      `,
      [userId],
    );

    const notificationsEnabled =
      settingsResult.rows[0]?.task_deleted_notifications === true;

    console.log('TASK DELETED NOTIFICATIONS:', notificationsEnabled);

    // ========================================================
    // NOTIFICATION
    // ========================================================

    if (notificationsEnabled) {
      await createNotification(
        userId,
        'task_deleted',
        'Task Deleted',
        `Task "${task.title}" was deleted successfully.`,
      );

      console.log('TASK DELETE NOTIFICATION CREATED');
    }

    // ========================================================
    // RESPONSE
    // ========================================================

    return res.status(200).json({
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('DELETE TASK ERROR:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

// ============================================================
// UPDATE TASK
// ============================================================

export async function updateTask(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const { title, description, status, priority, due_date } = req.body;

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
        message: 'Task title is required',
      });
    }

    // =========================
    // UPDATE TASK
    // =========================

    const result = await pool.query(
      `
      UPDATE tasks
      SET
        title = $1,
        description = $2,
        status = $3,
        priority = $4,
        due_date = $5,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      AND project_id IN (
        SELECT id
        FROM projects
        WHERE user_id = $7
      )
      RETURNING *;
      `,
      [
        title.trim(),
        description?.trim() ?? '',
        status ?? 'To Do',
        priority ?? 'Medium',
        due_date ?? null,
        id,
        userId,
      ],
    );

    // =========================
    // NOT FOUND
    // =========================

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }

    const task = result.rows[0];

    console.log('TASK UPDATED:', task);

    // ========================================================
    // ACTIVITY
    // ========================================================

    await createActivity(
      userId,
      'task_updated',
      'Task Updated',
      `Task "${task.title}" was updated successfully.`,
    );

    console.log('TASK UPDATE ACTIVITY CREATED');

    // ========================================================
    // NOTIFICATION SETTINGS
    // ========================================================

    const settingsResult = await pool.query(
      `
      SELECT task_updated_notifications
      FROM users
      WHERE id = $1;
      `,
      [userId],
    );

    const notificationsEnabled =
      settingsResult.rows[0]?.task_updated_notifications === true;

    console.log('TASK UPDATED NOTIFICATIONS:', notificationsEnabled);

    // ========================================================
    // NOTIFICATION
    // ========================================================

    if (notificationsEnabled) {
      await createNotification(
        userId,
        'task_updated',
        'Task Updated',
        `Task "${task.title}" was updated successfully.`,
      );

      console.log('TASK UPDATE NOTIFICATION CREATED');
    }

    // ========================================================
    // RESPONSE
    // ========================================================

    return res.status(200).json({
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    console.error('UPDATE TASK ERROR:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}
