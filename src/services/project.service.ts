import type { Project } from '../types/project';

const API_URL = 'http://localhost:3000/api/projects';

interface ProjectsResponse {
  projects: Project[];
}

interface CreateProjectResponse {
  message: string;
  project: Project;
}

interface UpdateProjectResponse {
  project: Project;
}

interface ErrorResponse {
  message?: string;
}

// ==========================
// GET PROJECTS
// ==========================

export async function getProjects(): Promise<ProjectsResponse> {
  const token = localStorage.getItem('token');

  const response = await fetch(API_URL, {
    method: 'GET',

    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = (await response.json()) as ProjectsResponse | ErrorResponse;

  if (!response.ok) {
    throw new Error(
      'message' in data && data.message
        ? data.message
        : 'Failed to fetch projects',
    );
  }

  return data as ProjectsResponse;
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
  const token = localStorage.getItem('token');

  const response = await fetch(API_URL, {
    method: 'POST',

    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },

    body: JSON.stringify(projectData),
  });

  const data = (await response.json()) as CreateProjectResponse | ErrorResponse;

  if (!response.ok) {
    throw new Error(
      'message' in data && data.message
        ? data.message
        : 'Failed to create project',
    );
  }

  return data as CreateProjectResponse;
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
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/${projectId}`, {
    method: 'PUT',

    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },

    body: JSON.stringify(projectData),
  });

  const data = (await response.json()) as UpdateProjectResponse | ErrorResponse;

  if (!response.ok) {
    throw new Error(
      'message' in data && data.message
        ? data.message
        : 'Failed to update project',
    );
  }

  return data as UpdateProjectResponse;
}

// ==========================
// DELETE PROJECT
// ==========================

export async function deleteProject(
  projectId: number,
): Promise<{ message: string }> {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/${projectId}`, {
    method: 'DELETE',

    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = (await response.json()) as { message: string } | ErrorResponse;

  if (!response.ok) {
    throw new Error(
      'message' in data && data.message
        ? data.message
        : 'Failed to delete project',
    );
  }

  return data as { message: string };
}
