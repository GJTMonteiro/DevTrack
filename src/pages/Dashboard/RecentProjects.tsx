import ProjectCard from '../Project/ProjectCard';
import './RecentProjects.css';

const recentProjects = [
  {
    id: 1,
    title: 'DevTrack',
    description: 'Developer productivity platform.',
    progress: 78,
    tasks: 24,
    priority: 'High',
    updated: '2 Aug 2026',
  },
  {
    id: 2,
    title: 'Portfolio',
    description: 'Personal portfolio website.',
    progress: 100,
    tasks: 18,
    priority: 'Low',
    updated: '31 Jul 2026',
  },
  {
    id: 3,
    title: 'Coffee Shop',
    description: 'React coffee shop website.',
    progress: 62,
    tasks: 15,
    priority: 'Medium',
    updated: '28 Jul 2026',
  },
];

function RecentProjects() {
  return (
    <section className="recent-projects-section">
      <div className="recent-projects">
        <div className="recent-projects-header">
          <h2 className="recent-projects-title">Recent Projects</h2>

          <button className="project-viewall-btn">View All</button>
        </div>

        {recentProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}

export default RecentProjects;
