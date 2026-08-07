import './RecentTasks.css';

import { useEffect, useState } from 'react';

import { MdCheckCircle, MdAccessTime, MdPriorityHigh } from 'react-icons/md';

import { getTasks } from '../../services/task.service';

import type { Task } from '../../types/task';

function RecentTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function loadTasks() {
      try {
        const data = await getTasks();

        // Apenas as 5 tarefas mais recentes
        setTasks(data.tasks.slice(0, 5));
      } catch (error) {
        console.error(error);
      }
    }

    loadTasks();
  }, []);

  return (
    <div className="recent-tasks">
      <div className="recent-tasks-header">
        <h2>Recent Tasks</h2>

        <button>View All</button>
      </div>

      <div className="recent-tasks-list">
        {tasks.length === 0 ? (
          <p>No tasks yet.</p>
        ) : (
          tasks.map((task) => (
            <div className="recent-task-card" key={task.id}>
              <div className="recent-task-info">
                <h3>{task.title}</h3>

                <p>{task.project_name}</p>
              </div>

              <div className="recent-task-meta">
                <span
                  className={`task-status ${task.status
                    .replace(' ', '-')
                    .toLowerCase()}`}>
                  {task.status === 'Completed' ? (
                    <MdCheckCircle />
                  ) : task.status === 'In Progress' ? (
                    <MdAccessTime />
                  ) : (
                    <MdPriorityHigh />
                  )}

                  {task.status}
                </span>

                <span
                  className={`task-priority ${task.priority.toLowerCase()}`}>
                  {task.priority}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RecentTasks;
