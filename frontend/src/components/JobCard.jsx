import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Globe, ExternalLink, Bookmark, CheckCircle, Calendar, Sparkles } from 'lucide-react';
import MatchScore from './MatchScore';
import SkillTag from './SkillTag';
import { useJobs } from '../context/JobContext';

const JobCard = ({ job }) => {
  const { isJobSaved, saveJob, removeSavedJob, hasApplied, applyToJob } = useJobs();
  
  const jobId = job.id || job.jobId;
  const saved = isJobSaved(jobId);
  const applied = hasApplied(jobId);
  
  const matched = job.matchedSkills || [];
  const missing = job.missingSkills || [];
  const allSkills = job.skills || [];
  
  const handleToggleSave = async (e) => {
    e.preventDefault();
    if (saved) {
      await removeSavedJob(jobId);
    } else {
      await saveJob(job);
    }
  };

  const handleQuickApply = async (e) => {
    e.preventDefault();
    if (!applied) {
      await applyToJob(job);
    }
    if (job.jobUrl) {
      window.open(job.jobUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div>
          <h3 className="job-title">
            <Link to={`/jobs/${jobId}`} style={{ color: 'inherit', textDecoration: 'none' }}>
              {job.title}
            </Link>
          </h3>
          <div className="job-company">{job.company}</div>
          
          <div className="job-meta">
            <span className="meta-item">
              <MapPin size={14} /> {job.location || 'Remote'}
            </span>
            {job.remote && (
              <span className="remote-pill">
                <Globe size={12} /> Remote
              </span>
            )}
            <span className="source-badge">{job.source || 'Aggregator'}</span>
            {job.postedAt && (
              <span className="meta-item">
                <Calendar size={13} /> {job.postedAt}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <MatchScore score={job.matchPercentage !== undefined ? job.matchPercentage : 70} />
          <button
            onClick={handleToggleSave}
            className="btn btn-secondary"
            style={{ padding: '0.5rem', color: saved ? 'var(--primary)' : 'var(--text-muted)' }}
            title={saved ? 'Remove from saved' : 'Save job'}
          >
            <Bookmark size={18} fill={saved ? 'var(--primary)' : 'none'} />
          </button>
        </div>
      </div>

      {/* Matching Reasons */}
      {job.matchingReasons && job.matchingReasons.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: '#4338CA', background: '#EEF2FF', padding: '0.4rem 0.75rem', borderRadius: '6px' }}>
          <Sparkles size={14} />
          <span>{job.matchingReasons[0]}</span>
        </div>
      )}

      {/* Skills breakdown */}
      <div>
        <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
          SKILLS BREAKDOWN:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {matched.map(s => (
            <SkillTag key={`matched-${s}`} name={s} type="matching" />
          ))}
          {missing.slice(0, 4).map(s => (
            <SkillTag key={`missing-${s}`} name={s} type="missing" />
          ))}
          {matched.length === 0 && missing.length === 0 && allSkills.slice(0, 6).map(s => (
            <SkillTag key={`neutral-${s}`} name={s} type="neutral" />
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', marginTop: '0.5rem' }}>
        <Link to={`/jobs/${jobId}`} style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)' }}>
          View Match Analysis &rarr;
        </Link>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={handleQuickApply}
            className={`btn ${applied ? 'btn-secondary' : 'btn-primary'}`}
            style={{ fontSize: '0.85rem' }}
          >
            {applied ? (
              <>
                <CheckCircle size={14} color="var(--success)" /> Applied (Open Portal)
              </>
            ) : (
              <>
                Apply on {job.source?.split(' ')[0] || 'Source'} <ExternalLink size={14} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
