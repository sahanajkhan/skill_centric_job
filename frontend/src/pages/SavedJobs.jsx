import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, CheckCircle, ExternalLink, Trash2, Calendar, MapPin, Briefcase } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import JobCard from '../components/JobCard';

const SavedJobs = () => {
  const { savedJobs, applications, removeSavedJob } = useJobs();
  const [activeTab, setActiveTab] = useState('saved'); // 'saved' or 'applied'

  return (
    <div className="main-content container" style={{ maxWidth: '960px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
          Saved & Applied Opportunities
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Track bookmarked positions and monitor your job application pipeline.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveTab('saved')}
          style={{
            padding: '0.75rem 1.25rem',
            fontWeight: 700,
            fontSize: '0.95rem',
            color: activeTab === 'saved' ? 'var(--primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'saved' ? '2px solid var(--primary)' : '2px solid transparent',
            background: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Bookmark size={16} /> Saved Jobs ({savedJobs.length})
        </button>
        <button
          onClick={() => setActiveTab('applied')}
          style={{
            padding: '0.75rem 1.25rem',
            fontWeight: 700,
            fontSize: '0.95rem',
            color: activeTab === 'applied' ? 'var(--primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'applied' ? '2px solid var(--primary)' : '2px solid transparent',
            background: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <CheckCircle size={16} /> Applications Log ({applications.length})
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
            <div className="card text-center" style={{ padding: '3.5rem 1.5rem', color: 'var(--text-muted)' }}>
              <Bookmark size={44} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>No saved jobs yet</h3>
              <p style={{ maxWidth: '400px', margin: '0 auto 1.25rem auto' }}>
                Browse matching opportunities and click the bookmark icon on any job card to save it here.
              </p>
              <Link to="/jobs" className="btn btn-primary">
                Explore Jobs
              </Link>
            </div>
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
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Calendar size={13} /> {new Date(app.appliedDate || Date.now()).toLocaleDateString()}
                        </span>
                      </td>
                      <td>
                        <span className="badge-free" style={{ textTransform: 'capitalize' }}>
                          {app.status || 'Applied'}
                        </span>
                      </td>
                      <td>
                        <Link to={`/jobs/${app.jobId}`} className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>
                          View Job &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="card text-center" style={{ padding: '3.5rem 1.5rem', color: 'var(--text-muted)' }}>
              <CheckCircle size={44} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>No logged applications</h3>
              <p style={{ maxWidth: '400px', margin: '0 auto 1.25rem auto' }}>
                When you click "Apply" on any job card, we will record it here so you can keep track of your outreach.
              </p>
              <Link to="/jobs" className="btn btn-primary">
                Explore Jobs
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
