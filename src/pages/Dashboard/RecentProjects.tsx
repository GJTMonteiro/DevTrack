import ProjectCard from '../Project/ProjectCard';

import './RecentProjects.css';

import type { Project } from '../../types/project';

interface RecentProjectsProps {
  projects: Project[];
}

function RecentProjects({ projects }: RecentProjectsProps) {
  return (
    <section className="recent-projects">
      <div className="recent-projects-header">
        <h2>Recent Projects</h2>

        <button className="project-viewall-btn">View All</button>
      </div>

      <div className="recent-projects-grid">
        {projects.slice(0, 3).map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}

export default RecentProjects;
