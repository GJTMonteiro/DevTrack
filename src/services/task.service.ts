import apiFetch from './api';

import type { Task } from '../types/task';

interface TasksResponse {
  tasks: Task[];
}

export async function getTasks(): Promise<TasksResponse> {
  const data = await apiFetch('/tasks');

  return {
    tasks: data.tasks,
  };
}

export async function createTask(taskData: {
  project_id: number;

  title: string;

  description?: string;

  status?: string;

  priority?: string;

  due_date?: string;
}) {
  return await apiFetch('/tasks', {
    method: 'POST',

    body: JSON.stringify(taskData),
  });
}

export async function updateTask(
  id: number,
  taskData: {
    title: string;

    description?: string;

    status?: string;

    priority?: string;

    due_date?: string;
  },
) {
  return await apiFetch(`/tasks/${id}`, {
    method: 'PUT',

    body: JSON.stringify(taskData),
  });
}

export async function deleteTask(id: number) {
  return await apiFetch(`/tasks/${id}`, {
    method: 'DELETE',
  });
}
