import './Tasks.css';

import { useEffect, useState } from 'react';

import { getTasks, deleteTask } from '../../services/task.service';

import type { Task } from '../../types/task';

import TaskModal from '../../components/TaskModal/TaskModal';

function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [selectedTask, setSelectedTask] = useState<Task | undefined>();

  async function loadTasks() {
    try {
      const response = await getTasks();

      console.log('TASKS RESPONSE:', response);

      setTasks(response.tasks);
    } catch (error) {
      console.error('LOAD TASKS ERROR:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteTask(id: number) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this task?',
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteTask(id);

      loadTasks();
    } catch (error) {
      console.error('DELETE TASK ERROR:', error);
    }
  }

  function handleEditTask(task: Task) {
    setSelectedTask(task);

    setShowModal(true);
  }

  function handleCreateTask() {
    setSelectedTask(undefined);

    setShowModal(true);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  return (
    <section className="tasks-page">
      <div className="tasks-header">
        <div>
          <h1>Tasks</h1>

          <p>Manage your tasks and track your productivity.</p>
        </div>

        <button className="new-task-btn" onClick={handleCreateTask}>
          + New Task
        </button>
      </div>

      <div className="tasks-container">
        {tasks.length === 0 ? (
          <p className="no-tasks">No tasks created yet.</p>
        ) : (
          tasks.map((task) => (
            <div className="task-card" key={task.id}>
              <div>
                <h3>{task.title}</h3>

                <p>{task.description}</p>

                {task.project_name && (
                  <small>Project: {task.project_name}</small>
                )}
              </div>

              <div className="task-meta">
                <span>{task.status}</span>

                <span>{task.priority}</span>

                <button
                  className="edit-task-btn"
                  onClick={() => handleEditTask(task)}>
                  Edit
                </button>

                <button
                  className="delete-task-btn"
                  onClick={() => handleDeleteTask(task.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <TaskModal
          task={selectedTask}
          onClose={() => {
            setShowModal(false);

            setSelectedTask(undefined);
          }}
          onCreated={loadTasks}
        />
      )}
    </section>
  );
}

export default Tasks;
