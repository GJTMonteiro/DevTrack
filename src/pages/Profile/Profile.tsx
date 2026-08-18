import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import './Profile.css';

import ProfileModal from '../../components/ProfileModal/ProfileModal';
import ChangePasswordModal from '../../components/ChangePasswordModal/ChangePasswordModal';

import { getAvatar } from '../../utils/avatars';

import ReactCountryFlag from 'react-country-flag';

import {
  MdFolderOpen,
  MdTaskAlt,
  MdCheckCircle,
  MdTrendingUp,
  MdCreateNewFolder,
  MdEdit,
  MdDelete,
} from 'react-icons/md';

import StatCard from '../Dashboard/StatCard';

import { getProjects } from '../../services/project.service';

import { getProfile, type ProfileData } from '../../services/profile.service';

import apiFetch from '../../services/api';

import type { Project } from '../../types/project';

import Skills from '../../components/Skills/Skills';

// ============================================================
// ACTIVITY TYPE
// ============================================================

interface Activity {
  id: number;
  type: string;
  title: string;
  description: string;
  created_at: string;
}

// ============================================================
// PROFILE
// ============================================================

function Profile() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);

  const [profile, setProfile] = useState<ProfileData | null>(null);

  const [activities, setActivities] = useState<Activity[]>([]);

  const [showProfileModal, setShowProfileModal] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // ============================================================
  // LOAD PROFILE + PROJECTS + ACTIVITIES
  // ============================================================

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

    async function loadActivities() {
      try {
        const data = await apiFetch('/activities');

        setActivities(data.activities);
      } catch (error) {
        console.error('Error loading activities:', error);
      }
    }

    loadProfile();
    loadProjects();
    loadActivities();
  }, []);

  // ============================================================
  // EDIT PROFILE
  // ============================================================

  function handleEditProfile() {
    setShowProfileModal(true);
  }

  // ============================================================
  // PROFILE UPDATED
  // ============================================================

  async function handleProfileUpdated() {
    try {
      const data = await getProfile();

      setProfile(data);
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  }

  // ============================================================
  // CHANGE PASSWORD
  // ============================================================

  function handleChangePassword() {
    setShowPasswordModal(true);
  }

  // ============================================================
  // NOTIFICATIONS
  // ============================================================

  function handleNotifications() {
    navigate('/settings');
  }

  // ============================================================
  // LOGOUT
  // ============================================================

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userName');

    sessionStorage.removeItem('token');

    navigate('/login', {
      replace: true,
    });
  }

  // ============================================================
  // FORMAT ACTIVITY TIME
  // ============================================================

  function formatActivityTime(date: string) {
    const activityDate = new Date(date);
    const now = new Date();

    const difference = now.getTime() - activityDate.getTime();

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return 'Just now';
    }

    if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }

    if (hours < 24) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }

    if (days === 1) {
      return 'Yesterday';
    }

    if (days < 7) {
      return `${days} days ago`;
    }

    return activityDate.toLocaleDateString();
  }

  // ============================================================
  // ACTIVITY ICON
  // ============================================================

  function getActivityIcon(type: string) {
    switch (type) {
      case 'project_created':
      case 'task_created':
        return <MdCreateNewFolder />;

      case 'project_updated':
      case 'task_updated':
        return <MdEdit />;

      case 'project_deleted':
      case 'task_deleted':
        return <MdDelete />;

      default:
        return <MdCheckCircle />;
    }
  }

  // ============================================================
  // LOADING
  // ============================================================

  if (!profile) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  // ============================================================
  // PROFILE DETAILS
  // ============================================================

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

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <section className="profile-content">
      {/* ==========================
          PROFILE HEADER
      ========================== */}

      <div className="profile-header">
        <img
          src={getAvatar(profile.avatar)}
          alt={`${profile.name}'s avatar`}
          className="profile-avatar"
        />

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

      {/* ==========================
          PROFILE DETAILS
      ========================== */}

      <div className="profile-details">
        <h2>Profile Details</h2>

        {details.map((detail) => (
          <div className="profile-detail" key={detail.label}>
            <span>{detail.label}</span>

            <strong>{detail.value}</strong>
          </div>
        ))}
      </div>

      {/* ==========================
          PROFILE STATS
      ========================== */}

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

      {/* ==========================
          SKILLS
      ========================== */}

      <Skills />

      {/* ==========================
          RECENT ACTIVITY
      ========================== */}

      <div className="profile-activity">
        <h2>Recent Activity</h2>

        {activities.length === 0 ? (
          <div className="profile-activity-empty">
            <MdCheckCircle />

            <p>No recent activity yet.</p>
          </div>
        ) : (
          <ul>
            {activities.map((activity) => (
              <li key={activity.id}>
                <div className="activity-icon">
                  {getActivityIcon(activity.type)}
                </div>

                <div className="activity-content">
                  <strong>{activity.title}</strong>

                  <p>{activity.description}</p>

                  <span>{formatActivityTime(activity.created_at)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ==========================
          ACCOUNT ACTIONS
      ========================== */}

      <div className="profile-actions">
        <h2>Account</h2>

        <ul>
          <li>
            <button type="button" onClick={handleEditProfile}>
              Edit Profile
            </button>
          </li>

          <li>
            <button type="button" onClick={handleChangePassword}>
              Change Password
            </button>
          </li>

          <li>
            <button type="button" onClick={handleNotifications}>
              Notifications
            </button>
          </li>

          <li>
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* ==========================
          EDIT PROFILE MODAL
      ========================== */}

      {showProfileModal && (
        <ProfileModal
          onClose={() => setShowProfileModal(false)}
          onUpdated={handleProfileUpdated}
        />
      )}

      {/* ==========================
          CHANGE PASSWORD MODAL
      ========================== */}

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </section>
  );
}

export default Profile;
