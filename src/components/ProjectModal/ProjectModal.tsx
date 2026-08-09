import './ProjectModal.css';

import { useEffect, useState } from 'react';

import { createProject, updateProject } from '../../services/project.service';

import type { Project } from '../../types/project';

interface ProjectModalProps {
  onClose: () => void;
  onCreated: () => void | Promise<void>;
  project?: Project | null;
}

function ProjectModal({ onClose, onCreated, project }: ProjectModalProps) {
  const isEditing = Boolean(project);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [status, setStatus] = useState('Planning');
  const [priority, setPriority] = useState('Medium');

  const [loading, setLoading] = useState(false);

  // =========================
  // LOAD PROJECT DATA
  // =========================

  useEffect(() => {
    if (project) {
      setTitle(project.title ?? '');
      setDescription(project.description ?? '');
      setColor(project.color ?? '#3B82F6');
      setStatus(project.status ?? 'Planning');
      setPriority(project.priority ?? 'Medium');
    } else {
      setTitle('');
      setDescription('');
      setColor('#3B82F6');
      setStatus('Planning');
      setPriority('Medium');
    }
  }, [project]);

  // =========================
  // SUBMIT
  // =========================

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (loading) {
      return;
    }

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      alert('Project title is required.');
      return;
    }

    try {
      setLoading(true);

      const projectData = {
        title: trimmedTitle,
        description: description.trim(),
        color,
        status,
        priority,
      };

      // =========================
      // UPDATE PROJECT
      // =========================

      if (isEditing && project) {
        await updateProject(Number(project.id), projectData);

        console.log('PROJECT UPDATED SUCCESSFULLY');

        // Atualizar lista de projetos
        await onCreated();
      }

      // =========================
      // CREATE PROJECT
      // =========================
      else {
        const response = await createProject(projectData);

        console.log('PROJECT CREATED SUCCESSFULLY:', response);

        // Atualizar lista de projetos
        await onCreated();
      }

      // =========================
      // CLOSE MODAL
      // =========================

      onClose();
    } catch (error) {
      console.error(
        isEditing ? 'UPDATE PROJECT ERROR:' : 'CREATE PROJECT ERROR:',
        error,
      );

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert(
          isEditing ? 'Failed to update project.' : 'Failed to create project.',
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="project-modal-overlay">
      <div className="project-modal">
        {/* =========================
            HEADER
        ========================= */}

        <div className="project-modal-header">
          <h2>{isEditing ? 'Edit Project' : 'Create New Project'}</h2>

          <button
            type="button"
            className="project-modal-close"
            onClick={onClose}
            disabled={loading}
            aria-label="Close">
            ×
          </button>
        </div>

        {/* =========================
            FORM
        ========================= */}

        <form onSubmit={handleSubmit}>
          {/* TITLE */}

          <div className="form-group">
            <label htmlFor="project-title">Project Title</label>

            <input
              id="project-title"
              type="text"
              placeholder="Project title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {/* DESCRIPTION */}

          <div className="form-group">
            <label htmlFor="project-description">Description</label>

            <textarea
              id="project-description"
              placeholder="Project description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* COLOR */}

          <div className="color-picker">
            <label htmlFor="project-color">Project Color</label>

            <input
              id="project-color"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* STATUS */}

          <div className="form-group">
            <label htmlFor="project-status">Status</label>

            <select
              id="project-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={loading}>
              <option value="Planning">Planning</option>

              <option value="Active">Active</option>

              <option value="Completed">Completed</option>

              <option value="Archived">Archived</option>
            </select>
          </div>

          {/* PRIORITY */}

          <div className="form-group">
            <label htmlFor="project-priority">Priority</label>

            <select
              id="project-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={loading}>
              <option value="Low">Low</option>

              <option value="Medium">Medium</option>

              <option value="High">High</option>
            </select>
          </div>

          {/* ACTIONS */}

          <div className="project-modal-actions">
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>

            <button type="submit" disabled={loading}>
              {loading
                ? isEditing
                  ? 'Saving...'
                  : 'Creating...'
                : isEditing
                  ? 'Save Changes'
                  : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjectModal;
