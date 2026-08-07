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

import { getProjects } from '../../services/project.service';
import { getTasks } from '../../services/task.service';

import type { Project } from '../../types/project';
import type { Task } from '../../types/task';

function Dashboard() {
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

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
    async function loadData() {
      try {
        const [projectsData, tasksData] = await Promise.all([
          getProjects(),
          getTasks(),
        ]);

        setRecentProjects(projectsData.projects);
        setTasks(tasksData.tasks);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      }
    }

    loadData();
  }, []);

  const activeTasks = tasks.filter(
    (task) => task.status !== 'Completed',
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === 'Completed',
  ).length;

  const productivity =
    tasks.length === 0 ? 0 : Math.round((completedTasks / tasks.length) * 100);

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
          value={activeTasks}
          description="Tasks pending"
        />

        <StatCard
          icon={<MdCheckCircle />}
          title="Completed"
          value={completedTasks}
          description="Completed tasks"
        />

        <StatCard
          icon={<MdTrendingUp />}
          title="Productivity"
          value={`${productivity}%`}
          description="Task completion"
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
