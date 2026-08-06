import './ProjectCard.css';

import type { Project } from '../../types/project';

import { MdFolder, MdSchedule, MdCircle } from 'react-icons/md';

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  function formatStatus(status?: string) {
    if (!status) {
      return 'Planning';
    }

    switch (status.toLowerCase()) {
      case 'active':
        return 'Active';

      case 'completed':
        return 'Completed';

      case 'archived':
        return 'Archived';

      case 'planning':
        return 'Planning';

      default:
        return status;
    }
  }

  function formatPriority(priority?: string) {
    if (!priority) {
      return 'Medium';
    }

    return priority;
  }

  return (
    <div className="project-card">
      <div className="project-card-header">
        <div
          className="project-icon"
          style={{
            backgroundColor: project.color || '#3B82F6',
          }}>
          <MdFolder />
        </div>

        <span
          className={`priority-badge ${(
            project.priority || 'medium'
          ).toLowerCase()}`}>
          {formatPriority(project.priority)}
        </span>
      </div>

      <div className="project-info">
        <h3>{project.title}</h3>

        <p>{project.description || 'No description available.'}</p>
      </div>

      <div className="project-meta">
        <span
          className={`status-badge ${(
            project.status || 'planning'
          ).toLowerCase()}`}>
          <MdCircle />

          {formatStatus(project.status)}
        </span>
      </div>

      <div className="project-footer">
        <div>
          <MdSchedule />

          <span>
            Updated{' '}
            {project.updated_at
              ? new Date(project.updated_at).toLocaleDateString()
              : 'Recently'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
