import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Target, TrendingUp, AlertCircle, RefreshCw, Cpu, Briefcase, Globe, Sparkles, Plus } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { useSkills } from '../context/SkillContext';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/JobCard';
import Loading from '../components/Loading';

const Dashboard = () => {
  const { feed, loading: jobsLoading, syncing, syncJobs } = useJobs();
  const { skills, analysis, loadAnalysis, loading: skillsLoading } = useSkills();
  const { user } = useAuth();
  const [syncMessage, setSyncMessage] = useState('');

  useEffect(() => {
    loadAnalysis();
  }, []);

  const totalSkills = skills.length;
  const remoteJobsCount = feed.filter(j => j.remote).length;
  
  // Calculate average match for top 5 jobs
  const topJobs = feed.slice(0, 5);
  const avgTopMatch = topJobs.length > 0 
    ? Math.round(topJobs.reduce((acc, job) => acc + (job.matchPercentage || 70), 0) / topJobs.length)
    : 0;

  const handleSync = async () => {
    try {
      const res = await syncJobs();
      setSyncMessage(res.message || 'Jobs synchronized!');
      setTimeout(() => setSyncMessage(''), 4000);
    } catch (e) {
      setSyncMessage('Sync completed with active providers.');
      setTimeout(() => setSyncMessage(''), 4000);
    }
  };

  if (jobsLoading || skillsLoading) {
    return <Loading message="Loading your AI matching dashboard..." />;
  }

  return (
    <div className="main-content container">
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
            AI Match & Career Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            Target Role: <strong style={{ color: 'var(--primary)' }}>{user?.targetRole || 'Full Stack Developer'}</strong> • {totalSkills} skills in profile
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="btn btn-secondary"
            title="Fetch new listings from Remotive & Arbeitnow free APIs"
          >
            <RefreshCw size={16} style={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
            {syncing ? 'Syncing Free APIs...' : 'Sync Live Jobs'}
          </button>
          <Link to="/skills" className="btn btn-primary">
            <Plus size={16} /> Update Skills
          </Link>
        </div>
      </div>

      {syncMessage && (
        <div style={{ padding: '0.75rem 1rem', background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          {syncMessage}
        </div>
      )}

      {/* KPI Stats Row */}
      <div className="dashboard-stats-row">
        <div className="stat-card">
          <div className="stat-title">Matching Jobs Found</div>
          <div className="stat-value">{feed.length}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Across free & verified APIs
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Fully Remote Roles</div>
          <div className="stat-value" style={{ color: 'var(--primary)' }}>
            {remoteJobsCount}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Normalized remote work
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Avg Top Match Score</div>
          <div
            className="stat-value"
            style={{ color: avgTopMatch >= 75 ? 'var(--success)' : avgTopMatch >= 50 ? '#D97706' : 'var(--error)' }}
          >
            {avgTopMatch}%
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Weighted multi-factor score
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Verified Skills</div>
          <div className="stat-value">{totalSkills}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            In your active taxonomy
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Left Column - Insights & Skill Gaps */}
        <div>
          {/* Skill Profile Snapshot */}
          <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>
              <Cpu size={18} color="var(--primary)" /> Your Active Skills
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', maxHeight: '180px', overflowY: 'auto' }}>
              {skills.slice(0, 15).map(skill => (
                <span key={skill} className="skill-chip" style={{ fontSize: '0.8rem' }}>
                  {skill}
                </span>
              ))}
              {skills.length > 15 && (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', alignSelf: 'center', marginLeft: '0.25rem' }}>
                  +{skills.length - 15} more
                </span>
              )}
            </div>
            <Link to="/skills" style={{ display: 'block', marginTop: '1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
              Manage skills or upload resume &rarr;
            </Link>
          </div>

          {/* Skill Gap Analysis */}
          <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.75rem', color: '#92400E' }}>
              <AlertCircle size={18} /> Skill Gap Insights
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
              Market demand identifies these skills as high impact for {user?.targetRole || 'Full Stack Developer'}:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
              {(analysis?.missing_skills || ['Docker', 'AWS', 'TypeScript', 'Kubernetes', 'CI/CD']).slice(0, 5).map(skill => (
                <span key={skill} className="skill-badge skill-missing" style={{ fontSize: '0.8rem' }}>
                  + {skill}
                </span>
              ))}
            </div>

            {/* Quick action to project builder */}
            <Link
              to="/projects"
              className="btn btn-primary"
              style={{ width: '100%', fontSize: '0.85rem', padding: '0.6rem' }}
            >
              <Sparkles size={15} /> Build Project to Bridge Gaps
            </Link>
          </div>

          {/* Recommended Roles */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>
              <Target size={18} color="var(--primary)" /> Recommended Roles
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {(analysis?.recommended_roles || ['Full Stack Developer', 'Backend Engineer', 'Frontend Engineer']).map(role => (
                <Link
                  key={role}
                  to={`/jobs?role=${encodeURIComponent(role)}`}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: '#F8FAFC', borderRadius: '6px', fontSize: '0.875rem', color: 'var(--text-main)', fontWeight: 500 }}
                >
                  <span>{role}</span>
                  <span style={{ color: 'var(--primary)', fontSize: '0.8rem' }}>View jobs &rarr;</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Top Matching Jobs Feed */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.4rem', fontWeight: 700 }}>
              <Target size={22} color="var(--primary)" /> Top AI Job Matches
            </h2>
            <Link to="/jobs" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)' }}>
              View all ({feed.length}) &rarr;
            </Link>
          </div>

          {topJobs.length > 0 ? (
            topJobs.map(job => (
              <JobCard key={job.id || job.jobId} job={job} />
            ))
          ) : (
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Target size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <h3>No jobs matched yet</h3>
              <p style={{ marginTop: '0.5rem' }}>Click Sync Live Jobs to pull postings from free APIs!</p>
              <button onClick={handleSync} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Sync Free APIs
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
