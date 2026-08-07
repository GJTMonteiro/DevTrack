import './ProjectCard.css';

import type { Project } from '../../types/project';

import { MdFolder, MdSchedule, MdCircle, MdEdit } from 'react-icons/md';

interface ProjectCardProps {
  project: Project;

  onEdit?: (project: Project) => void;
}

function ProjectCard({ project, onEdit }: ProjectCardProps) {
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
      <div
        className="project-icon"
        style={{
          backgroundColor: project.color || '#3B82F6',
        }}>
        <MdFolder />
      </div>

      <div className="project-info">
        <h3>{project.title}</h3>

        <p>{project.description || 'No description available.'}</p>
      </div>

      <div className="project-meta">
        <span
          className={`priority-badge ${(
            project.priority || 'medium'
          ).toLowerCase()}`}>
          {formatPriority(project.priority)}
        </span>

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

        {onEdit && (
          <button
            type="button"
            className="project-edit-btn"
            onClick={() => onEdit(project)}>
            <MdEdit />
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

export default ProjectCard;
