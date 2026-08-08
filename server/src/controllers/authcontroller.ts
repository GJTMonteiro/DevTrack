import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import pool from '../config/database.js';

export async function register(req: Request, res: Response) {
  try {
    const { name, username, email, password } = req.body;

    // Verificar se já existe email ou username
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
    // O avatar começa como NULL.
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

    res.status(201).json({
      message: 'User created successfully',
      user: result.rows[0],
    });
  } catch (error) {
    console.error('REGISTER ERROR:', error);

    res.status(500).json({
      message: 'Internal server error',
    });
  }
}

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

    res.status(200).json({
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

    res.status(500).json({
      message: 'Internal server error',
    });
  }
}

import { AuthRequest } from '../middleware/auth.middleware.js';

export async function me(req: AuthRequest, res: Response) {
  res.status(200).json({
    message: 'Authenticated',
    user: req.user,
  });
}
