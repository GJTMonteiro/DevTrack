const PROFILE_UPDATED_EVENT = 'profile-updated';

export function notifyProfileUpdated() {
  window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT));
}

export function onProfileUpdated(callback: () => void) {
  window.addEventListener(PROFILE_UPDATED_EVENT, callback);

  return () => {
    window.removeEventListener(PROFILE_UPDATED_EVENT, callback);
  };
}