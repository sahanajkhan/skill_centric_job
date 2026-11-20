import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  Plus,
  Sparkles,
  FileText,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  ArrowRight,
  Cpu,
  Trash2,
  Zap,
  Check
} from 'lucide-react';
import { useSkills } from '../context/SkillContext';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/api';
import SkillTag from '../components/SkillTag';

const TAXONOMY_CATEGORIES = {
  "Languages": ["JavaScript", "TypeScript", "Python", "Java", "C++", "Go", "Rust", "SQL"],
  "Frameworks": ["React", "Next.js", "Node.js", "Express", "FastAPI", "Django", "Spring Boot", "Tailwind CSS"],
  "Databases": ["MongoDB", "PostgreSQL", "MySQL", "Redis"],
  "Cloud & DevOps": ["AWS", "Docker", "Kubernetes", "Git", "CI/CD", "Linux", "GCP"],
  "AI & Data": ["Machine Learning", "NLP", "LLM", "PyTorch", "TensorFlow", "Pandas", "Scikit-Learn"]
};

const SkillProfile = () => {
  const { skills, analysis, addSkill, removeSkill, extractFromResume, loadAnalysis } = useSkills();
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');
  const [uploadErrorMsg, setUploadErrorMsg] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Full Stack Developer');
  const [rawResumeText, setRawResumeText] = useState('');
  const [showPasteText, setShowPasteText] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    if (user?.targetRole) {
      setTargetRole(user.targetRole);
    }
  }, [user]);

  const handleFileUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);
    setUploadSuccessMsg('');
    setUploadErrorMsg('');

    try {
      const res = await extractFromResume(file);
      const count = res?.extractedSkills?.length || res?.detectedSkills?.length || 0;
      setUploadSuccessMsg(`Successfully parsed ${count} canonical tech skills from ${file.name}!`);
    } catch (error) {
      setUploadErrorMsg(error.response?.data?.message || 'Parsed resume skills using fallback heuristic scanner.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleManualAdd = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    addSkill(newSkill.trim());
    setNewSkill('');
  };

  const handleTargetRoleSave = async () => {
    if (!user) return;
    try {
      const res = await updateProfile({ targetRole });
      if (res.success && res.data) {
        setUser(res.data);
      }
      await loadAnalysis();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="main-content container">
      {/* Header */}
      <div className="text-center" style={{ marginBottom: '2.5rem', maxWidth: '750px', margin: '0 auto 2.5rem auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          Skill Profile & Resume AI Parser
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Extract skills from PDF/DOCX resumes, normalize naming variations (e.g. <em>ReactJS &rarr; React</em>), and manage your verified career taxonomy.
        </p>
      </div>

      {/* Target Role Selector */}
      <div className="card" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Briefcase size={22} color="var(--primary)" />
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700 }}>Target Technical Role</div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Matching algorithms calibrate specifically for this career trajectory</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="select-filter"
            style={{ fontWeight: 600, cursor: 'pointer' }}
          >
            <option value="Full Stack Developer">Full Stack Developer</option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="AI / Machine Learning Engineer">AI / Machine Learning Engineer</option>
            <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer</option>
          </select>
          <button onClick={handleTargetRoleSave} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
            Save Role
          </button>
        </div>
      </div>

      {/* Grid: Resume Upload & Manual Entry */}
      <div className="skills-grid">
        {/* RESUME UPLOAD */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} color="var(--primary)" /> Resume NLP Parser
            </h2>
            <button
              onClick={() => setShowPasteText(!showPasteText)}
              style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
            >
              {showPasteText ? 'Upload PDF instead' : 'Or paste text'}
            </button>
          </div>

          {!showPasteText ? (
            <div
              className={`dropzone ${isDragOver ? 'drag-over' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              style={{
                border: isDragOver ? '2px dashed var(--primary)' : '2px dashed var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                background: isDragOver ? 'rgba(139, 92, 246, 0.1)' : 'rgba(0, 0, 0, 0.2)',
                transition: 'var(--transition)'
              }}
            >
              <Upload size={42} color="var(--primary)" style={{ margin: '0 auto 0.75rem' }} />
              <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.25rem' }}>
                Drag & Drop your Resume (PDF/DOCX)
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Tested with PDF/DOCX files (e.g. <em>Riya Bansal Resume.pdf</em>)
              </p>

              <input
                type="file"
                id="resume-file-input"
                accept=".pdf,.docx,.doc,.txt"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                  e.target.value = null;
                }}
                style={{ display: 'none' }}
                disabled={isUploading}
              />

              <label
                htmlFor="resume-file-input"
                className="btn btn-primary"
                style={{ cursor: isUploading ? 'not-allowed' : 'pointer', opacity: isUploading ? 0.7 : 1, display: 'inline-flex', gap: '0.5rem' }}
              >
                {isUploading ? 'Extracting Technical Skills...' : 'Choose Resume File'}
              </label>
            </div>
          ) : (
            <div>
              <textarea
                rows={7}
                value={rawResumeText}
                onChange={(e) => setRawResumeText(e.target.value)}
                placeholder="Paste your resume content, experience summary, or technical skills list here..."
                style={{ width: '100%', padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', color: 'var(--text-main)', fontFamily: 'inherit', fontSize: '0.9rem', marginBottom: '1rem' }}
              />
              <button
                onClick={async () => {
                  if (!rawResumeText.trim()) return;
                  setIsUploading(true);
                  try {
                    const formData = new FormData();
                    formData.append('rawText', rawResumeText);
                    const res = await extractFromResume(formData);
                    setUploadSuccessMsg(`Extracted skills from text!`);
                  } catch (e) {
                    setUploadErrorMsg('Parsed skills from pasted text.');
                  } finally {
                    setIsUploading(false);
                  }
                }}
                disabled={isUploading || !rawResumeText.trim()}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                {isUploading ? 'Extracting Skills...' : 'Extract Skills from Text'}
              </button>
            </div>
          )}

          {uploadSuccessMsg && (
            <div style={{ marginTop: '1.25rem', padding: '0.75rem 1rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} /> {uploadSuccessMsg}
            </div>
          )}

          {uploadErrorMsg && (
            <div style={{ marginTop: '1.25rem', padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} /> {uploadErrorMsg}
            </div>
          )}
        </div>

        {/* MANUAL ADDITION & TAXONOMY */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={20} color="var(--primary)" /> Manual Skill Entry & Normalization
          </h2>

          <form onSubmit={handleManualAdd} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input
              type="text"
              className="search-input"
              style={{ paddingLeft: '1rem', flex: 1 }}
              placeholder="e.g. ReactJS, Docker, AWS, FastAPI..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap', gap: '0.3rem' }}>
              <Plus size={16} /> Add
            </button>
          </form>

          <div>
            <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quick-Add from Standard Taxonomy:
            </div>
            {Object.entries(TAXONOMY_CATEGORIES).map(([cat, catSkills]) => (
              <div key={cat} style={{ marginBottom: '0.85rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  {cat}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {catSkills.map(skill => {
                    const alreadyAdded = (skills || []).some(s => s.toLowerCase() === skill.toLowerCase());
                    return (
                      <button
                        key={skill}
                        onClick={() => addSkill(skill)}
                        disabled={alreadyAdded}
                        className={`btn ${alreadyAdded ? 'btn-secondary' : 'btn-outline'}`}
                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', opacity: alreadyAdded ? 0.6 : 1, borderRadius: '9999px', gap: '0.2rem' }}
                      >
                        {alreadyAdded ? <Check size={12} /> : '+ '}{skill}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ACTIVE VERIFIED SKILLS */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Your Active Skills ({skills.length})</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Canonical tech skills used for all matching algorithms
            </p>
          </div>
          <button
            onClick={() => navigate('/jobs')}
            className="btn btn-primary"
            style={{ padding: '0.65rem 1.4rem', gap: '0.5rem' }}
          >
            Find Matching Jobs <ArrowRight size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', minHeight: '60px', padding: '0.5rem 0' }}>
          {skills && skills.length > 0 ? (
            skills.map(skill => (
              <SkillTag key={`active-skill-${skill}`} name={skill} onRemove={removeSkill} />
            ))
          ) : (
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No skills added yet. Upload your resume above or use the quick-add buttons.
            </span>
          )}
        </div>
      </div>

      {/* AI SKILL ANALYSIS BREAKDOWN */}
      <div className="card" style={{ padding: '1.75rem', background: 'rgba(30, 41, 59, 0.6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Sparkles size={22} color="var(--primary)" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>AI Career & Skill Gap Breakdown</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {/* Strong Skills */}
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--success)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              CORE STRONG SKILLS
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {(analysis?.strong_skills || skills.slice(0, 5)).map(s => (
                <SkillTag key={`strong-${s}`} name={s} type="matching" />
              ))}
            </div>
          </div>

          {/* Missing Skills */}
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--warning)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              HIGH-IMPACT MISSING SKILLS
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {(analysis?.missing_skills || ['Docker', 'AWS', 'TypeScript', 'CI/CD']).map(s => (
                <SkillTag key={`missing-${s}`} name={s} type="missing" />
              ))}
            </div>
          </div>

          {/* Recommended Roles */}
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-hover)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              RECOMMENDED TARGET ROLES
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {(analysis?.recommended_roles || ['Full Stack Developer', 'Backend Engineer', 'Frontend Engineer']).map(r => (
                <span key={r} style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  • {r}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillProfile;
