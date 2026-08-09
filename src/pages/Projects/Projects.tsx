import './Projects.css';

import { useEffect, useState } from 'react';

import ProjectCard from '../../components/Project/ProjectCard';
import ProjectModal from '../../components/ProjectModal/ProjectModal';

import { getProjects, deleteProject } from '../../services/project.service';

import type { Project } from '../../types/project';

import { notifyNotificationsUpdated } from '../../utils/notificationEvents';

function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);

  const [showModal, setShowModal] = useState(false);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // =========================
  // LOAD PROJECTS
  // =========================

  async function loadProjects() {
    try {
      const data = await getProjects();

      console.log('PROJECTS RESPONSE:', data);

      setProjects(data.projects);
    } catch (error) {
      console.error('ERROR LOADING PROJECTS:', error);
    }
  }

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    loadProjects();
  }, []);

  // =========================
  // CREATE PROJECT
  // =========================

  function handleCreateProject() {
    setSelectedProject(null);
    setShowModal(true);
  }

  // =========================
  // EDIT PROJECT
  // =========================

  function handleEditProject(project: Project) {
    setSelectedProject(project);
    setShowModal(true);
  }

  // =========================
  // PROJECT CREATED / UPDATED
  // =========================

  async function handleProjectSaved() {
    try {
      // Atualizar lista de projetos
      await loadProjects();

      // Atualizar Navbar / notificações
      notifyNotificationsUpdated();
    } catch (error) {
      console.error('PROJECT SAVED ERROR:', error);
    }
  }

  // =========================
  // DELETE PROJECT
  // =========================

  async function handleDeleteProject(projectId: number) {
    try {
      // Eliminar projeto no backend
      await deleteProject(projectId);

      // Atualizar lista de projetos
      await loadProjects();

      // Atualizar Navbar / notificações
      notifyNotificationsUpdated();
    } catch (error) {
      console.error('DELETE PROJECT ERROR:', error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Failed to delete project.');
      }
    }
  }

  // =========================
  // CLOSE MODAL
  // =========================

  function handleCloseModal() {
    setShowModal(false);
    setSelectedProject(null);
  }

  return (
    <section className="projects-content">
      {/* =========================
          HEADER
      ========================= */}

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

      {/* =========================
          SEARCH / FILTERS
      ========================= */}

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

      {/* =========================
          PROJECTS
      ========================= */}

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

      {/* =========================
          PROJECT MODAL
      ========================= */}

      {showModal && (
        <ProjectModal
          project={selectedProject}
          onClose={handleCloseModal}
          onCreated={handleProjectSaved}
        />
      )}
    </section>
  );
}

export default Projects;
