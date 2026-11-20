import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Cpu, Search, Briefcase, FileText, Layers, CheckCircle2, Star, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MOCK_JOBS } from '../utils/constants';
import JobCard from '../components/JobCard';

const Home = () => {
  const { user } = useAuth();
  const featuredJobs = MOCK_JOBS.slice(0, 3);

  return (
    <div className="main-content container">
      {/* Hero Section */}
      <div className="hero" style={{ textAlign: 'center', padding: '3.5rem 0 2.5rem 0', maxWidth: '900px', margin: '0 auto' }}>
        <div className="hero-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(139, 92, 246, 0.12)', border: '1px solid rgba(139, 92, 246, 0.3)', color: 'var(--primary-hover)', padding: '0.4rem 1rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem' }}>
          <Sparkles size={16} /> Powered by NLP Skill Extraction & Transparent Match Scoring
        </div>

        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
          Stop Searching by Job Title.<br />
          Match Jobs by <span className="highlight" style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #38BDF8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>What You Can Actually Build</span>.
        </h1>

        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '780px', margin: '0 auto 2rem auto' }}>
          Skill-Centric continuously aggregates verified remote and engineering jobs from official open APIs, normalizes your technical stack, calculates transparent match scores, and builds AI portfolio roadmaps to bridge skill gaps.
        </p>

        <div className="hero-actions" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to={user ? "/dashboard" : "/skills"} className="btn btn-primary" style={{ padding: '0.85rem 1.8rem', fontSize: '1.05rem', gap: '0.6rem' }}>
            {user ? 'Open Your Dashboard' : 'Upload Resume & Extract Skills'} <ArrowRight size={18} />
          </Link>
          <Link to="/jobs" className="btn btn-secondary" style={{ padding: '0.85rem 1.8rem', fontSize: '1.05rem', gap: '0.6rem' }}>
            <Search size={18} /> Explore Live Jobs catalog
          </Link>
          <Link to="/apis" className="btn btn-outline" style={{ padding: '0.85rem 1.4rem', fontSize: '0.95rem', gap: '0.5rem' }}>
            <Zap size={16} /> API Registry
          </Link>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', padding: '1.5rem 2rem', margin: '2rem 0', textTransform: 'center', background: 'rgba(30, 41, 59, 0.6)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-hover)' }}>100%</div>
          <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>Transparent Skill Scoring</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38BDF8' }}>Free & Open</div>
          <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>Public API Integrations</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--success)' }}>NLP Powered</div>
          <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>Resume Skill Normalization</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--warning)' }}>AI Blueprint</div>
          <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>Skill Gap Project Generator</div>
        </div>
      </div>

      {/* 3 Step Process */}
      <div style={{ marginTop: '3.5rem', marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>How Skill-Centric Works</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Three simple steps from skill extraction to landing high-match technical roles</p>
        </div>

        <div className="steps" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}>
          
          <div className="step-card card">
            <div className="step-number" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.75rem' }}>01</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: 700 }}>Skill Extraction & Normalization</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Upload your PDF/DOCX resume or add skills manually. Our NLP engine standardizes variants like "ReactJS" into "React" and categorizes them with precision.
            </p>
            <div style={{ marginTop: '1.25rem' }}>
              <Link to="/skills" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                Configure Your Skills &rarr;
              </Link>
            </div>
          </div>

          <div className="step-card card">
            <div className="step-number" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38BDF8', marginBottom: '0.75rem' }}>02</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: 700 }}>Weighted Multi-Factor Match</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Transparent 5-factor scoring engine (50% skills, 20% role, 10% exp, 10% remote, 10% tech stack) with clear explanations of why each job matches.
            </p>
            <div style={{ marginTop: '1.25rem' }}>
              <Link to="/jobs" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#38BDF8', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                Browse Matched Jobs &rarr;
              </Link>
            </div>
          </div>

          <div className="step-card card">
            <div className="step-number" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)', marginBottom: '0.75rem' }}>03</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: 700 }}>Skill-Gap AI Project Builder</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Missing Docker or AWS for a target role? Our AI Project Builder generates a complete architectural blueprint designed to bridge your exact skill gaps.
            </p>
            <div style={{ marginTop: '1.25rem' }}>
              <Link to="/projects" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                Generate Project Blueprint &rarr;
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Featured Jobs Preview */}
      <div style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Featured High-Match Opportunities</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>Real-time aggregated engineering roles matching common technical stacks</p>
          </div>
          <Link to="/jobs" className="btn btn-outline" style={{ fontSize: '0.9rem' }}>
            View All Jobs ({MOCK_JOBS.length}) &rarr;
          </Link>
        </div>

        <div>
          {featuredJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>

      {/* Call to action */}
      <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(56, 189, 248, 0.1) 100%)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1rem' }}>
          Ready to Find Jobs That Match Your True Technical Skills?
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
          Join thousands of developers using Skill-Centric to extract skills from resumes, track job matches, and build portfolio projects that land real engineering offers.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
            Get Started Free
          </Link>
          <Link to="/skills" className="btn btn-secondary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
            Upload Resume
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
