import './ProfileModal.css';

import { useEffect, useState } from 'react';

import {
  getProfile,
  updateProfile,
  AVATARS,
  type Avatar,
} from '../../services/profile.service';

import { getCountryCode, countries } from '../../utils/countries';

import { availableRoles } from '../../utils/roles';

import Avatar1 from '../../assets/avatars/avatar-1.jpg';
import Avatar2 from '../../assets/avatars/avatar-2.jpg';
import Avatar3 from '../../assets/avatars/avatar-3.jpeg';
import Avatar4 from '../../assets/avatars/avatar-4.jpeg';
import DefaultAvatar from '../../assets/avatars/default-avatar.svg';

import { notifyProfileUpdated } from '../../utils/profileEvents';

interface ProfileModalProps {
  onClose: () => void;
  onUpdated: () => void | Promise<void>;
}

function ProfileModal({ onClose, onUpdated }: ProfileModalProps) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [name, setName] = useState(user.name || '');
  const [username, setUsername] = useState(user.username || '');
  const [email, setEmail] = useState(user.email || '');
  const [role, setRole] = useState('');
  const [country, setCountry] = useState('');
  const [avatar, setAvatar] = useState<Avatar | null>(null);

  const [loading, setLoading] = useState(false);

  const country_code = getCountryCode(country);

  // ==========================
  // AVATAR IMAGES
  // ==========================

  const avatarImages: Record<Avatar, string> = {
    'avatar-1': Avatar1,
    'avatar-2': Avatar2,
    'avatar-3': Avatar3,
    'avatar-4': Avatar4,
  };

  // ==========================
  // LOAD PROFILE
  // ==========================

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getProfile();

        setName(profile.name ?? '');
        setUsername(profile.username ?? '');
        setEmail(profile.email ?? '');
        setRole(profile.role ?? '');
        setCountry(profile.country ?? '');
        setAvatar(profile.avatar);
      } catch (error) {
        console.error('ERROR LOADING PROFILE:', error);
      }
    }

    loadProfile();
  }, []);

  // ==========================
  // SAVE PROFILE
  // ==========================

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    if (loading) {
      return;
    }

    // ==========================
    // VALIDATION
    // ==========================

    const trimmedName = name.trim();
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      alert('Name is required.');
      return;
    }

    if (!trimmedUsername) {
      alert('Username is required.');
      return;
    }

    if (!trimmedEmail) {
      alert('Email is required.');
      return;
    }

    try {
      setLoading(true);

      // ==========================
      // UPDATE PROFILE API
      // ==========================

      const response = await updateProfile({
        name: trimmedName,
        username: trimmedUsername,
        email: trimmedEmail,
        role,
        country,
        country_code,
        bio: '',
        avatar,
      });

      console.log('PROFILE UPDATED:', response);

      // ==========================
      // UPDATE LOCAL STORAGE
      // ==========================

      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

      const updatedUser = {
        ...currentUser,
        ...response,
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));

      localStorage.setItem('userName', response.name);

      // ==========================
      // UPDATE NAVBAR
      // ==========================

      notifyProfileUpdated();

      // ==========================
      // UPDATE PROFILE PAGE
      // ==========================

      await onUpdated();

      // ==========================
      // CLOSE MODAL
      // ==========================

      onClose();
    } catch (error) {
      console.error('UPDATE PROFILE ERROR:', error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Failed to update profile.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="profile-modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}>
      <div className="profile-modal">
        {/* ==========================
            HEADER
        ========================== */}

        <div className="profile-modal-header">
          <h2>Edit Profile</h2>

          <button
            type="button"
            className="profile-modal-close"
            onClick={onClose}
            disabled={loading}
            aria-label="Close modal">
            ×
          </button>
        </div>

        {/* ==========================
            FORM
        ========================== */}

        <form onSubmit={handleSave}>
          {/* NAME */}

          <div className="form-group">
            <label htmlFor="profile-name">Name</label>

            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {/* USERNAME */}

          <div className="form-group">
            <label htmlFor="profile-username">Username</label>

            <input
              id="profile-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {/* EMAIL */}

          <div className="form-group">
            <label htmlFor="profile-email">Email</label>

            <input
              id="profile-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {/* ROLE */}

          <div className="form-group">
            <label htmlFor="profile-role">Role</label>

            <select
              id="profile-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}>
              <option value="">Select a role...</option>

              {availableRoles.map((availableRole) => (
                <option key={availableRole} value={availableRole}>
                  {availableRole}
                </option>
              ))}
            </select>
          </div>

          {/* COUNTRY */}

          <div className="form-group">
            <label htmlFor="profile-country">Country</label>

            <select
              id="profile-country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              disabled={loading}>
              <option value="">Select a country...</option>

              {countries.map((countryOption) => (
                <option key={countryOption.code} value={countryOption.name}>
                  {countryOption.name}
                </option>
              ))}
            </select>

            {country_code && (
              <div className="country-preview">
                <img
                  src={`https://flagcdn.com/w40/${country_code.toLowerCase()}.png`}
                  alt={country}
                />
              </div>
            )}
          </div>

          {/* ==========================
              AVATAR
          ========================== */}

          <div className="form-group avatar-form-group">
            <label>Choose Avatar</label>

            <div className="avatar-grid">
              {/* DEFAULT AVATAR */}

              <button
                type="button"
                className={`avatar-option ${avatar === null ? 'selected' : ''}`}
                onClick={() => setAvatar(null)}
                disabled={loading}
                aria-label="Use default avatar"
                aria-pressed={avatar === null}>
                <img src={DefaultAvatar} alt="Default avatar" />
              </button>

              {/* AVAILABLE AVATARS */}

              {AVATARS.map((avatarOption) => (
                <button
                  key={avatarOption}
                  type="button"
                  className={`avatar-option ${
                    avatar === avatarOption ? 'selected' : ''
                  }`}
                  onClick={() => setAvatar(avatarOption)}
                  disabled={loading}
                  aria-label={`Select ${avatarOption}`}
                  aria-pressed={avatar === avatarOption}>
                  <img src={avatarImages[avatarOption]} alt={avatarOption} />
                </button>
              ))}
            </div>
          </div>

          {/* ==========================
              ACTIONS
          ========================== */}

          <div className="profile-modal-actions">
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>

            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileModal;
