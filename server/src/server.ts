import 'dotenv/config';

import app from './app.js';
import pool from './config/database.js';

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    const result = await pool.query('SELECT NOW()');

    console.log('✅ Database connected!');
    console.log(result.rows[0]);

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Database connection failed');
    console.error(error);
    process.exit(1);
  }
}

startServer();
