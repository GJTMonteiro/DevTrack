import pool from '../config/database.js';

export async function createNotification(
  userId: number,
  type: string,
  title: string,
  message: string,
) {
  try {
    const result = await pool.query(
      `
        INSERT INTO notifications
        (
          user_id,
          type,
          title,
          message,
          is_read
        )
        VALUES ($1, $2, $3, $4, false)
        RETURNING *;
      `,
      [userId, type, title, message],
    );

    console.log('✅ Notification created:', result.rows[0]);

    return result.rows[0];
  } catch (error) {
    console.error('❌ CREATE NOTIFICATION ERROR:', error);
    throw error;
  }
}
