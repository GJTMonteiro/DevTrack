import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import pool from '../config/database.js';

import { AuthRequest } from '../middleware/auth.middleware.js';

// ==========================
// REGISTER
// ==========================

export async function register(req: Request, res: Response) {
  try {
    const { name, username, email, password } = req.body;

    // Verificar se email ou username já existem
    const existingUser = await pool.query(
      `
      SELECT id
      FROM users
      WHERE email = $1 OR username = $2
      `,
      [email, username],
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: 'Email or username already exists',
      });
    }

    // Criar hash da password
    const passwordHash = await bcrypt.hash(password, 10);

    // Criar utilizador
    // Avatar começa como NULL.
    const result = await pool.query(
      `
      INSERT INTO users
      (
        name,
        username,
        email,
        password_hash,
        avatar
      )
      VALUES ($1, $2, $3, $4, NULL)
      RETURNING
        id,
        name,
        username,
        email,
        avatar,
        is_verified,
        created_at;
      `,
      [name, username, email, passwordHash],
    );

    return res.status(201).json({
      message: 'User created successfully',
      user: result.rows[0],
    });
  } catch (error) {
    console.error('REGISTER ERROR:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

// ==========================
// LOGIN
// ==========================

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Procurar utilizador pelo email
    const result = await pool.query(
      `
      SELECT *
      FROM users
      WHERE email = $1
      `,
      [email],
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: 'Invalid email or password',
      });
    }

    const user = result.rows[0];

    // Comparar password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(400).json({
        message: 'Invalid email or password',
      });
    }

    // Criar JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '7d',
      },
    );

    return res.status(200).json({
      message: 'Login successful',

      token,

      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

// ==========================
// ME
// ==========================

export async function me(req: AuthRequest, res: Response) {
  return res.status(200).json({
    message: 'Authenticated',
    user: req.user,
  });
}

export async function changePassword(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: 'Current password and new password are required',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: 'New password must be at least 8 characters long',
      });
    }

    // Procurar a password atual do utilizador
    const result = await pool.query(
      `
      SELECT password_hash
      FROM users
      WHERE id = $1
      `,
      [userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const user = result.rows[0];

    // Verificar password atual
    const passwordMatch = await bcrypt.compare(
      currentPassword,
      user.password_hash,
    );

    if (!passwordMatch) {
      return res.status(400).json({
        message: 'Current password is incorrect',
      });
    }

    // Criar hash da nova password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Atualizar password
    await pool.query(
      `
      UPDATE users
      SET
        password_hash = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
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
