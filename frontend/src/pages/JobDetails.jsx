import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJobById } from '../services/api';
import { useJobs } from '../context/JobContext';
import { useSkills } from '../context/SkillContext';
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
  Layers
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
        const res = await getJobById(id);
        if (res.success && res.data) {
          setJob(res.data);
        } else if (res.data) {
          setJob(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch job details:', error);
      }
      setLoading(false);
    };
    fetchJob();
  }, [id]);

  if (loading) return <Loading message="Loading job specifications..." />;
  if (!job) {
    return (
      <div className="main-content container text-center" style={{ padding: '4rem 1rem' }}>
        <h2>Job posting not found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>The job listing may have expired or was removed by the source.</p>
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
  const jobSkills = job.skills || [];
  const userSkillLower = new Set(userSkills.map(s => s.toLowerCase()));
  const matchedSkills = jobSkills.filter(s => userSkillLower.has(s.toLowerCase()));
  const missingSkills = jobSkills.filter(s => !userSkillLower.has(s.toLowerCase()));
  const matchPercentage = job.matchPercentage !== undefined
    ? job.matchPercentage
    : (jobSkills.length ? Math.round((matchedSkills.length / jobSkills.length) * 100) : 70);

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
    if (job.jobUrl) {
      window.open(job.jobUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="main-content container" style={{ maxWidth: '920px' }}>
      <Link to="/jobs" className="btn btn-secondary" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Job Listings
      </Link>

      {/* Main Header Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              {job.title}
            </h1>
            <div style={{ fontSize: '1.15rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {job.company}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <MatchScore score={matchPercentage} />
            <button
              onClick={handleToggleSave}
              className="btn btn-secondary"
              style={{ padding: '0.6rem', color: saved ? 'var(--primary)' : 'var(--text-muted)' }}
              title={saved ? 'Remove bookmark' : 'Bookmark job'}
            >
              <Bookmark size={20} fill={saved ? 'var(--primary)' : 'none'} />
            </button>
          </div>
        </div>

        {/* Metadata badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', padding: '1rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <span className="meta-item">
            <MapPin size={16} /> {job.location || 'Remote'}
          </span>
          {job.remote && (
            <span className="remote-pill">
              <Globe size={12} /> 100% Remote
            </span>
          )}
          <span className="meta-item">
            <Briefcase size={16} /> {job.employmentType || 'Full-time'}
          </span>
          <span className="meta-item">
            <DollarSign size={16} /> {job.salary || 'Market Rate'}
          </span>
          <span className="meta-item">
            <Calendar size={16} /> Posted: {job.postedAt || 'Recent'}
          </span>
          <span className="source-badge">Source: {job.source || 'Aggregator'}</span>
        </div>

        {/* AI Transparent Match Breakdown */}
        <div style={{ margin: '1.5rem 0' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
            <Sparkles size={18} color="var(--primary)" /> Transparent Skill Match Analysis
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Matched */}
            <div style={{ background: '#F0FDF4', padding: '1rem', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#166534', marginBottom: '0.5rem' }}>
                MATCHING SKILLS ({matchedSkills.length})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {matchedSkills.length > 0 ? (
                  matchedSkills.map(s => <SkillTag key={s} name={s} type="matching" />)
                ) : (
                  <span style={{ fontSize: '0.85rem', color: '#166534' }}>None of your active skills match the listed requirements yet.</span>
                )}
              </div>
            </div>

            {/* Missing */}
            <div style={{ background: '#FEF2F2', padding: '1rem', borderRadius: '8px', border: '1px solid #FECACA' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#991B1B', marginBottom: '0.5rem' }}>
                SKILL GAPS TO LEARN ({missingSkills.length})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {missingSkills.length > 0 ? (
                  missingSkills.map(s => <SkillTag key={s} name={s} type="missing" />)
                ) : (
                  <span style={{ fontSize: '0.85rem', color: 'var(--success)' }}>You meet 100% of the listed tech skills!</span>
                )}
              </div>
            </div>
          </div>

          {missingSkills.length > 0 && (
            <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: '#EEF2FF', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#4338CA' }}>
                Want to bridge these missing skills ({missingSkills.slice(0, 3).join(', ')})?
              </span>
              <Link to="/projects" className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
                Generate Portfolio Project &rarr;
              </Link>
            </div>
          )}
        </div>

        {/* CTA Bar */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
          <button
            onClick={() => setShowApplyModal(true)}
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.75rem', fontSize: '1rem' }}
          >
            {applied ? 'Re-Apply / Open Source Portal' : 'Apply on Original Platform'} <ExternalLink size={16} />
          </button>
        </div>
      </div>

      {/* Description Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Job Description</h2>
        <div style={{ color: 'var(--text-main)', lineHeight: 1.7, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
          {job.description || 'No additional description provided.'}
        </div>

        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginTop: '1.75rem', marginBottom: '0.75rem' }}>
          All Extracted Skill Requirements
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {jobSkills.map(s => (
            <span key={s} className="skill-chip">{s}</span>
          ))}
        </div>
      </div>

      {/* Direct Source Link Card */}
      <div className="card text-center" style={{ background: '#F8FAFC', padding: '2rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Verified Public Listing
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto 1.25rem auto' }}>
          Skill-Centric directs all candidate applications transparently to the original posting source.
        </p>
        <a
          href={job.jobUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ padding: '0.75rem 1.75rem' }}
        >
          Open Listing on {job.source || 'Provider'} <ExternalLink size={16} />
        </a>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Track Application for {job.company}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              We will log this in your <strong>Saved & Applied Jobs</strong> tracker and open the job portal for you.
            </p>

            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Optional Notes (e.g. customized resume version, referral):
            </label>
            <textarea
              rows={3}
              value={applyNotes}
              onChange={(e) => setApplyNotes(e.target.value)}
              placeholder="e.g. Applied via Remotive with updated Fullstack resume..."
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)', fontFamily: 'inherit', marginBottom: '1.5rem' }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setShowApplyModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleApply} className="btn btn-primary">
                Proceed to {job.source?.split(' ')[0] || 'Portal'} <ExternalLink size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
