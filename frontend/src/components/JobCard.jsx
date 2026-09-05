import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Check, X, ExternalLink } from 'lucide-react';

const JobCard = ({ job }) => {
  
  const getScoreClass = (score) => {
    if (score >= 80) return 'match-high';
    if (score >= 50) return 'match-medium';
    return 'match-low';
  };

  return (
    <div className="card job-card">
      <div className="job-card-header">
        <div>
          <h3 className="job-title">{job.title}</h3>
          <div className="job-company">{job.company}</div>
          
          <div className="job-meta">
            <span className="flex items-center gap-2"><MapPin size={14} /> {job.location}</span>
            <span className="flex items-center gap-2"><Briefcase size={14} /> {job.job_type}</span>
            <span style={{ fontWeight: '500' }}>{job.salary}</span>
          </div>
        </div>
        
        <div className={`match-score-badge ${getScoreClass(job.match_score)}`}>
          {job.match_score}% Match
        </div>
      </div>
      
      <div className="mt-4">
        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Skills Match:</div>
        <div className="flex" style={{ flexWrap: 'wrap' }}>
          {job.matching_skills.map(skill => (
            <span key={skill} className="skill-badge skill-matching">
              <Check size={12} /> {skill}
            </span>
          ))}
          {job.missing_skills.map(skill => (
            <span key={skill} className="skill-badge skill-missing">
              <X size={12} /> {skill}
            </span>
          ))}
        </div>
      </div>
      
      <div className="mt-4 flex justify-between items-center" style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Available on: </span>
          {job.sources.map(source => (
            <span key={source.name} className="source-badge" style={{ marginLeft: '0.5rem' }}>
              {source.name}
            </span>
          ))}
        </div>
        
        <div className="flex gap-4">
          <Link to={`/jobs/${job.id}`} className="btn btn-secondary">
            View Details
          </Link>
          <a href={job.sources[0].url} target="_blank" rel="noreferrer" className="btn btn-primary">
            Apply Now <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
