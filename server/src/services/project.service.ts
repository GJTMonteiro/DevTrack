const API_URL = 'http://localhost:3000/api/projects';

interface Project {
  id: number;

  title: string;

  description: string;

  color: string;

  status: string;

  priority: string;

  created_at: string;

  updated_at: string;
}

interface ProjectsResponse {
  projects: Project[];
}

interface CreateProjectResponse {
  message: string;

  project: Project;
}

interface ErrorResponse {
  message?: string;
}

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
