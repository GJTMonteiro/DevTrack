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

  // ==========================
  // LOAD PROFILE
  // ==========================

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getProfile();

        setProfile(data);
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    }

    // Carregar perfil ao abrir o Sidebar
    loadProfile();

    // ==========================
    // PROFILE UPDATED EVENT
    // ==========================

    function handleProfileUpdated() {
      loadProfile();
    }

    window.addEventListener('profile-updated', handleProfileUpdated);

    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdated);
    };
  }, []);

  // ==========================
  // LOGOUT
  // ==========================

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
      {/* ==========================
          LOGO / BRAND
      ========================== */}

      <div className="sidebar-brand">
        <NavLink to="/dashboard" className="sidebar-brand-link">
          <img
            src={getAvatar(profile?.avatar ?? null)}
            alt="Profile avatar"
            className="sidebar-avatar"
          />

          <span>DevTrack</span>
        </NavLink>
      </div>

      {/* ==========================
          NAVIGATION
      ========================== */}

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

      {/* ==========================
          LOGOUT
      ========================== */}

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
