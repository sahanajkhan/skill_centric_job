import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJobById } from '../services/api';
import { MapPin, Briefcase, Check, X, ArrowLeft, ExternalLink } from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await getJobById(id);
        setJob(res.data);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchJob();
  }, [id]);

  if (loading) return <div className="container mt-8 text-center">Loading job details...</div>;
  if (!job) return <div className="container mt-8 text-center">Job not found.</div>;

  return (
    <div className="main-content container" style={{ maxWidth: '900px' }}>
      <Link to="/jobs" className="btn btn-secondary mb-4">
        <ArrowLeft size={16} /> Back to Search
      </Link>
      
      <div className="card mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.25rem' }}>{job.title}</h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)' }}>{job.company}</p>
          </div>
          <div className="match-score-badge match-high" style={{ padding: '0.75rem 1.5rem', fontSize: '1.25rem' }}>
            {job.match_score}% Match
          </div>
        </div>
        
        <div className="flex gap-4 mb-6" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
          <span className="flex items-center gap-2"><MapPin size={16} /> {job.location}</span>
          <span className="flex items-center gap-2"><Briefcase size={16} /> {job.job_type}</span>
          <span style={{ fontWeight: '500', color: 'var(--text-main)' }}>{job.salary}</span>
          <span>{job.experience} exp.</span>
        </div>
        
        <div className="mb-6">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Your Skill Match</h2>
          
          <div className="flex gap-8">
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Matching Skills</h3>
              <div className="flex" style={{ flexWrap: 'wrap' }}>
                {job.matching_skills.map(skill => (
                  <span key={skill} className="skill-badge skill-matching"><Check size={14} /> {skill}</span>
                ))}
              </div>
            </div>
            
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Missing Skills</h3>
              <div className="flex" style={{ flexWrap: 'wrap' }}>
                {job.missing_skills.length > 0 ? (
                  job.missing_skills.map(skill => (
                    <span key={skill} className="skill-badge skill-missing"><X size={14} /> {skill}</span>
                  ))
                ) : (
                  <span style={{ color: 'var(--success)', fontSize: '0.875rem' }}>You have all required skills!</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card mb-8">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Job Description</h2>
        <p style={{ color: 'var(--text-muted)', whiteSpace: 'pre-line', marginBottom: '2rem' }}>
          {job.description}
        </p>
        
        <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Required Skills</h3>
        <div className="flex" style={{ flexWrap: 'wrap' }}>
          {job.required_skills.map(skill => (
            <span key={skill} className="skill-chip">{skill}</span>
          ))}
        </div>
      </div>
      
      <div className="card text-center" style={{ backgroundColor: 'var(--bg-page)' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Apply on Original Platform</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          We found this job available on the following platforms:
        </p>
        
        <div className="flex justify-center gap-4" style={{ flexWrap: 'wrap' }}>
          {job.sources.map(source => (
            <a 
              key={source.name} 
              href={source.url} 
              target="_blank" 
              rel="noreferrer"
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.5rem' }}
            >
              Open on {source.name} <ExternalLink size={16} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
