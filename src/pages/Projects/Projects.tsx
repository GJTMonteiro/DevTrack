import './Projects.css';

import { useEffect, useState } from 'react';

import ProjectCard from '../Project/ProjectCard';

import ProjectModal from '../../components/ProjectModal/ProjectModal';

import { getProjects } from '../../services/project.service';

import type { Project } from '../../types/project';

function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);

  const [showModal, setShowModal] = useState(false);

  async function loadProjects() {
    try {
      const data = await getProjects();

      console.log('PROJECTS RESPONSE:', data);

      setProjects(data.projects);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <section className="projects-content">
      <div className="projects-header">
        <div>
          <h1>Projects</h1>

          <p>Manage all your projects in one place.</p>
        </div>

        <button className="new-project-btn" onClick={() => setShowModal(true)}>
          + New Project
        </button>
      </div>

      <div className="projects-search">
        <input type="text" placeholder="Search projects..." />

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
          {projects.length === 0 ? (
            <p className="no-projects">No projects created yet.</p>
          ) : (
            projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          )}
        </div>
      </div>

      {showModal && (
        <ProjectModal
          onClose={() => setShowModal(false)}
          onCreated={loadProjects}
        />
      )}
    </section>
  );
}

export default Projects;
