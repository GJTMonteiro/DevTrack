import apiFetch from './api';

export const AVATARS = [
  'avatar-1',
  'avatar-2',
  'avatar-3',
  'avatar-4',
] as const;

export type Avatar = (typeof AVATARS)[number];

export interface ProfileData {
  name: string;
  username: string;
  email: string;
  role: string;
  bio?: string;
  country: string;
  country_code: string;
  avatar: Avatar | null;
}

// ==========================
// GET PROFILE
// ==========================

export async function getProfile(): Promise<ProfileData> {
  const data = await apiFetch('/profile');

  return data.profile;
}

// ==========================
// UPDATE PROFILE
// ==========================

export async function updateProfile(
  profile: ProfileData,
): Promise<ProfileData> {
  const data = await apiFetch('/profile', {
    method: 'PUT',
    body: JSON.stringify(profile),
  });

  return data.profile ?? data;
}

// ==========================
// CHANGE PASSWORD
// ==========================

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ message: string }> {
  const data = await apiFetch('/profile/password', {
    method: 'PUT',
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });

  return data;
}
