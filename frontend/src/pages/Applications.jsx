import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ExternalLink, CheckCircle2, Clock, XCircle, Trophy, RefreshCw } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';

const STATUS_CONFIG = {
  applied: { label: 'Applied', color: 'var(--primary)', bg: 'rgba(139, 92, 246, 0.12)', icon: Clock },
  interviewing: { label: 'Interviewing', color: 'var(--warning)', bg: 'rgba(245, 158, 11, 0.12)', icon: Briefcase },
  offer: { label: 'Offer Received!', color: 'var(--success)', bg: 'rgba(16, 185, 129, 0.12)', icon: Trophy },
  rejected: { label: 'Not Selected', color: 'var(--error)', bg: 'rgba(239, 68, 68, 0.12)', icon: XCircle },
};

const Applications = () => {
  const { applications, loading, refreshJobs } = useJobs();
  const { user } = useAuth();

  useEffect(() => {
    refreshJobs();
  }, []);

  if (!user) {
    return (
      <div className="main-content container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <Briefcase size={64} style={{ margin: '0 auto 1rem', opacity: 0.3, display: 'block' }} />
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>Track Your Applications</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Sign in to track your job applications, manage interview statuses, and monitor your job search progress.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/login" className="btn btn-primary">Sign In</Link>
          <Link to="/register" className="btn btn-secondary">Create Account</Link>
        </div>
      </div>
    );
  }

  if (loading) return <Loading message="Loading your applications..." />;

  const applied = applications.filter(a => a.status === 'applied');
  const interviewing = applications.filter(a => a.status === 'interviewing');
  const offers = applications.filter(a => a.status === 'offer');
  const rejected = applications.filter(a => a.status === 'rejected');

  return (
    <div className="main-content container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
            Application Tracker
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Track and manage all your job applications in one place.
          </p>
        </div>
        <button onClick={refreshJobs} className="btn btn-secondary" style={{ gap: '0.5rem' }}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {[
          { label: 'Total Applied', value: applications.length, color: 'var(--text-main)' },
          { label: 'Interviewing', value: interviewing.length, color: 'var(--warning)' },
          { label: 'Offers Received', value: offers.length, color: 'var(--success)' },
          { label: 'Not Selected', value: rejected.length, color: 'var(--error)' },
        ].map(stat => (
          <div key={stat.label} className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.25rem' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <EmptyState
          title="No Applications Tracked Yet"
          description="When you apply to jobs from the Jobs page, they will appear here. Start exploring matched jobs!"
          actionText="Browse Jobs"
          actionLink="/jobs"
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {applications.map((app) => {
            const statusCfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.applied;
            const StatusIcon = statusCfg.icon;
            const appliedDate = app.appliedDate ? new Date(app.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently';

            return (
              <div key={app._id || app.jobId} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {app.jobTitle}
                      </h3>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.25rem 0.7rem',
                          borderRadius: '9999px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          background: statusCfg.bg,
                          color: statusCfg.color,
                        }}
                      >
                        <StatusIcon size={12} /> {statusCfg.label}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.95rem' }}>
                      {app.company}
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={13} /> Applied on {appliedDate}
                    </p>
                    {app.notes && (
                      <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', marginTop: '0.6rem', padding: '0.6rem 0.85rem', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--primary)' }}>
                        {app.notes}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                    <Link
                      to={`/jobs`}
                      className="btn btn-outline"
                      style={{ fontSize: '0.825rem', padding: '0.4rem 0.85rem', gap: '0.35rem' }}
                    >
                      <ExternalLink size={13} /> View Similar Jobs
                    </Link>
                    {app.status !== 'offer' && app.status !== 'rejected' && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Keep applying! Success takes multiple attempts.
                      </span>
                    )}
                    {app.status === 'offer' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--success)', fontSize: '0.85rem', fontWeight: 700 }}>
                        <CheckCircle2 size={16} /> Congratulations! 🎉
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {applications.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '2.5rem', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          💡 <strong>Pro Tip:</strong> Consistent follow-ups after applying can increase your interview rate by 30%. Stay proactive!
        </div>
      )}
    </div>
  );
};

export default Applications;
