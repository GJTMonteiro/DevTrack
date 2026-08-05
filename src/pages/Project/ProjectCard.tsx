import './ProjectCard.css';

import { MdFolder, MdCheckCircle, MdSchedule } from 'react-icons/md';

interface Project {
  id: number;
  title: string;
  description: string;
  progress: number;
  tasks: number;
  priority: string;
  updated: string;
}

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="project-card">
      <div className="project-card-header">
        <div className="project-icon">
          <MdFolder />
        </div>

        <span className={`priority-badge ${project.priority.toLowerCase()}`}>
          {project.priority}
        </span>
      </div>

      <h3>{project.title}</h3>

      <p>{project.description}</p>

      <div className="project-progress">
        <div className="progress-top">
          <span>Progress</span>

          <span>{project.progress}%</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="project-footer">
        <div>
          <MdCheckCircle />

          <span>{project.tasks} Tasks</span>
        </div>

        <div>
          <MdSchedule />

          <span>{project.updated}</span>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
