import apiFetch from './api';

import type { Task } from '../types/task';

import { notifyNotificationsUpdated } from '../utils/notificationEvents';

// ============================================================
// TYPES
// ============================================================

interface TasksResponse {
  tasks: Task[];
}

// ============================================================
// GET TASKS
// ============================================================

export async function getTasks(): Promise<TasksResponse> {
  const data = await apiFetch('/tasks');

  return {
    tasks: data.tasks,
  };
}

// ============================================================
// CREATE TASK
// ============================================================

export async function createTask(taskData: {
  project_id: number;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  due_date?: string;
}) {
  const data = await apiFetch('/tasks', {
    method: 'POST',

    body: JSON.stringify(taskData),
  });

  // Notify Navbar that a new notification may exist
  notifyNotificationsUpdated();

  return data;
}

// ============================================================
// UPDATE TASK
// ============================================================

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
  const data = await apiFetch(`/tasks/${id}`, {
    method: 'PUT',

    body: JSON.stringify(taskData),
  });

  // Notify Navbar that a new notification may exist
  notifyNotificationsUpdated();

  return data;
}

// ============================================================
// DELETE TASK
// ============================================================

export async function deleteTask(id: number) {
  const data = await apiFetch(`/tasks/${id}`, {
    method: 'DELETE',
  });

  // Notify Navbar that a new notification may exist
  notifyNotificationsUpdated();

  return data;
}
