import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, CheckCircle, ExternalLink, Trash2, Calendar, MapPin, Briefcase, Inbox } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import JobCard from '../components/JobCard';
import EmptyState from '../components/EmptyState';

const SavedJobs = () => {
  const { savedJobs, applications, removeSavedJob } = useJobs();
  const [activeTab, setActiveTab] = useState('saved'); // 'saved' or 'applied'

  return (
    <div className="main-content container" style={{ maxWidth: '980px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
          Saved Bookmarks & Application Pipeline
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Track saved opportunity bookmarks and manage your submitted application history.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border)', marginBottom: '1.75rem' }}>
        <button
          onClick={() => setActiveTab('saved')}
          style={{
            padding: '0.85rem 1.4rem',
            fontWeight: 700,
            fontSize: '0.95rem',
            color: activeTab === 'saved' ? 'var(--primary-hover)' : 'var(--text-muted)',
            borderBottom: activeTab === 'saved' ? '2px solid var(--primary)' : '2px solid transparent',
            background: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'var(--transition)'
          }}
        >
          <Bookmark size={18} /> Bookmarked Jobs ({savedJobs.length})
        </button>
        <button
          onClick={() => setActiveTab('applied')}
          style={{
            padding: '0.85rem 1.4rem',
            fontWeight: 700,
            fontSize: '0.95rem',
            color: activeTab === 'applied' ? 'var(--primary-hover)' : 'var(--text-muted)',
            borderBottom: activeTab === 'applied' ? '2px solid var(--primary)' : '2px solid transparent',
            background: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'var(--transition)'
          }}
        >
          <CheckCircle size={18} /> Applications Pipeline ({applications.length})
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'saved' ? (
        <div>
          {savedJobs.length > 0 ? (
            savedJobs.map(item => {
              const job = item.jobDetails || { id: item.jobId, title: 'Job Listing', company: 'Company' };
              return (
                <div key={item.jobId} style={{ position: 'relative' }}>
                  <JobCard job={{ ...job, id: item.jobId }} />
                </div>
              );
            })
          ) : (
            <EmptyState
              icon={Bookmark}
              title="No bookmarked jobs saved"
              description="Browse matching job postings and click the bookmark icon on any job card to save it for review."
              actionText="Explore Live Jobs"
              onAction={() => window.location.href = '/jobs'}
            />
          )}
        </div>
      ) : (
        <div>
          {applications.length > 0 ? (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Role Title</th>
                    <th>Date Applied</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map(app => (
                    <tr key={app.jobId || app._id}>
                      <td><strong>{app.company}</strong></td>
                      <td>{app.jobTitle}</td>
                      <td>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Calendar size={14} /> {new Date(app.appliedDate || Date.now()).toLocaleDateString()}
                        </span>
                      </td>
                      <td>
                        <span className="badge-free" style={{ textTransform: 'capitalize', fontSize: '0.8rem' }}>
                          {app.status || 'Applied'}
                        </span>
                      </td>
                      <td>
                        <Link to={`/jobs/${app.jobId}`} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                          View Match &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={CheckCircle}
              title="No logged applications yet"
              description="When you click 'Apply' on any job card, we will log your outreach here to help you manage your job search pipeline."
              actionText="Browse Jobs to Apply"
              onAction={() => window.location.href = '/jobs'}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
