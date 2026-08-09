import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import ForgotPassword from '../pages/ForgotPassword/ForgotPassword';

import Dashboard from '../pages/Dashboard/DashBoard';
import Profile from '../pages/Profile/Profile';
import Projects from '../pages/Projects/Projects';
import Project from '../pages/Project/Project';
import Tasks from '../pages/Tasks/Tasks';
import Settings from '../pages/Settings/Settings';

import DashboardLayout from '../layouts/DashBoardLayout/DashboardLayout';

import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

function AppRoutes() {
  return (
    <Routes>
      {/* =========================
          PUBLIC ROUTES
      ========================= */}

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* =========================
          PRIVATE ROUTES
      ========================= */}

      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/profile" element={<Profile />} />

          <Route path="/projects" element={<Projects />} />

          <Route path="/project" element={<Project />} />

          <Route path="/tasks" element={<Tasks />} />

          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* =========================
          DEFAULT
      ========================= */}

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;
