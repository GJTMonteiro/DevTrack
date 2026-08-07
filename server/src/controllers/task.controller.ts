import { Response } from 'express';
import pool from '../config/database.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

// CREATE TASK
export async function createTask(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const { project_id, title, description, status, priority, due_date } =
      req.body;

    if (!project_id || !title) {
      return res.status(400).json({
        message: 'Project and title are required',
      });
    }

    // Verifica se o projeto pertence ao utilizador
    const project = await pool.query(
      `
      SELECT id
      FROM projects
      WHERE id = $1
      AND user_id = $2;
      `,
      [project_id, userId],
    );

    if (project.rows.length === 0) {
      return res.status(404).json({
        message: 'Project not found',
      });
    }

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
        title,
        description ?? '',
        status ?? 'To Do',
        priority ?? 'Medium',
        due_date ?? null,
      ],
    );

    return res.status(201).json({
      message: 'Task created successfully',
      task: result.rows[0],
    });
  } catch (error) {
    console.error('CREATE TASK ERROR:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

// GET ALL TASKS
export async function getTasks(req: AuthRequest, res: Response) {
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

// DELETE TASK
export async function deleteTask(req: AuthRequest, res: Response) {
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

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }

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

// UPDATE TASK

export async function updateTask(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;

    const { id } = req.params;

    const { title, description, status, priority, due_date } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

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
        title,

        description ?? '',

        status,

        priority,

        due_date ?? null,

        id,

        userId,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }

    return res.status(200).json({
      message: 'Task updated successfully',

      task: result.rows[0],
    });
  } catch (error) {
    console.error('UPDATE TASK ERROR:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}
