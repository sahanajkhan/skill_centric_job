import React, { useEffect } from 'react';
import { useJobs } from '../context/JobContext';
import { useSkills } from '../context/SkillContext';
import JobCard from '../components/JobCard';
import { Target, TrendingUp, AlertCircle } from 'lucide-react';
import { calculateMatchScore } from '../utils/helpers';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { feed, loading: jobsLoading } = useJobs();
  const { skills, loading: skillsLoading } = useSkills();

  // Quick stats
  const totalSkills = skills.length;
  
  // Calculate average match for top 5 jobs
  const topJobs = [...feed]
    .map(job => ({ ...job, score: calculateMatchScore(job.requiredSkills, skills) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
    
  const avgTopMatch = topJobs.length > 0 
    ? Math.round(topJobs.reduce((acc, job) => acc + job.score, 0) / topJobs.length)
    : 0;

  if (jobsLoading || skillsLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading your personalized feed...</div>;
  }

  return (
    <div className="main-content">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Your AI Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Based on your {totalSkills} verified skills.</p>
      </div>
      
      <div className="dashboard-grid">
        {/* Left Column - Stats & Insights */}
        <div>
          <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
              <TrendingUp size={18} /> Match Analytics
            </h3>
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: '3rem', fontWeight: '700', color: avgTopMatch >= 80 ? 'var(--success)' : avgTopMatch >= 50 ? 'var(--warning)' : 'var(--danger)' }}>
                {avgTopMatch}%
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Avg Top 5 Match Score</div>
            </div>
          </div>
          
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
              <AlertCircle size={18} /> Skill Gap Insights
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Adding these skills could boost your match score across available jobs:
            </p>
            <div className="skills-container">
              <span className="skill-tag skill-neutral">AWS</span>
              <span className="skill-tag skill-neutral">Kubernetes</span>
              <span className="skill-tag skill-neutral">GraphQL</span>
            </div>
            
            <Link to="/skills" style={{ display: 'block', marginTop: '1.5rem', textAlign: 'center', color: 'var(--accent-primary)', fontSize: '0.9rem' }}>
              Update Profile &rarr;
            </Link>
          </div>
        </div>
        
        {/* Right Column - Recommended Feed */}
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
            <Target size={24} color="var(--accent-primary)" /> Top AI Matches
          </h2>
          
          {topJobs.length > 0 ? (
            topJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))
          ) : (
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Target size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
              <p>Add some skills to get personalized job recommendations!</p>
              <Link to="/skills" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>Build Profile</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
