import { Response } from 'express';

import pool from '../config/database.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

// CREATE PROJECT

export async function createProject(req: AuthRequest, res: Response) {
  try {
    const { title, description, color, status, priority } = req.body;

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    if (!title) {
      return res.status(400).json({
        message: 'Project title is required',
      });
    }

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
        userId,
        title,
        description ?? '',
        color ?? '#3B82F6',
        status ?? 'Planning',
        priority ?? 'Medium',
      ],
    );

    return res.status(201).json({
      message: 'Project created successfully',
      project: result.rows[0],
    });
  } catch (error) {
    console.error('CREATE PROJECT ERROR:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

// GET ALL USER PROJECTS

export async function getProjects(req: AuthRequest, res: Response) {
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

// GET SINGLE PROJECT

export async function getProjectById(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const result = await pool.query(
      `
            SELECT *

            FROM projects

            WHERE id = $1
            AND user_id = $2;
            `,
      [id, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Project not found',
      });
    }

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

// UPDATE PROJECT

// UPDATE PROJECT

export async function updateProject(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const { title, description, color, status, priority } = req.body;

    if (!title) {
      return res.status(400).json({
        message: 'Project title is required',
      });
    }

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
        title,
        description ?? '',
        color ?? '#3B82F6',
        status ?? 'Planning',
        priority ?? 'Medium',
        id,
        userId,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Project not found',
      });
    }

    return res.status(200).json({
      message: 'Project updated successfully',
      project: result.rows[0],
    });
  } catch (error) {
    console.error('UPDATE PROJECT ERROR:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

// DELETE PROJECT

export async function deleteProject(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;

    const { id } = req.params;

    await pool.query(
      `
            DELETE FROM projects

            WHERE id = $1
            AND user_id = $2;
            `,
      [id, userId],
    );

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
