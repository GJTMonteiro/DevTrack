import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import './Profile.css';

import ProfileModal from '../../components/ProfileModal/ProfileModal';

import { getAvatar } from '../../utils/avatars';

import ReactCountryFlag from 'react-country-flag';

import {
  MdFolderOpen,
  MdTaskAlt,
  MdCheckCircle,
  MdTrendingUp,
} from 'react-icons/md';

import StatCard from '../Dashboard/StatCard';

import { getProjects } from '../../services/project.service';

import { getProfile, type ProfileData } from '../../services/profile.service';

import type { Project } from '../../types/project';

import Skills from '../../components/Skills/Skills';

function Profile() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);

  const [profile, setProfile] = useState<ProfileData | null>(null);

  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getProfile();

        setProfile(data);
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    }

    async function loadProjects() {
      try {
        const data = await getProjects();

        setProjects(data.projects);
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    }

    loadProfile();

    loadProjects();
  }, []);

  function handleEditProfile() {
    console.log('EDIT CLICK');

    setShowProfileModal(true);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userName');

    sessionStorage.removeItem('token');

    navigate('/login', {
      replace: true,
    });
  }

  if (!profile) {
    return <div>Loading profile...</div>;
  }

  const details = [
    {
      label: 'Username',
      value: profile.username,
    },

    {
      label: 'Country',
      value: profile.country,
    },

    {
      label: 'Member Since',
      value: 'August 2026',
    },
  ];

  return (
    <section className="profile-content">
      <div className="profile-header">
        <div className="profile-avatar-wrapper">
          <img
            src={getAvatar(profile.avatar)}
            alt={`${profile.name}'s avatar`}
            className="profile-avatar"
          />
        </div>

        <div className="profile-info">
          <h1 className="profile-name">
            {profile.country_code && (
              <div className="country-flag-wrapper">
                <ReactCountryFlag
                  countryCode={profile.country_code}
                  svg
                  title={profile.country}
                  className="country-flag"
                />
              </div>
            )}

            <span>{profile.name}</span>
          </h1>

          <p className="profile-role">{profile.role}</p>

          <p className="profile-email">{profile.email}</p>
        </div>

        <button
          type="button"
          className="profile-edit-btn"
          onClick={handleEditProfile}>
          Edit Profile
        </button>
      </div>

      <div className="profile-details">
        <h2>Profile Details</h2>

        {details.map((detail) => (
          <div className="profile-detail" key={detail.label}>
            <span>{detail.label}</span>

            <strong>{detail.value}</strong>
          </div>
        ))}
      </div>

      <div className="profile-stats">
        <StatCard
          icon={<MdFolderOpen />}
          title="Projects"
          value={projects.length}
          description="Total Projects"
        />

        <StatCard
          icon={<MdTaskAlt />}
          title="Completed Tasks"
          value={0}
          description="All completed"
        />

        <StatCard
          icon={<MdCheckCircle />}
          title="Productivity"
          value={0}
          description="This month"
        />

        <StatCard
          icon={<MdTrendingUp />}
          title="Years Active"
          value={0}
          description="Since 2026"
        />
      </div>

      <Skills />

      <div className="profile-activity">
        <h2>Recent Activity</h2>

        <ul>
          <li>Created DevTrack</li>

          <li>Completed 8 tasks</li>

          <li>Updated profile</li>

          <li>Joined workspace</li>
        </ul>
      </div>

      <div className="profile-actions">
        <h2>Account</h2>

        <ul>
          <li>
            <button type="button" onClick={handleEditProfile}>
              Edit Profile
            </button>
          </li>

          <li>
            <button type="button">Change Password</button>
          </li>

          <li>
            <button type="button">Security</button>
          </li>

          <li>
            <button type="button">Notifications</button>
          </li>

          <li>
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>

      {showProfileModal && (
        <ProfileModal onClose={() => setShowProfileModal(false)} />
      )}
    </section>
  );
}

export default Profile;
