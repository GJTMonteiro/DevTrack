import './ProfileModal.css';

import { useEffect, useState } from 'react';

import { getProfile, updateProfile } from '../../services/profile.service';

import { getCountryCode, countries } from '../../utils/countries';

import { availableRoles } from '../../utils/roles';

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
  const [loading, setLoading] = useState(false);

  const country_code = getCountryCode(country);

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getProfile();

        setName(profile.name ?? '');
        setUsername(profile.username ?? '');
        setEmail(profile.email ?? '');
        setRole(profile.role ?? '');
        setCountry(profile.country ?? '');
      } catch (error) {
        console.error(error);
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
      });

      console.log('Resposta da API:', response);

      localStorage.setItem('user', JSON.stringify(response.profile));

      localStorage.setItem('userName', response.profile.name);

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
        <h2>Edit Profile</h2>

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>Name</label>

            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Username</label>

            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <div className="profile-modal-actions">
            <button type="button" onClick={onClose}>
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
