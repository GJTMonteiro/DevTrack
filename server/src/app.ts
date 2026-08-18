import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js';
import taskRoutes from './routes/task.routes.js';
import skillRoutes from './routes/skill.routes.js';
import profileRoutes from './routes/profile.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import activityRoutes from './routes/activity.routes.js';

const app = express();

// =========================
// MIDDLEWARE
// =========================

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  }),
);

app.use(express.json());

// =========================
// ROOT
// =========================

app.get('/', (_req, res) => {
  res.json({
    message: 'DevTrack API is running 🚀',
  });
});

// =========================
// API ROUTES
// =========================

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/activities', activityRoutes);

// =========================
// EXPORT
// =========================

export default app;
