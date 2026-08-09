import './ChagePasswordModal.css';

import { useState } from 'react';

import { changePassword } from '../../services/profile.service';

interface ChangePasswordModalProps {
  onClose: () => void;
}

function ChangePasswordModal({ onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (loading) {
      return;
    }

    setError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Your new password must contain at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (currentPassword === newPassword) {
      setError(
        'Your new password must be different from your current password.',
      );
      return;
    }

    try {
      setLoading(true);

      await changePassword(currentPassword, newPassword);

      alert('Password changed successfully.');

      onClose();
    } catch (error) {
      console.error('CHANGE PASSWORD ERROR:', error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to change password.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="change-password-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}>
      <div className="change-password-modal">
        {/* HEADER */}

        <div className="change-password-header">
          <h2>Change Password</h2>

          <button
            type="button"
            className="change-password-close"
            onClick={onClose}
            disabled={loading}
            aria-label="Close">
            ×
          </button>
        </div>

        {/* FORM */}

        <form onSubmit={handleSubmit}>
          <div className="change-password-form-group">
            <label htmlFor="current-password">Current Password</label>

            <input
              id="current-password"
              type="password"
              placeholder="Enter your current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <div className="change-password-form-group">
            <label htmlFor="new-password">New Password</label>

            <input
              id="new-password"
              type="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          <div className="change-password-form-group">
            <label htmlFor="confirm-password">Confirm New Password</label>

            <input
              id="confirm-password"
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          {/* ERROR */}

          {error && <div className="change-password-error">{error}</div>}

          <p className="change-password-hint">
            Your new password must contain at least 8 characters.
          </p>

          {/* ACTIONS */}

          <div className="change-password-actions">
            <button
              type="button"
              className="change-password-cancel"
              onClick={onClose}
              disabled={loading}>
              Cancel
            </button>

            <button
              type="submit"
              className="change-password-submit"
              disabled={loading}>
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
