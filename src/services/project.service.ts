import apiFetch from './api';
import type { Project } from '../types/project';

interface ProjectsResponse {
  projects: Project[];
}

interface CreateProjectResponse {
  message: string;
  project: Project;
}

interface UpdateProjectResponse {
  message?: string;
  project: Project;
}

interface DeleteProjectResponse {
  message: string;
}

// ==========================
// GET PROJECTS
// ==========================

export async function getProjects(): Promise<ProjectsResponse> {
  const data = await apiFetch('/projects');

  return data;
}

// ==========================
// CREATE PROJECT
// ==========================

export async function createProject(projectData: {
  title: string;
  description: string;
  color?: string;
  status?: string;
  priority?: string;
}): Promise<CreateProjectResponse> {
  const data = await apiFetch('/projects', {
    method: 'POST',
    body: JSON.stringify(projectData),
  });

  return data;
}

// ==========================
// UPDATE PROJECT
// ==========================

export async function updateProject(
  projectId: number,
  projectData: {
    title: string;
    description: string;
    color?: string;
    status?: string;
    priority?: string;
  },
): Promise<UpdateProjectResponse> {
  const data = await apiFetch(`/projects/${projectId}`, {
    method: 'PUT',
    body: JSON.stringify(projectData),
  });

  return data;
}

// ==========================
// DELETE PROJECT
// ==========================

export async function deleteProject(
  projectId: number,
): Promise<DeleteProjectResponse> {
  const data = await apiFetch(`/projects/${projectId}`, {
    method: 'DELETE',
  });

  return data;
}
