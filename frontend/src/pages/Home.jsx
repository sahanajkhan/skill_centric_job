import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, Search, CheckCircle } from 'lucide-react';

const Home = () => {
  return (
    <div className="main-content container">
      <div className="hero">
        <h1>Find Jobs That Match Your Skills</h1>
        <p>
          Upload your resume or add your skills manually. Skill-Centric finds and filters relevant jobs from multiple job platforms in one unified interface.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/skills" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
            Get Started
          </Link>
          <Link to="/skills" className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
            Add Skills Manually
          </Link>
        </div>
      </div>
      
      <div className="steps">
        <div className="step">
          <div className="step-number">01</div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Add Your Skills</h3>
          <p style={{ color: 'var(--text-muted)' }}>We automatically extract skills from your resume, or you can pick them yourself.</p>
        </div>
        <div className="step">
          <div className="step-number">02</div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Find Matching Jobs</h3>
          <p style={{ color: 'var(--text-muted)' }}>We search LinkedIn, Indeed, and more to find jobs tailored to exactly what you know.</p>
        </div>
        <div className="step">
          <div className="step-number">03</div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Apply on Platform</h3>
          <p style={{ color: 'var(--text-muted)' }}>Found the perfect match? We'll take you directly to the original posting to apply.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
