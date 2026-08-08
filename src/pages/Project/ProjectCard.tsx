import './ProjectCard.css';

import { useState } from 'react';

import {
  MdFolder,
  MdMoreVert,
  MdCheckCircle,
  MdSchedule,
  MdEdit,
  MdDelete,
} from 'react-icons/md';

import type { Project } from '../../types/project';

interface ProjectCardProps {
  project: Project;

  onEdit: (project: Project) => void;

  onDelete: (projectId: number) => void;
}

function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const priority = project.priority ?? 'Medium';

  return (
    <div className="project-card">
      {/* ==========================
          HEADER
      ========================== */}

      <div className="project-top">
        <div className="project-title">
          <div
            className="project-icon"
            style={{
              backgroundColor: project.color || '#3B82F6',
            }}>
            <MdFolder />
          </div>

          <h3>{project.title}</h3>
        </div>

        {/* ==========================
            PROJECT MENU
        ========================== */}

        <div className="project-menu-wrapper">
          <button
            type="button"
            className="project-menu"
            aria-label="Project options"
            onClick={() => setMenuOpen((previous) => !previous)}>
            <MdMoreVert />
          </button>

          {menuOpen && (
            <div className="project-menu-dropdown">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onEdit(project);
                }}>
                <MdEdit />
                <span>Edit</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(project.id);
                }}>
                <MdDelete />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ==========================
          PRIORITY
      ========================== */}

      <span className={`project-priority ${priority.toLowerCase()}`}>
        {priority}
      </span>

      {/* ==========================
          DESCRIPTION
      ========================== */}

      <p className="project-description">
        {project.description || 'No description available.'}
      </p>

      {/* ==========================
          PROGRESS
      ========================== */}

      <div className="project-progress">
        <div className="progress-header">
          <span>Progress</span>

          <span>{project.progress ?? 0}%</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${project.progress ?? 0}%`,
            }}
          />
        </div>
      </div>

      {/* ==========================
          FOOTER
      ========================== */}

      <div className="project-footer">
        <div className="project-info">
          <MdCheckCircle />

          <span>{project.tasks ?? 0} Tasks</span>
        </div>

        <div className="project-info">
          <MdSchedule />

          <span>
            {project.updated ||
              (project.updated_at
                ? new Date(project.updated_at).toLocaleDateString()
                : 'Recently')}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
