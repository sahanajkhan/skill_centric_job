import React from 'react';
import { AlertCircle, Plus } from 'lucide-react';
import SkillTag from './SkillTag';
import { useSkills } from '../context/SkillContext';

const MissingSkills = ({ skills = [], showAddButton = true }) => {
  const { addSkill } = useSkills();

  if (!skills || skills.length === 0) {
    return (
      <div style={{ color: 'var(--success)', fontSize: '0.875rem', fontWeight: 500 }}>
        🎉 Perfect match! You possess all required skills for this job.
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--warning)', marginBottom: '0.5rem' }}>
        <AlertCircle size={16} />
        <span>Missing / Skill Gap ({skills.length})</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', alignItems: 'center' }}>
        {skills.map((skill) => (
          <div key={`missing-list-${skill}`} style={{ display: 'inline-flex', alignItems: 'center' }}>
            <SkillTag name={skill} type="missing" />
            {showAddButton && (
              <button
                onClick={() => addSkill(skill)}
                style={{
                  fontSize: '0.7rem',
                  padding: '0.15rem 0.4rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border)',
                  borderRadius: '9999px',
                  color: 'var(--text-muted)',
                  marginLeft: '-0.2rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.15rem'
                }}
                title={`Add ${skill} to your profile`}
              >
                <Plus size={10} /> Add
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MissingSkills;
