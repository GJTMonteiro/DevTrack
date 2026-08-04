import './Tasks.css';
import TaskCard from '../../components/Task/TaskCard';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
}

const tasks: Task[] = [
  {
    id: 1,
    title: 'Create DevTrack',
    description: 'Develop the app',
    status: 'Completed',
    priority: 'High',
    dueDate: '15 Aug 2026',
  },
  {
    id: 2,
    title: 'Get in Shape',
    description: 'Achieve the best shape possible',
    status: 'In Progress',
    priority: 'High',
    dueDate: 'No deadline',
  },
  {
    id: 3,
    title: 'Buy a House',
    description: 'Buy the land and build the dream house',
    status: 'In Progress',
    priority: 'High',
    dueDate: 'No deadline',
  },
];

function Tasks() {
  return (
    <section className="task-content">

      <div className="task-header">
        <div>
          <h1>Tasks</h1>
          <p>Manage all your tasks in one place.</p>
        </div>

        <button className="new-task-btn">
          + New Task
        </button>
      </div>


      <div className="tasks-search">

        <input
          type="text"
          placeholder="Search tasks..."
        />

        <select className="tasks-filter">
          <option>All Status</option>
          <option>To Do</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <select className="priority-filter">
          <option>All priorities</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

      </div>


      <div className="tasks-container">
        <div className="tasks-list">

          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
            />
          ))}

        </div>
      </div>

    </section>
  );
}

export default Tasks;