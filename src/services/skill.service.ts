import apiFetch from './api';
import type { Skill } from '../types/skill';

interface SkillsResponse {
  skills: Skill[];
}

export async function getSkills(): Promise<SkillsResponse> {
  const data = await apiFetch('/skills');

  return {
    skills: data.skills,
  };
}

export async function createSkill(skill: string) {
  return await apiFetch('/skills', {
    method: 'POST',

    body: JSON.stringify({
      skill,
    }),
  });
}

export async function deleteSkill(id: number) {
  return await apiFetch(`/skills/${id}`, {
    method: 'DELETE',
  });
}
