import './Dashboard.css';

import StatCard from './StatCard';
import RecentProjects from './RecentProjects';
import RecentTasks from './RecentTasks';

import {
  MdFolderOpen,
  MdTaskAlt,
  MdCheckCircle,
  MdTrendingUp,
} from 'react-icons/md';

function Dashboard() {
  const currentDate = new Date();

  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const currentHour = currentDate.getHours();

  let greeting = "";

  if (currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour <18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  return (
     <main className="dashboard">   
      <section className="dashboard-welcome">
        <div className="welcome-info">
          <h1>{greeting}</h1>
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
          value={12}
          description="+2 this week"
        />
        <StatCard
          icon={<MdTaskAlt />}
          title="Active Tasks"
          value={34}
          description="8 due today"
        />
        <StatCard
          icon={<MdCheckCircle />}
          title="Completed"
          value={128}
          description="+15 this week"
        />
        <StatCard
          icon={<MdTrendingUp />}
          title="Productivity"
          value={92}
          description="+4 this month"
        />
      </section>
      <section className="dashboard-recent-projects">
        <RecentProjects />
      </section>
      <section className="dashboard-recent-tasks">
        <RecentTasks />
      </section>
      <section className="dashboard-timeline"></section>
    </main>
  );
}

export default Dashboard;
