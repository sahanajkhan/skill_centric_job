import React from 'react';
import { SlidersHorizontal, Globe, Briefcase, Percent, CheckCircle2, RotateCcw } from 'lucide-react';
import SkillTag from './SkillTag';

const Sidebar = ({
  remoteOnly = false,
  onRemoteChange,
  experienceLevel = '',
  onExperienceChange,
  selectedSource = '',
  onSourceChange,
  minMatchScore = 0,
  onMinMatchChange,
  userSkills = [],
  onRemoveSkill,
  onResetFilters
}) => {
  const experiences = ['All Levels', 'Entry / Junior', 'Mid Level', 'Senior Level', 'Lead'];
  const sources = ['All Sources', 'Remotive', 'Arbeitnow', 'USAJobs', 'Adzuna', 'LinkedIn'];

  return (
    <aside className="sidebar-filter-panel card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', pb: '0.75rem', borderBottom: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <SlidersHorizontal size={18} color="var(--primary)" /> Filter Opportunities
        </h3>
        <button
          onClick={onResetFilters}
          style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}
          title="Reset all filters"
        >
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      {/* Minimum Match Score Slider */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Percent size={14} color="var(--primary)" /> Minimum Match Score
          </span>
          <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{minMatchScore}%+</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={minMatchScore}
          onChange={(e) => onMinMatchChange(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          <span>0% (All Jobs)</span>
          <span>50%</span>
          <span>80% (High Match)</span>
        </div>
      </div>

      {/* Remote Only Toggle */}
      <div style={{ marginBottom: '1.5rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={16} color="#38BDF8" /> Remote Only
          </span>
          <input
            type="checkbox"
            checked={remoteOnly}
            onChange={(e) => onRemoteChange(e.target.checked)}
            style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
          />
        </label>
      </div>

      {/* Experience Level */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
          Experience Level
        </label>
        <select
          value={experienceLevel}
          onChange={(e) => onExperienceChange(e.target.value)}
          style={{ width: '100%', cursor: 'pointer' }}
        >
          {experiences.map(exp => (
            <option key={exp} value={exp === 'All Levels' ? '' : exp}>
              {exp}
            </option>
          ))}
        </select>
      </div>

      {/* Job Provider Source */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
          Job Source API
        </label>
        <select
          value={selectedSource}
          onChange={(e) => onSourceChange(e.target.value)}
          style={{ width: '100%', cursor: 'pointer' }}
        >
          {sources.map(src => (
            <option key={src} value={src === 'All Sources' ? '' : src}>
              {src}
            </option>
          ))}
        </select>
      </div>

      {/* Active User Skills */}
      {userSkills && userSkills.length > 0 && (
        <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Your Active Skills ({userSkills.length})
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
            {userSkills.map(skill => (
              <SkillTag
                key={`active-${skill}`}
                name={skill}
                type="matching"
                onRemove={onRemoveSkill}
              />
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
