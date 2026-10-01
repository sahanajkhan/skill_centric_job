import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RefreshCw, Globe, SlidersHorizontal, AlertCircle, CheckCircle } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { useSkills } from '../context/SkillContext';
import JobCard from '../components/JobCard';
import Loading from '../components/Loading';

const Jobs = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || '';
  
  const { feed, jobs, loading, syncing, syncJobs, refreshJobs } = useJobs();
  const { skills } = useSkills();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState(initialRole);
  const [remoteFilter, setRemoteFilter] = useState('all'); // all, remote, onsite
  const [minMatch, setMinMatch] = useState(0);
  const [sourceFilter, setSourceFilter] = useState('All');
  const [skillFilter, setSkillFilter] = useState('');
  const [syncStatus, setSyncStatus] = useState('');

  const displayList = feed.length > 0 ? feed : jobs;

  const handleSync = async () => {
    try {
      const res = await syncJobs();
      setSyncStatus(`Updated ${res.count || 'live'} jobs from free APIs!`);
      setTimeout(() => setSyncStatus(''), 4000);
    } catch (e) {
      setSyncStatus('Refreshed job sources.');
      setTimeout(() => setSyncStatus(''), 4000);
    }
  };

  const filteredJobs = displayList.filter(job => {
    const titleMatch = (job.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const companyMatch = (job.company || '').toLowerCase().includes(searchTerm.toLowerCase());
    const descMatch = (job.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const jobSkills = job.skills || [];
    const skillsMatch = jobSkills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSearch = !searchTerm || titleMatch || companyMatch || descMatch || skillsMatch;

    const matchesRole = !roleFilter || (job.title || '').toLowerCase().includes(roleFilter.toLowerCase());

    const matchesRemote =
      remoteFilter === 'all'
        ? true
        : remoteFilter === 'remote'
        ? Boolean(job.remote)
        : !job.remote;

    const matchesScore = (job.matchPercentage !== undefined ? job.matchPercentage : 60) >= minMatch;

    const matchesSource =
      sourceFilter === 'All'
        ? true
        : (job.source || '').toLowerCase().includes(sourceFilter.toLowerCase());

    const matchesSkill =
      !skillFilter ||
      jobSkills.some(s => s.toLowerCase() === skillFilter.toLowerCase());

    return matchesSearch && matchesRole && matchesRemote && matchesScore && matchesSource && matchesSkill;
  }).sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));

  // Extract unique sources and skills for filter dropdowns
  const availableSources = Array.from(new Set(displayList.map(j => j.source?.split(' ')[0]).filter(Boolean)));
  const availableSkills = Array.from(new Set(displayList.flatMap(j => j.skills || []))).slice(0, 20);

  return (
    <div className="main-content container">
      {/* Page Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
            Live Job Postings & Match Ranking
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Aggregated from official free job APIs (Remotive, Arbeitnow), normalized and scored against your active skills.
          </p>
        </div>

        <button
          onClick={handleSync}
          disabled={syncing}
          className="btn btn-secondary"
          title="Fetch latest postings from free APIs"
        >
          <RefreshCw size={16} style={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
          {syncing ? 'Syncing Free APIs...' : 'Sync Live Jobs'}
        </button>
      </div>

      {syncStatus && (
        <div style={{ padding: '0.75rem 1rem', background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={16} /> {syncStatus}
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
          {/* Main search bar */}
          <div style={{ flex: '1 1 300px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="search-input"
              placeholder="Search by title, skill (e.g. React, Python), or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Remote Toggle */}
          <div style={{ display: 'inline-flex', background: '#F1F5F9', padding: '0.25rem', borderRadius: '8px' }}>
            <button
              onClick={() => setRemoteFilter('all')}
              style={{ padding: '0.4rem 0.85rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, background: remoteFilter === 'all' ? '#FFFFFF' : 'transparent', color: remoteFilter === 'all' ? 'var(--primary)' : 'var(--text-muted)', boxShadow: remoteFilter === 'all' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none' }}
            >
              All Types
            </button>
            <button
              onClick={() => setRemoteFilter('remote')}
              style={{ padding: '0.4rem 0.85rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, background: remoteFilter === 'remote' ? '#FFFFFF' : 'transparent', color: remoteFilter === 'remote' ? 'var(--primary)' : 'var(--text-muted)', boxShadow: remoteFilter === 'remote' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none' }}
            >
              Remote Only
            </button>
            <button
              onClick={() => setRemoteFilter('onsite')}
              style={{ padding: '0.4rem 0.85rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, background: remoteFilter === 'onsite' ? '#FFFFFF' : 'transparent', color: remoteFilter === 'onsite' ? 'var(--primary)' : 'var(--text-muted)', boxShadow: remoteFilter === 'onsite' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none' }}
            >
              On-site / Hybrid
            </button>
          </div>
        </div>

        {/* Secondary Filters */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="select-filter"
            >
              <option value="">All Roles</option>
              <option value="Full Stack">Full Stack</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Developer">Developer / Engineer</option>
              <option value="Python">Python</option>
              <option value="React">React</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Specific Skill:</span>
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="select-filter"
            >
              <option value="">Any Skill</option>
              {availableSkills.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Source:</span>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="select-filter"
            >
              <option value="All">All Free APIs</option>
              {availableSources.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Min Match:</span>
            <select
              value={minMatch}
              onChange={(e) => setMinMatch(Number(e.target.value))}
              className="select-filter"
            >
              <option value={0}>All Scores</option>
              <option value={50}>50%+</option>
              <option value={70}>70%+</option>
              <option value={85}>85%+</option>
            </select>
          </div>

          {(searchTerm || roleFilter || remoteFilter !== 'all' || minMatch > 0 || sourceFilter !== 'All' || skillFilter) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('');
                setRemoteFilter('all');
                setMinMatch(0);
                setSourceFilter('All');
                setSkillFilter('');
              }}
              style={{ fontSize: '0.825rem', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', marginLeft: 'auto' }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
          Showing <strong>{filteredJobs.length}</strong> matching opportunities
        </div>
      </div>

      {/* Jobs List */}
      <div>
        {loading ? (
          <Loading message="Fetching live job listings..." />
        ) : filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <JobCard key={job.id || job.jobId} job={job} />
          ))
        ) : (
          <div className="card text-center" style={{ padding: '3.5rem 1.5rem', color: 'var(--text-muted)' }}>
            <AlertCircle size={44} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No jobs matched your current criteria</h3>
            <p style={{ maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
              Try broadening your search, resetting the minimum match score, or clicking "Sync Live Jobs" to fetch new postings.
            </p>
            <button onClick={handleSync} className="btn btn-primary">
              <RefreshCw size={15} /> Fetch New Jobs from Free APIs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
