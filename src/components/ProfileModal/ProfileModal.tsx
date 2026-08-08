import './ProfileModal.css';

import { useEffect, useState } from 'react';

import { getProfile, updateProfile } from '../../services/profile.service';

import { countries, getCountryCode } from '../../utils/country';

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

  const [countryOpen, setCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  const countryCode = getCountryCode(country);

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

  const filteredCountries = countries.filter((item) =>
    item.name.toLowerCase().includes(countrySearch.toLowerCase()),
  );

  function handleCountrySelect(countryName: string) {
    setCountry(countryName);

    setCountryOpen(false);

    setCountrySearch('');
  }

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
        country_code: countryCode,
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
    <div
      className="profile-modal-overlay"
      onClick={() => {
        if (countryOpen) {
          setCountryOpen(false);
        }
      }}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Profile</h2>

        <form onSubmit={handleSave}>
          {/* NAME */}

          <div className="form-group">
            <label>Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* USERNAME */}

          <div className="form-group">
            <label>Username</label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* EMAIL */}

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* ROLE */}

          <div className="form-group">
            <label>Role</label>

            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          {/* COUNTRY */}

          <div className="form-group country-field">
            <label>Country</label>

            <button
              type="button"
              className="country-select"
              onClick={() => setCountryOpen((previous) => !previous)}>
              <span className="country-selected">
                {countryCode ? (
                  <img
                    src={`https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`}
                    alt={country}
                  />
                ) : (
                  <span className="country-placeholder">Select a country</span>
                )}

                {countryCode && <span>{country}</span>}
              </span>

              <span className={`country-arrow ${countryOpen ? 'open' : ''}`}>
                ▼
              </span>
            </button>

            {countryOpen && (
              <div
                className="country-dropdown"
                onClick={(e) => e.stopPropagation()}>
                <div className="country-search">
                  <input
                    type="text"
                    placeholder="Search country..."
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="country-list">
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        className={`country-option ${
                          country === item.name ? 'selected' : ''
                        }`}
                        onClick={() => handleCountrySelect(item.name)}>
                        <img
                          src={`https://flagcdn.com/w40/${item.code.toLowerCase()}.png`}
                          alt={item.name}
                        />

                        <span>{item.name}</span>
                      </button>
                    ))
                  ) : (
                    <p className="country-no-results">No countries found.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ACTIONS */}

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
