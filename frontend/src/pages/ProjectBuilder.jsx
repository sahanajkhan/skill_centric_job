import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Sparkles,
  Layers,
  Database,
  Code2,
  FolderTree,
  CheckCircle2,
  Server,
  Cloud,
  Terminal,
  BookOpen
} from 'lucide-react';
import { useSkills } from '../context/SkillContext';
import { useAuth } from '../context/AuthContext';
import { generateProjectPlan, getUserProjects } from '../services/api';
import Loading from '../components/Loading';

const ProjectBuilder = () => {
  const { skills, analysis } = useSkills();
  const { user } = useAuth();

  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Full Stack Developer');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Intermediate');
  const [preferredStack, setPreferredStack] = useState('MERN (React, Node.js, Express, MongoDB)');
  const [customMissingSkills, setCustomMissingSkills] = useState('');
  const [blueprint, setBlueprint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // overview, architecture, schema, tasks

  useEffect(() => {
    if (user) {
      getUserProjects().then(res => {
        if (res.success && res.data) {
          setHistory(res.data);
          if (res.data.length > 0 && !blueprint) {
            setBlueprint(res.data[0]);
          }
        }
      }).catch(() => {});
    }
  }, [user]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const missing = customMissingSkills
        ? customMissingSkills.split(',').map(s => s.trim()).filter(Boolean)
        : (analysis?.missing_skills || ['Docker', 'AWS', 'TypeScript', 'CI/CD']);

      const payload = {
        targetRole,
        existingSkills: skills.length ? skills : ['React', 'JavaScript', 'Node.js', 'MongoDB'],
        missingSkills: missing,
        difficulty: selectedDifficulty,
        preferredStack,
        jobRequirements: `Targeting modern cloud-ready ${targetRole} positions`
      };

      const res = await generateProjectPlan(payload);
      if (res.success && res.data) {
        setBlueprint(res.data);
        setHistory(prev => [res.data, ...prev]);
        setActiveTab('overview');
      }
    } catch (error) {
      console.error('Failed to generate project plan:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content container">
      {/* Header */}
      <div className="text-center" style={{ marginBottom: '2.5rem' }}>
        <div className="hero-pill">
          <Sparkles size={14} /> AI Portfolio Project Engine
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          Skill-Gap AI Project Builder
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto' }}>
          Generate comprehensive production-ready project blueprints specifically designed to turn your missing skills into portfolio assets.
        </p>
      </div>

      {/* Generator Form */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.75rem' }}>
        <form onSubmit={handleGenerate}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                Target Role
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="select-filter"
                style={{ width: '100%' }}
              >
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="AI / Machine Learning Engineer">AI / Machine Learning Engineer</option>
                <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                Difficulty Level
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="select-filter"
                style={{ width: '100%' }}
              >
                <option value="Beginner / Guided">Beginner / Guided</option>
                <option value="Intermediate">Intermediate (Recommended)</option>
                <option value="Advanced / Production-Grade">Advanced / Production-Grade</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                Preferred Tech Stack
              </label>
              <select
                value={preferredStack}
                onChange={(e) => setPreferredStack(e.target.value)}
                className="select-filter"
                style={{ width: '100%' }}
              >
                <option value="MERN (React, Node.js, Express, MongoDB)">MERN (React, Node.js, Express, MongoDB)</option>
                <option value="Python FastAPI + React + PostgreSQL">Python FastAPI + React + PostgreSQL</option>
                <option value="Next.js + TypeScript + Tailwind + Supabase">Next.js + TypeScript + Tailwind + Supabase</option>
                <option value="Microservices + Docker + Redis">Microservices + Docker + Redis</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                Target Skills to Master (comma-separated)
              </label>
              <input
                type="text"
                className="search-input"
                style={{ paddingLeft: '1rem' }}
                placeholder="e.g. Docker, AWS, Redis, GraphQL"
                value={customMissingSkills}
                onChange={(e) => setCustomMissingSkills(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Using {skills.length} active profile skills as foundation
            </span>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.75rem', fontSize: '1rem' }}
            >
              <Sparkles size={18} /> {loading ? 'Generating Full Architecture...' : 'Generate Project Blueprint'}
            </button>
          </div>
        </form>
      </div>

      {loading && <Loading message="Synthesizing architecture, database schema, API design, and development tasks..." />}

      {/* Generated Blueprint View */}
      {blueprint && !loading && (
        <div>
          <div className="card" style={{ marginBottom: '1.5rem', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="badge-free" style={{ marginBottom: '0.5rem' }}>
                  {blueprint.difficulty || 'Intermediate'} Project Blueprint
                </span>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
                  {blueprint.title}
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem', maxWidth: '750px', lineHeight: 1.6 }}>
                  {blueprint.problemStatement}
                </p>
              </div>
            </div>

            {/* Blueprint Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setActiveTab('overview')}
                className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.85rem' }}
              >
                <Layers size={15} /> Architecture & Features
              </button>
              <button
                onClick={() => setActiveTab('schema')}
                className={`btn ${activeTab === 'schema' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.85rem' }}
              >
                <Database size={15} /> Database Schema & API
              </button>
              <button
                onClick={() => setActiveTab('structure')}
                className={`btn ${activeTab === 'structure' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.85rem' }}
              >
                <FolderTree size={15} /> Folder Structure
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`btn ${activeTab === 'tasks' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.85rem' }}
              >
                <CheckCircle2 size={15} /> Development Roadmap
              </button>
            </div>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="card">
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Layers size={18} color="var(--primary)" /> Core System Features
                </h3>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  {(blueprint.features || []).map((f, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', marginBottom: '0.75rem', fontSize: '0.9rem', lineHeight: 1.5 }}>
                      <CheckCircle2 size={16} color="var(--success)" style={{ flexShrink: 0, marginTop: '3px' }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card">
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Server size={18} color="var(--primary)" /> Recommended Tech Stack
                </h3>
                {blueprint.technologyStack && typeof blueprint.technologyStack === 'object' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {Object.entries(blueprint.technologyStack).map(([layer, tech]) => (
                      <div key={layer} style={{ background: '#F8FAFC', padding: '0.6rem 0.9rem', borderRadius: '6px' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                          {layer.replace('_', ' ')}
                        </div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                          {tech}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>{JSON.stringify(blueprint.technologyStack)}</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: SCHEMA & API */}
          {activeTab === 'schema' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="card">
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Database size={18} color="var(--primary)" /> Database Entity Schema
                </h3>
                <pre className="code-block">
                  {JSON.stringify(blueprint.databaseSchema || {}, null, 2)}
                </pre>
              </div>

              <div className="card">
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Code2 size={18} color="var(--primary)" /> REST API Endpoints
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {(blueprint.apiDesign || []).map((api, idx) => (
                    <div key={idx} style={{ background: '#F8FAFC', padding: '0.6rem 0.9rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.15rem 0.4rem', borderRadius: '4px', background: api.method === 'GET' ? '#DBEAFE' : api.method === 'POST' ? '#DCFCE7' : '#FEF3C7', color: api.method === 'GET' ? '#1E40AF' : api.method === 'POST' ? '#166534' : '#92400E' }}>
                          {api.method}
                        </span>
                        <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.85rem' }}>
                          {api.endpoint}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {api.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STRUCTURE */}
          {activeTab === 'structure' && (
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FolderTree size={18} color="var(--primary)" /> Monorepo / Production Directory Layout
              </h3>
              <pre className="code-block" style={{ fontSize: '0.85rem' }}>
                {blueprint.folderStructure || 'src/\n  components/\n  controllers/\n  models/'}
              </pre>
            </div>
          )}

          {/* TAB 4: TASKS */}
          {activeTab === 'tasks' && (
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} color="var(--primary)" /> Step-by-Step Implementation Roadmap
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(blueprint.implementationPlan || []).map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', width: '28px' }}>
                      {idx + 1}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                        {step.phase || `Phase ${idx + 1}`}
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5 }}>
                        {step.detail || step}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectBuilder;
