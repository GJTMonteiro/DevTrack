import './ProjectModal.css';

import { useEffect, useState } from 'react';

import { createProject, updateProject } from '../../services/project.service';

import type { Project } from '../../types/project';

interface ProjectModalProps {
  onClose: () => void;
  onCreated: () => void;
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const projectData = {
        title,
        description,
        color,
        status,
        priority,
      };

      if (project) {
        await updateProject(String(project.id), projectData);
      } else {
        await createProject(projectData);
      }

      onCreated();
      onClose();
    } catch (error) {
      console.error(
        project ? 'UPDATE PROJECT ERROR:' : 'CREATE PROJECT ERROR:',
        error,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal">
        <h2>{isEditing ? 'Edit Project' : 'Create New Project'}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project Title</label>

            <input
              type="text"
              placeholder="Project title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              placeholder="Project description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="color-picker">
            <label>Project Color</label>

            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Status</label>

            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Planning">Planning</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <div className="form-group">
            <label>Priority</label>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="project-modal-actions">
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>

            <button type="submit" disabled={loading}>
              {loading
                ? project
                  ? 'Saving...'
                  : 'Creating...'
                : project
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
