import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "../layouts/DashBoardLayout/DashboardLayout";

import Dashboard from "../pages/Dashboard/DashBoard";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Profile from "../pages/Profile/Profile";
import Project from "../pages/Project/Project";
import Projects from "../pages/Projects/Projects";
import Settings from "../pages/Settings/Settings";
import Tasks from "../pages/Tasks/Tasks";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";

import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

function AppRoutes() {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/project" element={<Project />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/tasks" element={<Tasks />} />
          

        </Route>
      </Route>

    </Routes>
  );
}

export default AppRoutes;