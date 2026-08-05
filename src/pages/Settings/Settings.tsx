import './Settings.css';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  MdPerson,
  MdDarkMode,
  MdNotifications,
  MdSecurity,
  MdPalette,
  MdStorage,
  MdLogout,
} from 'react-icons/md';

function Settings() {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(true);

  const [emailNotifications, setEmailNotifications] = useState(true);

  const [taskNotifications, setTaskNotifications] = useState(true);

  const [weeklyReport, setWeeklyReport] = useState(false);

  function handleThemeToggle() {
    document.body.classList.toggle('light-mode');
    setDarkMode(!darkMode);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('username');

    navigate('/login');
  }

  const fullName = localStorage.getItem('userName') || 'Developer';

  const username = localStorage.getItem('username') || 'developer';

  return (
    <main className="settings-page">
      <section className="settings-header">
        <div>
          <h1>Settings</h1>

          <p>Manage your account, preferences and workspace.</p>
        </div>
      </section>

      <section className="settings-card">
        <div className="settings-card-title">
          <MdPerson />

          <h2>Profile</h2>
        </div>

        <div className="settings-grid">
          <div className="settings-group">
            <label>Full Name</label>

            <input type="text" value={fullName} readOnly />
          </div>

          <div className="settings-group">
            <label>Username</label>

            <input type="text" value={username} readOnly />
          </div>

          <div className="settings-group">
            <label>Email</label>

            <input type="email" value="user@email.com" readOnly />
          </div>

          <div className="settings-group">
            <label>Role</label>

            <input type="text" value="Front-End Developer" readOnly />
          </div>
        </div>
      </section>

      <section className="settings-card">
        <div className="settings-card-title">
          <MdDarkMode />

          <h2>Appearance</h2>
        </div>

        <div className="settings-option">
          <div className="settings-option-info">
            <div>
              <strong>Dark Mode</strong>

              <p>Switch between dark and light theme.</p>
            </div>

            <label className="switch">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={handleThemeToggle}
              />

              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="settings-option">
          <div>
            <strong>Accent Color</strong>

            <p>Personalize the primary application color.</p>
          </div>

          <button className="settings-button">
            <MdPalette />
            Customize
          </button>
        </div>
      </section>

      <section className="settings-card">
        <div className="settings-card-title">
          <MdNotifications />

          <h2>Notifications</h2>
        </div>

        <div className="settings-option">
          <div>
            <strong>Email Notifications</strong>

            <p>Receive updates directly in your inbox.</p>
          </div>

          <label className="switch">
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={() => setEmailNotifications(!emailNotifications)}
            />

            <span className="slider"></span>
          </label>
        </div>

        <div className="settings-option">
          <div>
            <strong>Task Reminders</strong>

            <p>Notify me when deadlines are approaching.</p>
          </div>

          <label className="switch">
            <input
              type="checkbox"
              checked={taskNotifications}
              onChange={() => setTaskNotifications(!taskNotifications)}
            />

            <span className="slider"></span>
          </label>
        </div>

        <div className="settings-option">
          <div>
            <strong>Weekly Productivity Report</strong>

            <p>Receive a summary every week.</p>
          </div>

          <label className="switch">
            <input
              type="checkbox"
              checked={weeklyReport}
              onChange={() => setWeeklyReport(!weeklyReport)}
            />

            <span className="slider"></span>
          </label>
        </div>
      </section>

      <section className="settings-card">
        <div className="settings-card-title">
          <MdSecurity />

          <h2>Security</h2>
        </div>

        <div className="settings-option">
          <div>
            <strong>Password</strong>

            <p>Change your account password.</p>
          </div>

          <button className="settings-button">Change Password</button>
        </div>

        <div className="settings-option">
          <div>
            <strong>Two-Factor Authentication</strong>

            <p>Add an extra layer of security to your account.</p>
          </div>

          <button className="settings-button">Enable</button>
        </div>
      </section>

      <section className="settings-card">
        <div className="settings-card-title">
          <MdStorage />

          <h2>Workspace</h2>
        </div>

        <div className="settings-option">
          <div>
            <strong>Export Data</strong>

            <p>Download your projects and tasks.</p>
          </div>

          <button className="settings-button">Export</button>
        </div>

        <div className="settings-option">
          <div>
            <strong>Clear Cache</strong>

            <p>Remove temporary application data.</p>
          </div>

          <button className="settings-button">Clear</button>
        </div>
      </section>

      <section className="settings-card danger-zone">
        <div className="settings-card-title">
          <MdLogout />

          <h2>Account</h2>
        </div>

        <p className="danger-description">
          Logging out will end your current session on this device.
        </p>

        <button className="logout-button" onClick={handleLogout}>
          <MdLogout />
          Logout
        </button>
      </section>
    </main>
  );
}

export default Settings;
