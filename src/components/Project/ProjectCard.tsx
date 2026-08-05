import "./ProjectCard.css";

import {
  MdFolder,
  MdMoreVert,
  MdCheckCircle,
  MdSchedule,
} from "react-icons/md";

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

      <div className="project-top">

        <div className="project-title">

          <div className="project-icon">
            <MdFolder />
          </div>

          <h3>{project.title}</h3>

        </div>

        <button className="project-menu">
          <MdMoreVert />
        </button>

      </div>


      <span
        className={`project-priority ${project.priority.toLowerCase()}`}
      >
        {project.priority}
      </span>


      <p className="project-description">
        {project.description}
      </p>


      <div className="project-progress">

        <div className="progress-header">

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

        <div className="project-info">

          <MdCheckCircle />

          <span>{project.tasks} Tasks</span>

        </div>

        <div className="project-info">

          <MdSchedule />

          <span>{project.updated}</span>

        </div>

      </div>

    </div>
  );
}

export default ProjectCard;