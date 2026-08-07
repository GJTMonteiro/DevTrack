import './TaskModal.css';

import { useEffect, useState } from 'react';

import { createTask, updateTask } from '../../services/task.service';

import { getProjects } from '../../services/project.service';

import type { Project } from '../../types/project';

import type { Task } from '../../types/task';

interface TaskModalProps {
  onClose: () => void;

  onCreated: () => void;

  task?: Task;
}

function TaskModal({ onClose, onCreated, task }: TaskModalProps) {
  const editing = Boolean(task);

  const [projects, setProjects] = useState<Project[]>([]);

  const [projectId, setProjectId] = useState<number | null>(
    task?.project_id ?? null,
  );

  const [title, setTitle] = useState(task?.title ?? '');

  const [description, setDescription] = useState(task?.description ?? '');

  const [status, setStatus] = useState(task?.status ?? 'To Do');

  const [priority, setPriority] = useState(task?.priority ?? 'Medium');

  const [dueDate, setDueDate] = useState(task?.due_date ?? '');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await getProjects();

        setProjects(data.projects);

        if (!task && data.projects.length > 0) {
          setProjectId(data.projects[0].id);
        }
      } catch (error) {
        console.error('LOAD PROJECTS ERROR:', error);
      }
    }

    loadProjects();
  }, [task]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!projectId) {
      return;
    }

    try {
      setLoading(true);

      if (editing && task) {
        await updateTask(
          task.id,

          {
            title,

            description,

            status,

            priority,

            due_date: dueDate || undefined,
          },
        );
      } else {
        await createTask({
          project_id: projectId,

          title,

          description,

          status,

          priority,

          due_date: dueDate || undefined,
        });
      }

      onCreated();

      onClose();
    } catch (error) {
      console.error('SAVE TASK ERROR:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="task-modal-overlay">
      <div className="task-modal">
        <h2>{editing ? 'Edit Task' : 'Create New Task'}</h2>

        <form onSubmit={handleSubmit}>
          {!editing && (
            <div className="form-group">
              <label>Project</label>

              <select
                value={projectId ?? ''}
                onChange={(e) => setProjectId(Number(e.target.value))}
                required>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Task Title</label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Status</label>

            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option>To Do</option>

              <option>In Progress</option>

              <option>Completed</option>
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

          <div className="form-group">
            <label>Due Date</label>

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="task-modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : editing ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
