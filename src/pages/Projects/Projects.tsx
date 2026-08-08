import './Projects.css';

import { useEffect, useState } from 'react';

import ProjectCard from '../../components/Project/ProjectCard';

import ProjectModal from '../../components/ProjectModal/ProjectModal';

import { getProjects, deleteProject } from '../../services/project.service';

import type { Project } from '../../types/project';

function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);

  const [showModal, setShowModal] = useState(false);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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


  function handleCreateProject() {
    setSelectedProject(null);

    setShowModal(true);
  }

  function handleEditProject(project: Project) {
    setSelectedProject(project);

    setShowModal(true);
  }

  async function handleDeleteProject(projectId: number) {
    try {
      await deleteProject(projectId);

      await loadProjects();
    } catch (error) {
      console.error('DELETE PROJECT ERROR:', error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Failed to delete project.');
      }
    }
  }

  function handleCloseModal() {
    setShowModal(false);

    setSelectedProject(null);
  }

  return (
    <section className="projects-page">
      <div className="projects-header">
        <div>
          <h1>Projects</h1>

          <p>Manage all your projects in one place.</p>
        </div>

        <button
          type="button"
          className="new-project-btn"
          onClick={handleCreateProject}>
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
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
              />
            ))
          )}
        </div>
      </div>

      {showModal && (
        <ProjectModal
          project={selectedProject}
          onClose={handleCloseModal}
          onCreated={loadProjects}
        />
      )}
    </section>
  );
}

export default Projects;
