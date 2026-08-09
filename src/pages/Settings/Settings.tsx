import './Settings.css';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getProfile, type ProfileData } from '../../services/profile.service';

import {
  getSettings,
  updateSettings,
  type SettingsData,
} from '../../services/settings.service';

import { useTheme } from '../../components/context/ThemeContext';

import {
  MdPerson,
  MdDarkMode,
  MdNotifications,
  MdSecurity,
  MdLogout,
  MdLock,
  MdClose,
} from 'react-icons/md';

function Settings() {
  const navigate = useNavigate();

  const { theme, toggleTheme } = useTheme();

  const [profile, setProfile] = useState<ProfileData | null>(null);

  // NOTIFICATIONS
  const [settings, setSettings] = useState<SettingsData>({
    project_created_notifications: true,
    project_updated_notifications: true,
    project_deleted_notifications: true,
  });

  const [settingsLoading, setSettingsLoading] = useState(false);

  // CHANGE PASSWORD
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // LOAD PROFILE + SETTINGS
  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getProfile();

        setProfile(data);
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    }

    async function loadSettings() {
      try {
        const data = await getSettings();

        setSettings(data);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }

    loadProfile();
    loadSettings();
  }, []);

  // LOGOUT
  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('username');
    localStorage.removeItem('user');

    sessionStorage.removeItem('token');

    navigate('/login', {
      replace: true,
    });
  }

  // OPEN PASSWORD MODAL
  function handleOpenPasswordModal() {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    setPasswordError('');
    setPasswordSuccess('');

    setShowPasswordModal(true);
  }

  // CLOSE PASSWORD MODAL
  function handleClosePasswordModal() {
    if (passwordLoading) {
      return;
    }

    setShowPasswordModal(false);

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    setPasswordError('');
    setPasswordSuccess('');
  }

  // CHANGE PASSWORD
  async function handleChangePassword(event: React.FormEvent) {
    event.preventDefault();

    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all fields.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('The new password must contain at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('The new passwords do not match.');
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError(
        'The new password must be different from the current password.',
      );
      return;
    }

    try {
      setPasswordLoading(true);

      const token = localStorage.getItem('token');

      const response = await fetch(
        'http://localhost:3000/api/profile/password',
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json',

            ...(token && {
              Authorization: `Bearer ${token}`,
            }),
          },

          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password.');
      }

      setPasswordSuccess('Password changed successfully.');

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess('');
      }, 1500);
    } catch (error) {
      console.error('CHANGE PASSWORD ERROR:', error);

      if (error instanceof Error) {
        setPasswordError(error.message);
      } else {
        setPasswordError('Something went wrong.');
      }
    } finally {
      setPasswordLoading(false);
    }
  }

  // UPDATE NOTIFICATION SETTING
  async function handleNotificationChange(setting: keyof SettingsData) {
    const previousSettings = settings;

    const updatedSettings: SettingsData = {
      ...settings,
      [setting]: !settings[setting],
    };

    // Atualização imediata no UI
    setSettings(updatedSettings);

    try {
      setSettingsLoading(true);

      const data = await updateSettings(updatedSettings);

      setSettings(data);
    } catch (error) {
      console.error('UPDATE SETTINGS ERROR:', error);

      // Reverter se a API falhar
      setSettings(previousSettings);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Failed to update settings.');
      }
    } finally {
      setSettingsLoading(false);
    }
  }

  const fullName = profile?.name || 'Developer';
  const username = profile?.username || 'developer';
  const email = profile?.email || '';
  const role = profile?.role || 'Developer';

  return (
    <main className="settings-content">
      {/* HEADER */}

      <section className="settings-header">
        <div>
          <h1>Settings</h1>

          <p>Manage your account, preferences and workspace.</p>
        </div>
      </section>

      {/* PROFILE */}

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

            <input type="email" value={email} readOnly />
          </div>

          <div className="settings-group">
            <label>Role</label>

            <input type="text" value={role} readOnly />
          </div>
        </div>
      </section>

      {/* APPEARANCE */}

      <section className="settings-card">
        <div className="settings-card-title">
          <MdDarkMode />

          <h2>Appearance</h2>
        </div>

        <div className="settings-option">
          <div className="settings-option-info">
            <div>
              <strong>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</strong>

              <p>
                {theme === 'dark'
                  ? 'Dark theme is currently active.'
                  : 'Light theme is currently active.'}
              </p>
            </div>

            <label className="switch">
              <input
                type="checkbox"
                checked={theme === 'dark'}
                onChange={toggleTheme}
              />

              <span className="slider"></span>
            </label>
          </div>
        </div>
      </section>

      {/* NOTIFICATIONS */}

      <section className="settings-card">
        <div className="settings-card-title">
          <MdNotifications />

          <h2>Notifications</h2>
        </div>

        {/* PROJECT CREATED */}

        <div className="settings-option">
          <div>
            <strong>Project Created</strong>

            <p>Notify me when a new project is created.</p>
          </div>

          <label className="switch">
            <input
              type="checkbox"
              checked={settings.project_created_notifications}
              onChange={() =>
                handleNotificationChange('project_created_notifications')
              }
              disabled={settingsLoading}
            />

            <span className="slider"></span>
          </label>
        </div>

        {/* PROJECT UPDATED */}

        <div className="settings-option">
          <div>
            <strong>Project Updated</strong>

            <p>Notify me when a project is updated.</p>
          </div>

          <label className="switch">
            <input
              type="checkbox"
              checked={settings.project_updated_notifications}
              onChange={() =>
                handleNotificationChange('project_updated_notifications')
              }
              disabled={settingsLoading}
            />

            <span className="slider"></span>
          </label>
        </div>

        {/* PROJECT DELETED */}

        <div className="settings-option">
          <div>
            <strong>Project Deleted</strong>

            <p>Notify me when a project is deleted.</p>
          </div>

          <label className="switch">
            <input
              type="checkbox"
              checked={settings.project_deleted_notifications}
              onChange={() =>
                handleNotificationChange('project_deleted_notifications')
              }
              disabled={settingsLoading}
            />

            <span className="slider"></span>
          </label>
        </div>
      </section>

      {/* SECURITY */}

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

          <button
            type="button"
            className="settings-button"
            onClick={handleOpenPasswordModal}>
            Change Password
          </button>
        </div>

        <div className="settings-option">
          <div>
            <strong>Two-Factor Authentication</strong>

            <p>Add an extra layer of security to your account.</p>
          </div>

          <button type="button" className="settings-button">
            Enable
          </button>
        </div>
      </section>

      {/* ACCOUNT */}

      <section className="settings-card danger-zone">
        <div className="settings-card-title">
          <MdLogout />

          <h2>Account</h2>
        </div>

        <p className="danger-description">
          Logging out will end your current session on this device.
        </p>

        <button type="button" className="logout-button" onClick={handleLogout}>
          <MdLogout />
          Logout
        </button>
      </section>

      {/* CHANGE PASSWORD MODAL */}

      {showPasswordModal && (
        <div className="password-modal-overlay">
          <div
            className="password-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="password-modal-title">
            <div className="password-modal-header">
              <div className="password-modal-title">
                <MdLock />

                <h2 id="password-modal-title">Change Password</h2>
              </div>

              <button
                type="button"
                className="password-modal-close"
                onClick={handleClosePasswordModal}
                disabled={passwordLoading}
                aria-label="Close">
                <MdClose />
              </button>
            </div>

            <p className="password-modal-description">
              Enter your current password and choose a new password for your
              account.
            </p>

            <form onSubmit={handleChangePassword}>
              {/* CURRENT PASSWORD */}

              <div className="settings-group">
                <label htmlFor="current-password">Current Password</label>

                <input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  disabled={passwordLoading}
                  autoComplete="current-password"
                />
              </div>

              {/* NEW PASSWORD */}

              <div className="settings-group">
                <label htmlFor="new-password">New Password</label>

                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  disabled={passwordLoading}
                  autoComplete="new-password"
                />
              </div>

              {/* CONFIRM PASSWORD */}

              <div className="settings-group">
                <label htmlFor="confirm-password">Confirm New Password</label>

                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  disabled={passwordLoading}
                  autoComplete="new-password"
                />
              </div>

              {/* ERROR */}

              {passwordError && (
                <p className="password-message password-error">
                  {passwordError}
                </p>
              )}

              {/* SUCCESS */}

              {passwordSuccess && (
                <p className="password-message password-success">
                  {passwordSuccess}
                </p>
              )}

              {/* ACTIONS */}

              <div className="password-modal-actions">
                <button
                  type="button"
                  className="password-cancel-button"
                  onClick={handleClosePasswordModal}
                  disabled={passwordLoading}>
                  Cancel
                </button>

                <button
                  type="submit"
                  className="settings-button"
                  disabled={passwordLoading}>
                  {passwordLoading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default Settings;
