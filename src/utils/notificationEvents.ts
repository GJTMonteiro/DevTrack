export const NOTIFICATIONS_UPDATED_EVENT = 'notifications-updated';

export function notifyNotificationsUpdated() {
  window.dispatchEvent(new CustomEvent(NOTIFICATIONS_UPDATED_EVENT));
}
