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

const DEFAULT_MOCK_BLUEPRINT = {
  title: "Cloud-Native Microservices Job Aggregator & Skill Gap Pipeline",
  difficulty: "Intermediate",
  targetRole: "Full Stack Developer",
  problemStatement: "Enterprise application designed to master Docker, Redis, and AWS cloud deployment while leveraging core strengths in React, Node.js, Express, and MongoDB.",
  features: [
    "JWT Authentication & RBAC role authorization",
    "High-throughput REST API with Redis caching layer",
    "Responsive React glassmorphism dashboard UI",
    "Containerized deployment with Docker and Docker Compose",
    "Automated CI/CD integration and unit testing suite"
  ],
  technologyStack: {
    frontend: "React, Vite, CSS, Lucide Icons",
    backend: "Node.js, Express, Axios",
    database: "MongoDB, Redis",
    devops: "Docker, Docker Compose, AWS EC2 / ECS"
  },
  databaseSchema: {
    User: { id: "ObjectId", name: "String", email: "String", skills: "[String]" },
    Job: { id: "ObjectId", title: "String", company: "String", matchScore: "Number" },
    Application: { id: "ObjectId", userId: "ObjectId", jobId: "ObjectId", status: "String" }
  },
  apiDesign: [
    { method: "GET", endpoint: "/api/jobs", description: "Fetch paginated job feed with match scores" },
    { method: "POST", endpoint: "/api/skills/resume", description: "Upload resume PDF and extract canonical skills" },
    { method: "POST", endpoint: "/api/recommendations/generate-project", description: "Generate AI project blueprint" }
  ],
  folderStructure: "project-root/\n  frontend/\n    src/\n      components/\n      pages/\n      context/\n  backend/\n    src/\n      controllers/\n      models/\n      services/\n  docker-compose.yml",
  implementationPlan: [
    { phase: "Phase 1: Environment & Database Setup", detail: "Scaffold Express REST API, MongoDB Mongoose models, and Docker development container." },
    { phase: "Phase 2: Auth & Skill Extraction Engine", detail: "Implement JWT auth middleware, Multer resume parser, and skill normalization." },
    { phase: "Phase 3: Aggregator & Matching Pipeline", detail: "Integrate free job provider APIs with Redis caching and transparent 5-factor scoring." },
    { phase: "Phase 4: Dashboard UI & Deployment", detail: "Build interactive React UI dashboard and deploy container to cloud." }
  ]
};

