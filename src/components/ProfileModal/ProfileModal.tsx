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

interface ProfileModalProps {
  onClose: () => void;
}

function ProfileModal({ onClose }: ProfileModalProps) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [name, setName] = useState(user.name || '');
  const [username, setUsername] = useState(user.username || '');
  const [email, setEmail] = useState(user.email || '');
  const [role, setRole] = useState('');
  const [country, setCountry] = useState('');
  const [avatar, setAvatar] = useState<Avatar | null>(null);
  const [loading, setLoading] = useState(false);

  const country_code = getCountryCode(country);

  const avatarImages: Record<Avatar, string> = {
    'avatar-1': Avatar1,
    'avatar-2': Avatar2,
    'avatar-3': Avatar3,
    'avatar-4': Avatar4,
  };

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
        console.error('Error loading profile:', error);
      }
    }

    loadProfile();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await updateProfile({
        name,
        username,
        email,
        role,
        country,
        country_code,
        bio: '',
        avatar,
      });

      console.log('Resposta da API:', response);

      localStorage.setItem('user', JSON.stringify(response));

      localStorage.setItem('userName', response.name);

      onClose();

      window.location.reload();
    } catch (error) {
      console.error('UPDATE PROFILE ERROR:', error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Unknown error');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal">
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

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>Name</label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Username</label>

            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Role</label>

            <select
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

          <div className="form-group">
            <label>Country</label>

            <select
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

              {/* AVATARS */}
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
