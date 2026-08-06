import apiFetch from './api';

import type { Project } from '../types/project';

interface ProjectsResponse {
  projects: Project[];
}

export async function getProjects(): Promise<ProjectsResponse> {
  const data = await apiFetch('/projects');

  const projects = Array.isArray(data) ? data : data.projects;

  return {
    projects: projects.map((project: any) => ({
      id: project.id,

      title: project.title,

      description: project.description ?? '',

      color: project.color ?? '#3b82f6',

      status: project.status ?? 'Planning',

      priority: project.priority ?? 'Medium',

      progress: project.progress ?? 0,

      tasks: project.tasks ?? 0,

      created_at: project.created_at,

      updated_at: project.updated_at,

      updated: project.updated ?? project.updated_at,
    })),
  };
}

export async function createProject(projectData: {
  title: string;

  description: string;

  color?: string;

  status?: string;

  priority?: string;
}) {
  return await apiFetch('/projects', {
    method: 'POST',

    body: JSON.stringify(projectData),
  });
}
