import './TaskCard.css';

import { useState } from 'react';

import {
  MdPriorityHigh,
  MdRemove,
  MdArrowDownward,
  MdCheckCircle,
  MdAccessTime,
  MdRadioButtonUnchecked,
  MdMoreVert,
  MdEdit,
  MdVisibility,
  MdDelete,
} from 'react-icons/md';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
}

interface TaskCardProps {
  task: Task;
}

function TaskCard({ task }: TaskCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const getPriorityIcon = () => {
    switch (task.priority) {
      case 'High':
        return <MdPriorityHigh />;

      case 'Medium':
        return <MdRemove />;

      case 'Low':
        return <MdArrowDownward />;

      default:
        return null;
    }
  };

  const getStatusIcon = () => {
    switch (task.status) {
      case 'Completed':
        return <MdCheckCircle />;

      case 'In Progress':
        return <MdAccessTime />;

      case 'To Do':
        return <MdRadioButtonUnchecked />;

      default:
        return null;
    }
  };

  return (
    <div className="task-card">
      <div className="task-card-header">
        <h3 className="task-title">{task.title}</h3>

        <div className="task-actions">
          <button
            className="task-action-btn"
            onClick={() => setMenuOpen(!menuOpen)}>
            <MdMoreVert />
          </button>

          {menuOpen && (
            <div className="task-dropdown">
              <button>
                <MdVisibility />
                View Details
              </button>

              <button>
                <MdEdit />
                Edit Task
              </button>

              <button className="delete">
                <MdDelete />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={`task-priority ${task.priority.toLowerCase()}`}>
        {getPriorityIcon()}

        <span>{task.priority}</span>
      </div>

      <p className="task-description">{task.description}</p>

      <div className="task-card-footer">
        <div
          className={`task-status ${task.status
            .toLowerCase()
            .replace(' ', '-')}`}>
          {getStatusIcon()}

          <span>{task.status}</span>
        </div>

        <div className="task-due-date">{task.dueDate}</div>
      </div>
    </div>
  );
}

export default TaskCard;
