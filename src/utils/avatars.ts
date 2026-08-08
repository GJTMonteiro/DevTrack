import Avatar1 from '../assets/avatars/avatar-1.jpg';
import Avatar2 from '../assets/avatars/avatar-2.jpg';
import Avatar3 from '../assets/avatars/avatar-3.jpeg';
import Avatar4 from '../assets/avatars/avatar-4.jpeg';
import DefaultAvatar from '../assets/avatars/default-avatar.svg';

export const avatars: Record<string, string> = {
  'avatar-1': Avatar1,
  'avatar-2': Avatar2,
  'avatar-3': Avatar3,
  'avatar-4': Avatar4,
};

export function getAvatar(avatar?: string | null): string {
  if (!avatar) {
    return DefaultAvatar;
  }

  return avatars[avatar] || DefaultAvatar;
}
