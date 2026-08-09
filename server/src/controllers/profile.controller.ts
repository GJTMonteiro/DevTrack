import { Response } from 'express';
import bcrypt from 'bcrypt';

import pool from '../config/database.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

// ==========================
// AVATARS DISPONÍVEIS
// ==========================

const AVATARS = ['avatar-1', 'avatar-2', 'avatar-3', 'avatar-4'] as const;

// ==========================
// GET PROFILE
// ==========================

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

// ==========================
// UPDATE PROFILE
// ==========================

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

    // ==========================
    // VALIDATIONS
    // ==========================

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: 'Name is required',
      });
    }

    if (!username || !username.trim()) {
      return res.status(400).json({
        message: 'Username is required',
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        message: 'Email is required',
      });
    }

    if (avatar !== null && avatar !== undefined) {
      if (!AVATARS.includes(avatar)) {
        return res.status(400).json({
          message: 'Invalid avatar',
        });
      }
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
        name.trim(),
        username.trim(),
        email.trim(),
        avatar ?? null,
        role ?? null,
        country ?? null,
        country_code ?? null,
        bio ?? null,
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

// ==========================
// CHANGE PASSWORD
// ==========================

export async function changePassword(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const { currentPassword, newPassword } = req.body;

    // ==========================
    // VALIDATE INPUT
    // ==========================

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: 'Current password and new password are required',
      });
    }

    if (
      typeof currentPassword !== 'string' ||
      typeof newPassword !== 'string'
    ) {
      return res.status(400).json({
        message: 'Passwords must be strings',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: 'New password must contain at least 8 characters',
      });
    }

    // ==========================
    // GET CURRENT PASSWORD
    // ==========================

    const result = await pool.query(
      `
      SELECT password_hash
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

    const user = result.rows[0];

    // ==========================
    // VERIFY CURRENT PASSWORD
    // ==========================

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      user.password_hash,
    );

    if (!passwordMatch) {
      return res.status(400).json({
        message: 'Current password is incorrect',
      });
    }

    // ==========================
    // CHECK SAME PASSWORD
    // ==========================

    const samePassword = await bcrypt.compare(newPassword, user.password_hash);

    if (samePassword) {
      return res.status(400).json({
        message: 'New password must be different from the current password',
      });
    }

    // ==========================
    // HASH NEW PASSWORD
    // ==========================

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // ==========================
    // UPDATE PASSWORD
    // ==========================

    await pool.query(
      `
      UPDATE users
      SET
        password_hash = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2;
      `,
      [newPasswordHash, userId],
    );

    return res.status(200).json({
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('CHANGE PASSWORD ERROR:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}
