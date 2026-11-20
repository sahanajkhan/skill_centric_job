import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Github, Globe, Shield, Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ background: 'rgba(15, 23, 42, 0.95)', borderTop: '1px solid var(--border)', paddingTop: '3rem', paddingBottom: '2rem', marginTop: 'auto' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
          
          {/* Brand Info */}
          <div>
            <Link to="/" className="logo" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
              <Target size={24} color="var(--primary)" />
              <span>Skill-Centric</span>
            </Link>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '320px', lineHeight: 1.6 }}>
              Production-ready skill-centric job aggregator & AI career project generator connecting candidates based on proven technical execution.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
              <span className="badge-free" style={{ fontSize: '0.75rem' }}>
                <Zap size={12} /> Live API Ingestion
              </span>
              <span className="badge-free" style={{ fontSize: '0.75rem', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--primary-hover)' }}>
                <Shield size={12} /> Free Provider Tier
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>Platform</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li><Link to="/jobs" style={{ color: 'var(--text-muted)' }}>Job Search & Matching</Link></li>
              <li><Link to="/skills" style={{ color: 'var(--text-muted)' }}>Skill Management</Link></li>
              <li><Link to="/projects" style={{ color: 'var(--text-muted)' }}>AI Project Builder</Link></li>
              <li><Link to="/apis" style={{ color: 'var(--text-muted)' }}>API Sources Registry</Link></li>
            </ul>
          </div>

          {/* User Account */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>Account</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li><Link to="/dashboard" style={{ color: 'var(--text-muted)' }}>Dashboard</Link></li>
              <li><Link to="/saved-jobs" style={{ color: 'var(--text-muted)' }}>Saved Bookmarks</Link></li>
              <li><Link to="/login" style={{ color: 'var(--text-muted)' }}>Sign In</Link></li>
              <li><Link to="/register" style={{ color: 'var(--text-muted)' }}>Create Account</Link></li>
            </ul>
          </div>

          {/* Integrations */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>Job Sources</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <li>Remotive Public API</li>
              <li>Arbeitnow European API</li>
              <li>USAJobs Open Data API</li>
              <li>Python NLP Microservice</li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
          <div>
            &copy; {new Date().getFullYear()} Skill-Centric Job Aggregator. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>API Docs</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
