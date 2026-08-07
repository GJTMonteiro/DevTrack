import ProjectCard from '../Project/ProjectCard';

import './RecentProjects.css';

import type { Project } from '../../types/project';

interface RecentProjectsProps {
  projects: Project[];
  loading: boolean;
}

function RecentProjects({ projects, loading }: RecentProjectsProps) {
  if (loading) {
    return <p className="projects-message">Loading projects...</p>;
  }

  if (!projects.length) {
    return <p className="projects-message">No projects yet.</p>;
  }

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
