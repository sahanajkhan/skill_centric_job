import React from 'react';
import { Check, AlertCircle } from 'lucide-react';

const SkillTag = ({ name, type = 'neutral', onRemove }) => {
  let badgeClass = 'skill-neutral';
  let Icon = null;

  if (type === 'matching' || type === 'matched') {
    badgeClass = 'skill-matching';
    Icon = Check;
  } else if (type === 'missing') {
    badgeClass = 'skill-missing';
    Icon = AlertCircle;
  }

  return (
    <span className={`skill-badge ${badgeClass}`}>
      {Icon && <Icon size={12} />}
      {name}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(name);
          }}
          style={{ marginLeft: '4px', cursor: 'pointer', opacity: 0.7 }}
          title={`Remove ${name}`}
        >
          &times;
        </button>
      )}
    </span>
  );
};

export default SkillTag;
