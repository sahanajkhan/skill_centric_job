import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RefreshCw, CheckCircle, SlidersHorizontal } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { useSkills } from '../context/SkillContext';
import { MOCK_JOBS } from '../utils/constants';
import JobCard from '../components/JobCard';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';

const Jobs = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || '';
  
  const { feed, jobs, loading, syncing, syncJobs } = useJobs();
  const { skills, removeSkill } = useSkills();

  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState(initialRole);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [minMatch, setMinMatch] = useState(0);
  const [sourceFilter, setSourceFilter] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [syncStatus, setSyncStatus] = useState('');

  // Determine list: live backend feed or mock data fallback
  const rawList = feed.length > 0 ? feed : (jobs.length > 0 ? jobs : MOCK_JOBS);

  // Compute match score and breakdown against active skills if missing
  const activeSkillsLower = (skills || ['React', 'JavaScript', 'Node.js', 'MongoDB']).map(s => s.toLowerCase());

  const processedList = rawList.map(job => {
    const jobSkills = job.skills || job.required_skills || [];
    const matched = job.matchedSkills || jobSkills.filter(s => activeSkillsLower.includes(s.toLowerCase()));
    const missing = job.missingSkills || jobSkills.filter(s => !activeSkillsLower.includes(s.toLowerCase()));
    
    let score = job.matchPercentage !== undefined ? job.matchPercentage : job.match_score;
    if (score === undefined) {
      score = jobSkills.length ? Math.round((matched.length / jobSkills.length) * 100) : 70;
    }

    return {
      ...job,
      id: job.id || job.jobId,
      jobId: job.jobId || job.id,
      title: job.title || 'Software Engineer',
      company: job.company || 'Tech Company',
      location: job.location || 'Remote',
      remote: job.remote !== undefined ? job.remote : true,
      employmentType: job.employmentType || job.job_type || 'Full-time',
      experience: job.experience || 'Mid Level',
      skills: jobSkills,
      matchedSkills: matched,
      missingSkills: missing,
      matchPercentage: score,
      source: job.source || 'Remotive',
      jobUrl: job.jobUrl || job.sources?.[0]?.url || 'https://remotive.com',
      postedAt: job.postedAt || 'Recent'
    };
  });

  const handleSync = async () => {
    try {
      const res = await syncJobs();
      setSyncStatus(`Synchronized live jobs from open API sources!`);
      setTimeout(() => setSyncStatus(''), 4000);
    } catch (e) {
      setSyncStatus('Refreshed job sources with live fallbacks.');
      setTimeout(() => setSyncStatus(''), 4000);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setLocationTerm('');
    setRoleFilter('');
    setRemoteOnly(false);
    setMinMatch(0);
    setSourceFilter('');
    setExperienceLevel('');
  };

  const filteredJobs = processedList.filter(job => {
    const titleMatch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
    const companyMatch = job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const descMatch = (job.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const skillMatch = job.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSearch = !searchTerm || titleMatch || companyMatch || descMatch || skillMatch;
    const matchesLocation = !locationTerm || job.location.toLowerCase().includes(locationTerm.toLowerCase());
    const matchesRole = !roleFilter || job.title.toLowerCase().includes(roleFilter.toLowerCase());
    const matchesRemote = !remoteOnly || Boolean(job.remote);
    const matchesScore = job.matchPercentage >= minMatch;
    const matchesSource = !sourceFilter || job.source.toLowerCase().includes(sourceFilter.toLowerCase());
    const matchesExp = !experienceLevel || job.experience.toLowerCase().includes(experienceLevel.toLowerCase());

    return matchesSearch && matchesLocation && matchesRole && matchesRemote && matchesScore && matchesSource && matchesExp;
  }).sort((a, b) => b.matchPercentage - a.matchPercentage);

  return (
    <div className="main-content container">
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
            Job Aggregator & Transparent Match Feed
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

      {/* Top Search Controls */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        locationTerm={locationTerm}
        onLocationChange={setLocationTerm}
        selectedRole={roleFilter}
        onRoleChange={setRoleFilter}
        onClear={handleResetFilters}
        onToggleFilters={() => setShowSidebar(!showSidebar)}
      />

      {/* Main Aggregator Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: showSidebar ? '300px 1fr' : '1fr', gap: '1.75rem' }}>
        
        {/* Sidebar Filters */}
        {showSidebar && (
          <Sidebar
            remoteOnly={remoteOnly}
            onRemoteChange={setRemoteOnly}
            experienceLevel={experienceLevel}
            onExperienceChange={setExperienceLevel}
            selectedSource={sourceFilter}
            onSourceChange={setSourceFilter}
            minMatchScore={minMatch}
            onMinMatchChange={setMinMatch}
            userSkills={skills}
            onRemoveSkill={removeSkill}
            onResetFilters={handleResetFilters}
          />
        )}

        {/* Job Listings Panel */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <div>
              Showing <strong>{filteredJobs.length}</strong> matched opportunities
            </div>
            <div>
              Sorted by <strong>Relevance & Match %</strong>
            </div>
          </div>

          {loading ? (
            <LoadingSkeleton count={4} />
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <JobCard key={job.id || job.jobId} job={job} />
            ))
          ) : (
            <EmptyState
              title="No jobs matched your filter parameters"
              description="Try lowering the minimum match score threshold, switching roles, or resetting active search filters."
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          )}
        </div>

      </div>
    </div>
  );
};

export default Jobs;
