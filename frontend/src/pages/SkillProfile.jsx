import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  Plus,
  X,
  Sparkles,
  FileText,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Layers,
  ArrowRight
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
  const { skills, analysis, addSkill, removeSkill, extractFromResume, loadAnalysis, loading } = useSkills();
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
      const count = res?.extractedSkills?.length || 0;
      setUploadSuccessMsg(`Extracted ${count} technical skills from ${file.name}!`);
    } catch (error) {
      setUploadErrorMsg(error.response?.data?.message || 'Could not parse resume file.');
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
      <div className="text-center" style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          Skill Profile & Resume Extraction
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto' }}>
          Our AI extracts verified technical skills from your resume, normalizes naming variations, and runs gap analysis for your target roles.
        </p>
      </div>

      {/* Target Role Selector */}
      <div className="card" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: '#F8FAFC' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Briefcase size={22} color="var(--primary)" />
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>Your Target Role</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Matching algorithms calibrate specifically for this career trajectory</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="select-filter"
            style={{ fontWeight: 600 }}
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
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} color="var(--primary)" /> Resume AI Parser
            </h2>
            <button
              onClick={() => setShowPasteText(!showPasteText)}
              style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, background: 'none' }}
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
              style={{ borderColor: isDragOver ? 'var(--primary)' : '#CBD5E1', backgroundColor: isDragOver ? '#EEF2FF' : '#F8FAFC' }}
            >
              <Upload size={40} color="var(--primary)" style={{ margin: '0 auto 0.75rem' }} />
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>
                Drag & Drop your Resume PDF
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Supports PDF, DOCX, TXT (e.g. <em>Riya Bansal Resume.pdf</em>)
              </p>

              <input
                type="file"
                id="resume-file-input"
                accept=".pdf,.docx,.txt"
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
                style={{ cursor: isUploading ? 'not-allowed' : 'pointer', opacity: isUploading ? 0.7 : 1 }}
              >
                {isUploading ? 'Extracting Technical Skills...' : 'Choose PDF File'}
              </label>
            </div>
          ) : (
            <div>
              <textarea
                rows={6}
                value={rawResumeText}
                onChange={(e) => setRawResumeText(e.target.value)}
                placeholder="Paste your resume content, experience, or skills list here..."
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'inherit', fontSize: '0.875rem', marginBottom: '1rem' }}
              />
              <button
                onClick={async () => {
                  if (!rawResumeText.trim()) return;
                  setIsUploading(true);
                  try {
                    const formData = new FormData();
                    formData.append('rawText', rawResumeText);
                    const res = await extractFromResume(formData);
                    setUploadSuccessMsg(`Extracted ${res?.extractedSkills?.length || 0} skills from text!`);
                  } catch (e) {
                    setUploadErrorMsg('Failed to parse text.');
                  } finally {
                    setIsUploading(false);
                  }
                }}
                disabled={isUploading || !rawResumeText.trim()}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                {isUploading ? 'Extracting...' : 'Extract Skills from Text'}
              </button>
            </div>
          )}

          {uploadSuccessMsg && (
            <div style={{ marginTop: '1rem', padding: '0.6rem 0.9rem', background: '#ECFDF5', color: '#065F46', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={16} /> {uploadSuccessMsg}
            </div>
          )}

          {uploadErrorMsg && (
            <div style={{ marginTop: '1rem', padding: '0.6rem 0.9rem', background: '#FEF2F2', color: '#991B1B', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertCircle size={16} /> {uploadErrorMsg}
            </div>
          )}
        </div>

        {/* MANUAL ADDITION & TAXONOMY */}
        <div className="card">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={20} color="var(--primary)" /> Manual Skill Entry & Normalization
          </h2>

          <form onSubmit={handleManualAdd} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input
              type="text"
              className="search-input"
              style={{ paddingLeft: '1rem' }}
              placeholder="e.g. ReactJS, Docker, AWS, FastAPI..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
              <Plus size={16} /> Add
            </button>
          </form>

          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              QUICK-ADD BY CATEGORY:
            </div>
            {Object.entries(TAXONOMY_CATEGORIES).map(([cat, catSkills]) => (
              <div key={cat} style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  {cat}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                  {catSkills.map(skill => {
                    const alreadyAdded = skills.some(s => s.toLowerCase() === skill.toLowerCase());
                    return (
                      <button
                        key={skill}
                        onClick={() => addSkill(skill)}
                        disabled={alreadyAdded}
                        className={`btn ${alreadyAdded ? 'btn-secondary' : 'btn-outline'}`}
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', opacity: alreadyAdded ? 0.6 : 1 }}
                      >
                        {alreadyAdded ? '✓ ' : '+ '}{skill}
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
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Your Active Verified Skills ({skills.length})</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Normalized canonical tech skills used for all matching algorithms
            </p>
          </div>
          <button
            onClick={() => navigate('/jobs')}
            className="btn btn-primary"
            style={{ padding: '0.6rem 1.25rem' }}
          >
            Find Matching Jobs <ArrowRight size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', minHeight: '60px', padding: '0.5rem 0' }}>
          {skills.length > 0 ? (
            skills.map(skill => (
              <SkillTag key={skill} name={skill} onRemove={removeSkill} />
            ))
          ) : (
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No skills added yet. Upload your resume above or click quick-add buttons.
            </span>
          )}
        </div>
      </div>

      {/* AI LLM SKILL ANALYSIS BREAKDOWN */}
      <div className="card" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Sparkles size={20} color="var(--primary)" />
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>AI Career & Skill Gap Breakdown</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {/* Strong Skills */}
          <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--success)', marginBottom: '0.5rem' }}>
              CORE / STRONG SKILLS
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
              {(analysis?.strong_skills || skills.slice(0, 4)).map(s => (
                <SkillTag key={`strong-${s}`} name={s} type="matching" />
              ))}
            </div>
          </div>

          {/* Missing Skills */}
          <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#991B1B', marginBottom: '0.5rem' }}>
              HIGH-IMPACT MISSING SKILLS
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
              {(analysis?.missing_skills || ['Docker', 'AWS', 'TypeScript']).map(s => (
                <SkillTag key={`missing-${s}`} name={s} type="missing" />
              ))}
            </div>
          </div>

          {/* Recommended Roles */}
          <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
              BEST-FIT CAREER ROLES
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {(analysis?.recommended_roles || ['Full Stack Developer', 'Backend Developer']).map(r => (
                <span key={r} style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
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
