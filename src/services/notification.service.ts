import apiFetch from './api';

export interface NotificationData {
  id: number;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// =========================
// GET ALL NOTIFICATIONS
// =========================

export async function getNotifications(): Promise<NotificationData[]> {
  const data = await apiFetch('/notifications');

  return data.notifications;
}

// =========================
// GET UNREAD COUNT
// =========================

export async function getUnreadNotificationCount(): Promise<number> {
  const data = await apiFetch('/notifications/unread-count');

  return data.count;
}

// =========================
// MARK ONE NOTIFICATION AS READ
// =========================

export async function markNotificationAsRead(
  id: number,
): Promise<NotificationData> {
  const data = await apiFetch(`/notifications/${id}/read`, {
    method: 'PUT',
  });

  return data.notification;
}

// =========================
// MARK ALL NOTIFICATIONS AS READ
// =========================

export async function markAllNotificationsAsRead(): Promise<void> {
  await apiFetch('/notifications/read-all', {
    method: 'PUT',
  });
}

// =========================
// DELETE ALL NOTIFICATIONS
// =========================

export async function deleteAllNotifications(): Promise<void> {
  await apiFetch('/notifications/delete-all', {
    method: 'DELETE',
  });
}