const ProjectBuilder = () => {
  const { skills, analysis } = useSkills();
  const { user } = useAuth();

  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Full Stack Developer');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Intermediate');
  const [preferredStack, setPreferredStack] = useState('MERN (React, Node.js, Express, MongoDB)');
  const [customMissingSkills, setCustomMissingSkills] = useState('');
  const [blueprint, setBlueprint] = useState(DEFAULT_MOCK_BLUEPRINT);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // overview, schema, structure, tasks

  useEffect(() => {
    if (user) {
      getUserProjects().then(res => {
        if (res && res.success && res.data && res.data.length > 0) {
          setBlueprint(res.data[0]);
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

      const res = await generateProjectPlan(payload).catch(() => null);
      if (res && res.success && res.data) {
        setBlueprint(res.data);
      } else {
        // Mock generated blueprint for demo
        setBlueprint({
          ...DEFAULT_MOCK_BLUEPRINT,
          title: `Production ${targetRole} Platform with ${missing[0] || 'Docker'}`,
          targetRole,
          difficulty: selectedDifficulty,
          problemStatement: `Custom engineering project designed to master ${missing.join(', ')} while building upon your strengths in ${skills.slice(0, 3).join(', ') || 'React, Node.js'}.`
        });
      }
      setActiveTab('overview');
    } catch (error) {
      console.error('Failed to generate project plan:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content container">
      {/* Header */}
      <div className="text-center" style={{ marginBottom: '2.5rem', maxWidth: '750px', margin: '0 auto 2.5rem auto' }}>
        <div className="hero-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(139, 92, 246, 0.12)', border: '1px solid rgba(139, 92, 246, 0.3)', color: 'var(--primary-hover)', padding: '0.4rem 1rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.25rem' }}>
          <Sparkles size={16} /> AI Skill-Gap Portfolio Generator
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          AI Portfolio Project Builder
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Generate comprehensive production-ready project blueprints specifically designed to turn your missing skills into hiring-ready portfolio assets.
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
                style={{ width: '100%', cursor: 'pointer' }}
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
                style={{ width: '100%', cursor: 'pointer' }}
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
                style={{ width: '100%', cursor: 'pointer' }}
              >
                <option value="MERN (React, Node.js, Express, MongoDB)">MERN (React, Node.js, Express, MongoDB)</option>
                <option value="Python FastAPI + React + PostgreSQL">Python FastAPI + React + PostgreSQL</option>
                <option value="Next.js + TypeScript + Tailwind + Supabase">Next.js + TypeScript + Tailwind + Supabase</option>
                <option value="Microservices + Docker + Redis">Microservices + Docker + Redis</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                Target Skills to Master
              </label>
              <input
                type="text"
                className="search-input"
                style={{ paddingLeft: '1rem', width: '100%' }}
                placeholder="e.g. Docker, AWS, Redis, GraphQL"
                value={customMissingSkills}
                onChange={(e) => setCustomMissingSkills(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1.25rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Leveraging {skills.length || 4} active profile skills as foundation
            </span>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.75rem', fontSize: '1rem', gap: '0.5rem' }}
            >
              <Sparkles size={18} /> {loading ? 'Synthesizing Architecture...' : 'Generate Project Blueprint'}
            </button>
          </div>
        </form>
      </div>

      {loading && <Loading message="Synthesizing architecture, database schema, API design, and development tasks..." />}

      {/* Generated Blueprint View */}
      {blueprint && !loading && (
        <div>
          <div className="card" style={{ marginBottom: '1.5rem', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="badge-free" style={{ marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                  {blueprint.difficulty || 'Intermediate'} Blueprint
                </span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem', letterSpacing: '-0.02em' }}>
                  {blueprint.title}
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem', maxWidth: '780px', lineHeight: 1.6 }}>
                  {blueprint.problemStatement}
                </p>
              </div>
            </div>

            {/* Blueprint Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setActiveTab('overview')}
                className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.85rem', gap: '0.4rem' }}
              >
                <Layers size={15} /> Overview & Stack
              </button>
              <button
                onClick={() => setActiveTab('schema')}
                className={`btn ${activeTab === 'schema' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.85rem', gap: '0.4rem' }}
              >
                <Database size={15} /> Database & API
              </button>
              <button
                onClick={() => setActiveTab('structure')}
                className={`btn ${activeTab === 'structure' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.85rem', gap: '0.4rem' }}
              >
                <FolderTree size={15} /> Folder Layout
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`btn ${activeTab === 'tasks' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.85rem', gap: '0.4rem' }}
              >
                <CheckCircle2 size={15} /> Implementation Roadmap
              </button>
            </div>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Layers size={18} color="var(--primary)" /> System Features & Scope
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

              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Server size={18} color="var(--primary)" /> Architecture Tech Stack
                </h3>
                {blueprint.technologyStack && typeof blueprint.technologyStack === 'object' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {Object.entries(blueprint.technologyStack).map(([layer, tech]) => (
                      <div key={layer} style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                          {layer.replace('_', ' ')}
                        </div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.15rem' }}>
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
              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Database size={18} color="var(--primary)" /> Database Entity Schema
                </h3>
                <pre className="code-block">
                  {JSON.stringify(blueprint.databaseSchema || {}, null, 2)}
                </pre>
              </div>

              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Code2 size={18} color="var(--primary)" /> REST API Endpoint Architecture
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {(blueprint.apiDesign || []).map((api, idx) => (
                    <div key={idx} style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '4px', background: api.method === 'GET' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(16, 185, 129, 0.2)', color: api.method === 'GET' ? '#38BDF8' : 'var(--success)' }}>
                          {api.method}
                        </span>
                        <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.875rem' }}>
                          {api.endpoint}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
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
            <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FolderTree size={18} color="var(--primary)" /> Production Directory Layout
              </h3>
              <pre className="code-block" style={{ fontSize: '0.875rem' }}>
                {blueprint.folderStructure || 'src/\n  components/\n  controllers/\n  models/'}
              </pre>
            </div>
          )}

          {/* TAB 4: TASKS */}
          {activeTab === 'tasks' && (
            <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} color="var(--primary)" /> Step-by-Step Implementation Roadmap
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(blueprint.implementationPlan || []).map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '1.25rem', padding: '1.25rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-hover)', width: '32px' }}>
                      0{idx + 1}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>
                        {step.phase || `Phase ${idx + 1}`}
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
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
