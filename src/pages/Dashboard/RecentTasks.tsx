import { MdCheckCircle, MdAccessTime, MdPriorityHigh } from 'react-icons/md';

import './RecentTasks.css';

const tasks = [
  {
    title: 'Create authentication system',
    project: 'DevTrack',
    status: 'Completed',
    priority: 'High',
  },

  {
    title: 'Design dashboard layout',
    project: 'DevTrack',
    status: 'In Progress',
    priority: 'Medium',
  },

  {
    title: 'Fix responsive issues',
    project: 'Portfolio',
    status: 'To Do',
    priority: 'Low',
  },
];

function RecentTasks() {
  return (
    <div className="recent-tasks">
      <div className="recent-tasks-header">
        <h2>Recent Tasks</h2>

        <button>View All</button>
      </div>

      <div className="recent-tasks-list">
        {tasks.map((task) => (
          <div className="recent-task-card" key={task.title}>
            <div className="recent-task-info">
              <h3>{task.title}</h3>

              <p>{task.project}</p>
            </div>

            <div className="recent-task-meta">
              <span
                className={`task-status ${task.status.replace(' ', '-').toLowerCase()}`}>
                {task.status === 'Completed' ? (
                  <MdCheckCircle />
                ) : task.status === 'In Progress' ? (
                  <MdAccessTime />
                ) : (
                  <MdPriorityHigh />
                )}

                {task.status}
              </span>

              <span className={`task-priority ${task.priority.toLowerCase()}`}>
                {task.priority}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentTasks; 
