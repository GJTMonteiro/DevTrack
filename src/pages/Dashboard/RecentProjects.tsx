import { useNavigate } from 'react-router-dom';

import ProjectCard from '../Project/ProjectCard';

import './RecentProjects.css';

import type { Project } from '../../types/project';

interface RecentProjectsProps {
  projects: Project[];
  loading: boolean;
}

function RecentProjects({ projects, loading }: RecentProjectsProps) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <section className="recent-projects-card">
        <div className="recent-projects-header">
          <h2>Recent Projects</h2>

          <button
            type="button"
            className="project-viewall-btn"
            onClick={() => navigate('/projects')}>
            View All
          </button>
        </div>

        <p className="recent-projects-message">Loading projects...</p>
      </section>
    );
  }

  return (
    <section className="recent-projects-card">
      <div className="recent-projects-header">
        <h2>Recent Projects</h2>

        <button
          type="button"
          className="project-viewall-btn"
          onClick={() => navigate('/projects')}>
          View All
        </button>
      </div>

      {!projects.length ? (
        <p className="recent-projects-message">No projects yet.</p>
      ) : (
        <div className="recent-projects-grid">
          {projects.slice(0, 3).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}

export default RecentProjects;
