import { useNavigate } from 'react-router-dom';

import StatCard from '../Dashboard/StatCard';

import Avatar from '../../assets/stussy-night.jpeg';

import './Profile.css';

import ReactCountryFlag from 'react-country-flag';

import {
  MdFolderOpen,
  MdTaskAlt,
  MdCheckCircle,
  MdTrendingUp,
} from 'react-icons/md';

import { useEffect, useState } from 'react';

import { getProjects } from '../../services/project.service';

import type { Project } from '../../types/project';

const user = {
  name: localStorage.getItem('userName') ?? 'Developer',

  role: 'Front & Back Developer',

  email: 'xxxxxxxxx@gmail.com',

  location: {
    name: 'Japan',

    code: 'JP',
  },

  skills: ['React', 'TypeScript', 'Git', 'Node.js', 'Express'],

  activity: [
    'Created DevTrack',
    'Completed 8 tasks',
    'Updated profile',
    'Joined workspace',
  ],

  actions: [
    { label: 'Edit Profile', action: 'edit' },

    { label: 'Change Password', action: 'password' },

    { label: 'Security', action: 'security' },

    { label: 'Notifications', action: 'notifications' },

    { label: 'Logout', action: 'logout' },
  ],
};

const details = [
  {
    label: 'Username',
    value: 'GJTMonteiro',
  },

  {
    label: 'Country',
    value: user.location.name,
  },

  {
    label: 'Member Since',
    value: 'August 2026',
  },
];

function Profile() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await getProjects();

        setProjects(data.projects);
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    }

    loadProjects();
  }, []);

  function handleEditProfile() {
    console.log('Edit Profile');
  }

  function handleLogout() {
    localStorage.removeItem('token');

    localStorage.removeItem('userName');

    sessionStorage.removeItem('token');

    navigate('/login');
  }

  return (
    <section className="profile-content">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={Avatar} alt="Profile avatar" />
        </div>

        <div className="profile-info">
          <h1 className="profile-name">
            <ReactCountryFlag
              countryCode={user.location.code}
              svg
              title={user.location.name}
              className="country-flag"
            />

            <span>{user.name}</span>
          </h1>

          <p className="profile-role">{user.role}</p>

          <p className="profile-email">{user.email}</p>
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

      <div className="profile-skills">
        <h2>Skills</h2>

        <div className="skills-list">
          {user.skills.map((skill) => (
            <span className="skill-badge" key={skill}>
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="profile-activity">
        <h2>Recent Activity</h2>

        <ul>
          {user.activity.map((activity) => (
            <li key={activity}>{activity}</li>
          ))}
        </ul>
      </div>

      <div className="profile-actions">
        <h2>Account</h2>

        <ul>
          {user.actions.map((action) => (
            <li key={action.action}>
              <button
                type="button"
                onClick={() => {
                  if (action.action === 'logout') {
                    handleLogout();
                  }
                }}>
                {action.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Profile;
