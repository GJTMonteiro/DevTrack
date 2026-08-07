import './ProjectModal.css';

import { useState } from 'react';

import { createProject } from '../../services/project.service';

interface ProjectModalProps {
  onClose: () => void;

  onCreated: () => void;
}

function ProjectModal({ onClose, onCreated }: ProjectModalProps) {
  const [title, setTitle] = useState('');

  const [description, setDescription] = useState('');

  const [color, setColor] = useState('#3B82F6');

  const [status, setStatus] = useState('Planning');

  const [priority, setPriority] = useState('Medium');

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      await createProject({
        title,

        description,

        color,

        status,

        priority,
      });

      // Atualiza lista de projetos

      onCreated();

      // Fecha modal

      onClose();

      // Limpa formulário

      setTitle('');

      setDescription('');

      setColor('#3B82F6');

      setStatus('Planning');

      setPriority('Medium');
    } catch (error) {
      console.error('CREATE PROJECT ERROR:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="project-modal-overlay">
      <div className="project-modal">
        <h2>Create New Project</h2>

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
              <option>Planning</option>

              <option>Active</option>

              <option>Completed</option>

              <option>Archived</option>
            </select>
          </div>

          <div className="form-group">
            <label>Priority</label>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}>
              <option>Low</option>

              <option>Medium</option>

              <option>High</option>
            </select>
          </div>

          <div className="project-modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjectModal;
