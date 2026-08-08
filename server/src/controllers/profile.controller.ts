import { Response } from 'express';
import pool from '../config/database.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

// Avatars disponíveis
const AVATARS = ['avatar-1', 'avatar-2', 'avatar-3', 'avatar-4'] as const;

// GET PROFILE
export async function getProfile(req: AuthRequest, res: Response) {
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
        name,
        username,
        email,
        avatar,
        role,
        country,
        country_code,
        bio,
        created_at
      FROM users
      WHERE id = $1;
      `,
      [userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Profile not found',
      });
    }

    return res.status(200).json({
      profile: result.rows[0],
    });
  } catch (error) {
    console.error('GET PROFILE ERROR:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

// UPDATE PROFILE
export async function updateProfile(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const { name, username, email, avatar, role, country, country_code, bio } =
      req.body;

    // Validar avatar
    if (avatar !== null && avatar !== undefined && !AVATARS.includes(avatar)) {
      return res.status(400).json({
        message: 'Invalid avatar',
      });
    }

    const result = await pool.query(
      `
      UPDATE users

      SET
        name = $1,
        username = $2,
        email = $3,
        avatar = $4,
        role = $5,
        country = $6,
        country_code = $7,
        bio = $8,
        updated_at = CURRENT_TIMESTAMP

      WHERE id = $9

      RETURNING
        id,
        name,
        username,
        email,
        avatar,
        role,
        country,
        country_code,
        bio,
        created_at;
      `,
      [
        name,
        username,
        email,
        avatar ?? null,
        role,
        country,
        country_code,
        bio,
        userId,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Profile not found',
      });
    }

    return res.status(200).json({
      message: 'Profile updated successfully',
      profile: result.rows[0],
    });
  } catch (error) {
    console.error('UPDATE PROFILE ERROR:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}
