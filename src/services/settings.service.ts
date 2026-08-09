import apiFetch from './api';

export interface SettingsData {
  // ==========================
  // PROJECT NOTIFICATIONS
  // ==========================

  project_created_notifications: boolean;
  project_updated_notifications: boolean;
  project_deleted_notifications: boolean;

  // ==========================
  // TASK NOTIFICATIONS
  // ==========================

  task_created_notifications: boolean;
  task_updated_notifications: boolean;
  task_deleted_notifications: boolean;
}

// ==========================
// GET SETTINGS
// ==========================

export async function getSettings(): Promise<SettingsData> {
  const data = await apiFetch('/settings');

  return data.settings;
}

// ==========================
// UPDATE SETTINGS
// ==========================

export async function updateSettings(
  settings: SettingsData,
): Promise<SettingsData> {
  const data = await apiFetch('/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  });

  return data.settings;
}
