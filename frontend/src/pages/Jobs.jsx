import React, { useState, useEffect } from 'react';
import { getRecommendations } from '../services/api';
import JobCard from '../components/JobCard';
import { Search } from 'lucide-react';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [minMatch, setMinMatch] = useState(0);
  const [sourceFilter, setSourceFilter] = useState('All');

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await getRecommendations();
        setJobs(res.data);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.required_skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesScore = job.match_score >= minMatch;
    
    const matchesSource = sourceFilter === 'All' ? true : job.sources.some(s => s.name === sourceFilter);
    
    return matchesSearch && matchesScore && matchesSource;
  }).sort((a, b) => b.match_score - a.match_score);

  return (
    <div className="main-content container">
      <div className="text-center mb-8">
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Jobs Matching Your Skills</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>
          Jobs collected from multiple platforms and ranked according to your skill profile.
        </p>
      </div>

      <div className="card mb-8">
        <div className="flex gap-4 items-center" style={{ flexWrap: 'wrap' }}>
          <div style={{ flex: 1, position: 'relative', minWidth: '250px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search job title, skill or company..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
            />
          </div>
          
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Minimum Match:</span>
              <select 
                value={minMatch} 
                onChange={(e) => setMinMatch(Number(e.target.value))}
                style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
              >
                <option value={0}>All Matches</option>
                <option value={50}>50%+</option>
                <option value={70}>70%+</option>
                <option value={90}>90%+</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Source:</span>
              <select 
                value={sourceFilter} 
                onChange={(e) => setSourceFilter(e.target.value)}
                style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
              >
                <option value="All">All Sources</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Indeed">Indeed</option>
                <option value="Naukri">Naukri</option>
                <option value="Internshala">Internshala</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {loading ? (
          <div className="text-center p-8">Loading matching jobs...</div>
        ) : filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))
        ) : (
          <div className="card text-center p-8">
            <h3 style={{ marginBottom: '1rem' }}>No jobs found</h3>
            <p style={{ color: 'var(--text-muted)' }}>Try lowering your minimum match score or changing your search filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
