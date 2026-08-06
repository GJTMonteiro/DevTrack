import './Dashboard.css';

import { useEffect, useState } from 'react';

import StatCard from './StatCard';
import RecentProjects from './RecentProjects';
import RecentTasks from './RecentTasks';

import {
  MdFolderOpen,
  MdTaskAlt,
  MdCheckCircle,
  MdTrendingUp,
} from 'react-icons/md';

import type { Project } from '../../types/project';

import { getProjects } from '../../services/project.service';

function Dashboard() {
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);

  const currentDate = new Date();

  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',

    year: 'numeric',

    month: 'long',

    day: 'numeric',
  });

  const currentHour = currentDate.getHours();

  let greeting = '';

  if (currentHour < 12) {
    greeting = 'Good Morning';
  } else if (currentHour < 18) {
    greeting = 'Good Afternoon';
  } else {
    greeting = 'Good Evening';
  }

  const userName = localStorage.getItem('userName') ?? 'Developer';

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await getProjects();

        setRecentProjects(data.projects);
      } catch (error) {
        console.error('Error loading dashboard projects:', error);
      }
    }

    loadProjects();
  }, []);

  return (
    <main className="dashboard">
      <section className="dashboard-welcome">
        <div className="welcome-content">
          <h1>
            {greeting}, {userName}
          </h1>

          <p>Overview of your work</p>

          <span>{formattedDate}</span>
        </div>

        <div className="welcome-actions">
          <button className="new-project-btn">+ New Project</button>
        </div>
      </section>

      <section className="dashboard-stats">
        <StatCard
          icon={<MdFolderOpen />}
          title="Projects"
          value={recentProjects.length}
          description="Total projects"
        />

        <StatCard
          icon={<MdTaskAlt />}
          title="Active Tasks"
          value={0}
          description="Tasks pending"
        />

        <StatCard
          icon={<MdCheckCircle />}
          title="Completed"
          value={0}
          description="Completed tasks"
        />

        <StatCard
          icon={<MdTrendingUp />}
          title="Productivity"
          value={0}
          description="This month"
        />
      </section>

      <section className="dashboard-recent-projects">
        <RecentProjects projects={recentProjects} />
      </section>

      <section className="dashboard-recent-tasks">
        <RecentTasks />
      </section>

      <section className="dashboard-timeline"></section>
    </main>
  );
}

export default Dashboard;
