import './Projects.css';

import ProjectCard from '../Project/ProjectCard';

interface Project {
  id: number;
  title: string;
  description: string;
  progress: number;
  tasks: number;
  priority: string;
  updated: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'DevTrack',
    description: 'Developer productivity platform built with React, TypeScript and Node.js.',
    progress: 78,
    tasks: 24,
    priority: 'High',
    updated: '2 Aug 2026',
  },
  {
    id: 2,
    title: 'Portfolio',
    description: 'Personal portfolio showcasing projects and skills.',
    progress: 100,
    tasks: 18,
    priority: 'Low',
    updated: '31 Jul 2026',
  },
  {
    id: 3,
    title: 'Coffee Shop',
    description: 'Modern React website for a fictional coffee shop.',
    progress: 62,
    tasks: 15,
    priority: 'Medium',
    updated: '28 Jul 2026',
  },
];

function Projects() {
  return (
    <section className="projects-content">

      <div className="projects-header">

        <div>
          <h1>Projects</h1>
          <p>Manage all your projects in one place.</p>
        </div>

        <button className="new-project-btn">
          + New Project
        </button>

      </div>


      <div className="projects-search">

        <input
          type="text"
          placeholder="Search projects..."
        />

        <select className="projects-filter">
          <option>All Projects</option>
          <option>Active</option>
          <option>Completed</option>
          <option>Archived</option>
        </select>

        <select className="priority-filter">
          <option>All priorities</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

      </div>


      <div className="projects-container">

        <div className="projects-list">

          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))}

        </div>

      </div>

    </section>
  );
}

export default Projects;