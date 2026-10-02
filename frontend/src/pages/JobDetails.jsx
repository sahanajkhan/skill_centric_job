import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJobById } from '../services/api';
import { useJobs } from '../context/JobContext';
import { useSkills } from '../context/SkillContext';
import { MOCK_JOBS } from '../utils/constants';
import MatchScore from '../components/MatchScore';
import SkillTag from '../components/SkillTag';
import Loading from '../components/Loading';
import {
  MapPin,
  Briefcase,
  ArrowLeft,
  ExternalLink,
  Bookmark,
  CheckCircle,
  Globe,
  Sparkles,
  DollarSign,
  Calendar,
  Layers,
  Building,
  GraduationCap
} from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyNotes, setApplyNotes] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);

  const { isJobSaved, saveJob, removeSavedJob, hasApplied, applyToJob } = useJobs();
  const { skills: userSkills } = useSkills();

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await getJobById(id).catch(() => null);
        if (res && res.success && res.data) {
          setJob(res.data);
        } else {
          // Fallback to MOCK_JOBS
          const foundMock = MOCK_JOBS.find(j => String(j.id) === String(id) || j.jobId === id);
          if (foundMock) {
            setJob(foundMock);
          } else {
            // Default mock preview
            setJob(MOCK_JOBS[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch job details:', error);
        setJob(MOCK_JOBS[0]);
      }
      setLoading(false);
    };
    fetchJob();
  }, [id]);

  if (loading) return <Loading message="Loading job specifications & skill analysis..." />;
  if (!job) {
    return (
      <div className="main-content container text-center" style={{ padding: '4rem 1rem' }}>
        <h2>Job posting not found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>The job listing may have expired or was removed by the source provider.</p>
        <Link to="/jobs" className="btn btn-primary">
          <ArrowLeft size={16} /> Back to Job Search
        </Link>
      </div>
    );
  }

  const jobId = job.id || job.jobId || id;
  const saved = isJobSaved(jobId);
  const applied = hasApplied(jobId);

  // Dynamic matching against active user skills
  const jobSkills = job.skills || job.required_skills || [];
  const userSkillLower = new Set((userSkills || []).map(s => s.toLowerCase()));
  const matchedSkills = jobSkills.filter(s => userSkillLower.has(s.toLowerCase()));
  const missingSkills = jobSkills.filter(s => !userSkillLower.has(s.toLowerCase()));
  const matchPercentage = job.matchPercentage !== undefined
    ? job.matchPercentage
    : (job.match_score !== undefined ? job.match_score : (jobSkills.length ? Math.round((matchedSkills.length / jobSkills.length) * 100) : 75));

  const handleToggleSave = async () => {
    if (saved) {
      await removeSavedJob(jobId);
    } else {
      await saveJob(job);
    }
  };

  const handleApply = async () => {
    await applyToJob(job, applyNotes);
    setShowApplyModal(false);
    const targetUrl = job.jobUrl || job.sources?.[0]?.url || 'https://remotive.com';
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="main-content container" style={{ maxWidth: '960px' }}>
      <Link to="/jobs" className="btn btn-secondary" style={{ marginBottom: '1.5rem', gap: '0.5rem' }}>
        <ArrowLeft size={16} /> Back to Job Listings
      </Link>

      {/* Main Header Card */}
      <div className="card" style={{ marginBottom: '1.75rem', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '1.25rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
              {job.title}
            </h1>
            <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building size={18} color="var(--primary)" /> {job.company}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <MatchScore score={matchPercentage} />
            <button
              onClick={handleToggleSave}
              className="btn btn-secondary"
              style={{ padding: '0.65rem', color: saved ? 'var(--primary)' : 'var(--text-muted)' }}
              title={saved ? 'Remove bookmark' : 'Bookmark job'}
            >
              <Bookmark size={20} fill={saved ? 'var(--primary)' : 'none'} />
            </button>
          </div>
        </div>

        {/* Metadata badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', padding: '1.25rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <span className="meta-item">
            <MapPin size={16} /> {job.location || 'Remote'}
          </span>
          {job.remote && (
            <span className="remote-pill">
              <Globe size={12} /> 100% Remote
            </span>
          )}
          <span className="meta-item">
            <Briefcase size={16} /> {job.employmentType || job.job_type || 'Full-time'}
          </span>
          <span className="meta-item">
            <GraduationCap size={16} /> {job.experience || 'Mid Level'}
          </span>
          <span className="meta-item">
            <DollarSign size={16} /> {job.salary || 'Competitive'}
          </span>
          <span className="source-badge">Source: {job.source || job.sources?.[0]?.name || 'Aggregator'}</span>
        </div>

        {/* AI Transparent Match Breakdown */}
        <div style={{ margin: '1.75rem 0' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            <Sparkles size={20} color="var(--primary)" /> Transparent Skill Match Analysis
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {/* Matched */}
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--success)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                MATCHING SKILLS ({matchedSkills.length})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {matchedSkills.length > 0 ? (
                  matchedSkills.map(s => <SkillTag key={`matched-detail-${s}`} name={s} type="matching" />)
                ) : (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>None of your active skills match the listed requirements yet.</span>
                )}
              </div>
            </div>

            {/* Missing */}
            <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--warning)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                SKILL GAPS TO LEARN ({missingSkills.length})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {missingSkills.length > 0 ? (
                  missingSkills.map(s => <SkillTag key={`missing-detail-${s}`} name={s} type="missing" />)
                ) : (
                  <span style={{ fontSize: '0.85rem', color: 'var(--success)' }}>You possess 100% of the listed skill requirements!</span>
                )}
              </div>
            </div>
          </div>

          {missingSkills.length > 0 && (
            <div style={{ marginTop: '1.25rem', padding: '1rem 1.25rem', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500 }}>
                Want to bridge these missing skills ({missingSkills.slice(0, 3).join(', ')})?
              </span>
              <Link to="/projects" className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                Generate Portfolio Project &rarr;
              </Link>
            </div>
          )}
        </div>

        {/* CTA Bar */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
          <button
            onClick={() => setShowApplyModal(true)}
            className="btn btn-primary"
            style={{ padding: '0.85rem 2rem', fontSize: '1rem', gap: '0.6rem' }}
          >
            {applied ? 'Re-Apply / Open Source Portal' : 'Apply on Original Platform'} <ExternalLink size={18} />
          </button>
        </div>
      </div>

      {/* Description Card */}
      <div className="card" style={{ marginBottom: '1.75rem', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>Job Description & Overview</h2>
        <div style={{ color: 'var(--text-main)', lineHeight: 1.75, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
          {job.description || 'No detailed job description provided.'}
        </div>

        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '2rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
          All Extracted Skill Requirements
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {jobSkills.map(s => (
            <span key={s} className="skill-chip" style={{ fontSize: '0.85rem' }}>{s}</span>
          ))}
        </div>
      </div>

      {/* Direct Source Link Card */}
      <div className="card text-center" style={{ padding: '2.5rem 2rem', background: 'rgba(30, 41, 59, 0.5)' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Verified Source Listing
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', maxWidth: '540px', margin: '0 auto 1.5rem auto', lineHeight: 1.6 }}>
          Skill-Centric aggregates listings transparently from open developer endpoints and directs all candidate submissions to the original career portal.
        </p>
        <a
          href={job.jobUrl || job.sources?.[0]?.url || 'https://remotive.com'}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ padding: '0.8rem 2rem', gap: '0.5rem' }}
        >
          Open Listing on {job.source || job.sources?.[0]?.name || 'Provider'} <ExternalLink size={16} />
        </a>
      </div>

      {/* Apply Track Modal */}
      {showApplyModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '2rem', background: '#1E293B', border: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              Track Application for {job.company}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              We will log this application in your personal tracker and open the verified job portal in a new tab.
            </p>

            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              Optional Application Notes:
            </label>
            <textarea
              rows={3}
              value={applyNotes}
              onChange={(e) => setApplyNotes(e.target.value)}
              placeholder="e.g. Applied with tailored Fullstack resume version via Remotive..."
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', color: 'var(--text-main)', fontFamily: 'inherit', marginBottom: '1.5rem' }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setShowApplyModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleApply} className="btn btn-primary" style={{ gap: '0.5rem' }}>
                Proceed to Portal <ExternalLink size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
