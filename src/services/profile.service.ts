import apiFetch from './api';

export interface ProfileData {
  name: string;
  username: string;
  email: string;
  role: string;
  bio?: string;
  country: string;
  country_code: string;
}

export async function getProfile(): Promise<ProfileData> {
  const data = await apiFetch('/profile');

  return data.profile;
}

export async function updateProfile(profile: ProfileData) {
  return await apiFetch('/profile', {
    method: 'PUT',
    body: JSON.stringify(profile),
  });
}
