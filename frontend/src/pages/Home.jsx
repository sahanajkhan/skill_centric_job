import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Zap, Cpu, Search, Briefcase, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="main-content container">
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-pill">
          <Sparkles size={14} /> Powered by NLP Skill Extraction & Transparent Match Scoring
        </div>
        <h1>
          Stop Searching by Title.<br />
          Match Jobs by <span className="highlight">What You Actually Know</span>.
        </h1>
        <p>
          Skill-Centric continuously aggregates verified jobs from official free and open APIs, normalizes tech stacks, calculates transparent skill match scores, and builds AI-powered portfolio plans to bridge your career gaps.
        </p>
        <div className="hero-actions">
          <Link to={user ? "/dashboard" : "/skills"} className="btn btn-primary" style={{ padding: '0.85rem 1.8rem', fontSize: '1.05rem' }}>
            {user ? 'Open Dashboard' : 'Upload Resume & Get Matched'} <ArrowRight size={18} />
          </Link>
          <Link to="/jobs" className="btn btn-secondary" style={{ padding: '0.85rem 1.8rem', fontSize: '1.05rem' }}>
            <Search size={18} /> Explore Live Jobs
          </Link>
          <Link to="/apis" className="btn btn-outline" style={{ padding: '0.85rem 1.4rem', fontSize: '0.95rem' }}>
            View Free APIs Status
          </Link>
        </div>
      </div>

      {/* Trust & Transparency Badges */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', margin: '2rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ShieldCheck size={18} color="var(--success)" /> Verified Free & Open Source APIs
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Zap size={18} color="var(--warning)" /> Deduplicated Across Multiple Providers
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Cpu size={18} color="var(--primary)" /> Portfolio Project Generation Engine
        </span>
      </div>

      {/* 3 Step Architecture */}
      <div className="steps">
        <div className="step-card">
          <div className="step-number">01</div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>Skill Extraction & Normalization</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6 }}>
            Upload your PDF/DOCX resume or enter skills manually. Our NLP engine standardizes variants like "ReactJS" into "React" and categorizes them with precision.
          </p>
          <div style={{ marginTop: '1rem' }}>
            <Link to="/skills" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)' }}>
              Configure Skills &rarr;
            </Link>
          </div>
        </div>

        <div className="step-card">
          <div className="step-number">02</div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>Weighted Multi-Factor Match</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6 }}>
            Transparent 5-factor scoring engine (50% skills, 20% role, 10% exp, 10% remote, 10% tech stack) with clear explanations of why each job matches.
          </p>
          <div style={{ marginTop: '1rem' }}>
            <Link to="/jobs" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)' }}>
              Browse Matched Jobs &rarr;
            </Link>
          </div>
        </div>

        <div className="step-card">
          <div className="step-number">03</div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>Skill-Gap AI Project Builder</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6 }}>
            Missing AWS or Docker for a dream role? Our AI Project Builder generates a full-stack portfolio blueprint designed specifically to bridge your gaps.
          </p>
          <div style={{ marginTop: '1rem' }}>
            <Link to="/projects" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)' }}>
              Build Portfolio Project &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
