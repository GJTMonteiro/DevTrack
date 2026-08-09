import pool from '../config/database.js';

export async function createActivity(
  userId: number,
  type: string,
  title: string,
  description: string,
) {
  try {
    await pool.query(
      `
      INSERT INTO activities
      (
        user_id,
        type,
        title,
        description
      )
      VALUES ($1, $2, $3, $4);
      `,
      [userId, type, title, description],
    );
  } catch (error) {
    console.error('CREATE ACTIVITY ERROR:', error);
  }
}