import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import SkillTag from './SkillTag';

const MatchingSkills = ({ skills = [] }) => {
  if (!skills || skills.length === 0) {
    return (
      <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontStyle: 'italic' }}>
        No matching skills detected for your profile.
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--success)', marginBottom: '0.5rem' }}>
        <CheckCircle2 size={16} />
        <span>Matched Skills ({skills.length})</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
        {skills.map((skill) => (
          <SkillTag key={`matched-list-${skill}`} name={skill} type="matching" />
        ))}
      </div>
    </div>
  );
};

export default MatchingSkills;
