import { Request, Response } from "express";
import bcrypt from "bcrypt";
import pool from "../config/database.js";

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
            [
                email,
                username
            ]
        );


        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                message: "Email or username already exists"
            });
        }


        // Criar hash da password
        const passwordHash = await bcrypt.hash(password, 10);


        // Criar utilizador
        const result = await pool.query(
            `
            INSERT INTO users
            (
                name,
                username,
                email,
                password_hash
            )
            VALUES ($1, $2, $3, $4)
            RETURNING
                id,
                name,
                username,
                email,
                avatar,
                is_verified,
                created_at;
            `,
            [
                name,
                username,
                email,
                passwordHash
            ]
        );


        res.status(201).json({
            message: "User created successfully",
            user: result.rows[0]
        });


    } catch (error) {

        console.error("REGISTER ERROR:", error);

        res.status(500).json({
            message: "Internal server error"
        });
    }
}