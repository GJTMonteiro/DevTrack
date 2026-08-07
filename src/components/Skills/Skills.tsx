import './Skills.css';

import { useEffect, useState } from 'react';

import {
  getSkills,
  createSkill,
  deleteSkill,
} from '../../services/skill.service';

import type { Skill } from '../../types/skill';

function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadSkills() {
    try {
      const data = await getSkills();

      setSkills(data.skills);
    } catch (error) {
      console.error('LOAD SKILLS ERROR:', error);
    }
  }

  useEffect(() => {
    loadSkills();
  }, []);

  async function handleAddSkill() {
    if (!newSkill.trim()) {
      return;
    }

    try {
      setLoading(true);

      await createSkill(newSkill);

      setNewSkill('');

      loadSkills();
    } catch (error) {
      console.error('CREATE SKILL ERROR:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteSkill(id: number) {
    const confirmDelete = window.confirm('Remove this skill?');

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteSkill(id);

      loadSkills();
    } catch (error) {
      console.error('DELETE SKILL ERROR:', error);
    }
  }

  return (
    <div className="skills-card">
      <div className="skills-header">
        <h2>Skills</h2>
      </div>

      <div className="skills-add">
        <input
          type="text"
          placeholder="Add a skill..."
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddSkill();
            }
          }}
        />

        <button onClick={handleAddSkill} disabled={loading}>
          {loading ? 'Adding...' : '+ Add'}
        </button>
      </div>

      {skills.length === 0 ? (
        <p className="no-skills">No skills added yet.</p>
      ) : (
        <div className="skills-list">
          {skills.map((skill) => (
            <div className="skill-item" key={skill.id}>
              <span>{skill.skill}</span>

              <button
                className="delete-skill-btn"
                onClick={() => handleDeleteSkill(skill.id)}>
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Skills;
