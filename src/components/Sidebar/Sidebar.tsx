import './Sidebar.css';

import { useEffect, useState } from 'react';

import { NavLink, useNavigate } from 'react-router-dom';

import {
  MdDashboard,
  MdFolderOpen,
  MdTaskAlt,
  MdPerson,
  MdSettings,
  MdLogout,
} from 'react-icons/md';

import { getProfile, type ProfileData } from '../../services/profile.service';

import { getAvatar } from '../../utils/avatars';

function Sidebar() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getProfile();

        setProfile(data);
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    }

    loadProfile();
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userName');

    sessionStorage.removeItem('token');

    navigate('/login', {
      replace: true,
    });
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <NavLink to="/dashboard" className="sidebar-logo-link">
          <img src={getAvatar(profile?.avatar)} alt="DevTrack avatar" />

          <span>DevTrack</span>
        </NavLink>
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          <li className="sidebar-item">
            <NavLink className="sidebar-link" to="/dashboard">
              <MdDashboard />

              <span>Dashboard</span>
            </NavLink>
          </li>

          <li className="sidebar-item">
            <NavLink className="sidebar-link" to="/projects">
              <MdFolderOpen />

              <span>Projects</span>
            </NavLink>
          </li>

          <li className="sidebar-item">
            <NavLink className="sidebar-link" to="/tasks">
              <MdTaskAlt />

              <span>Tasks</span>
            </NavLink>
          </li>

          <li className="sidebar-item">
            <NavLink className="sidebar-link" to="/profile">
              <MdPerson />

              <span>Profile</span>
            </NavLink>
          </li>

          <li className="sidebar-item">
            <NavLink className="sidebar-link" to="/settings">
              <MdSettings />

              <span>Settings</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button type="button" className="sidebar-logout" onClick={handleLogout}>
          <MdLogout />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
