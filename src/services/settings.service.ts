import apiFetch from './api';

export interface SettingsData {
  project_created_notifications: boolean;
  project_updated_notifications: boolean;
  project_deleted_notifications: boolean;
}

export async function getSettings(): Promise<SettingsData> {
  const data = await apiFetch('/settings');

  return data.settings;
}

export async function updateSettings(
  settings: SettingsData,
): Promise<SettingsData> {
  const data = await apiFetch('/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  });

  return data.settings;
}
