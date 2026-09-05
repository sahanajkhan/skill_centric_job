import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Plus, X } from 'lucide-react';
import { useSkills } from '../context/SkillContext';
import { SKILL_CATEGORIES } from '../utils/constants';

const SkillProfile = () => {
  const { skills, addSkill, removeSkill, extractFromResume } = useSkills();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadSuccess(false);
    
    // Simulate file upload
    try {
      await extractFromResume(file);
      setUploadSuccess(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = null;
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    addSkill(newSkill.trim());
    setNewSkill('');
  };

  return (
    <div className="main-content container">
      <div className="text-center mb-8">
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>My Skills</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>
          Add your skills manually or upload your resume to automatically extract them.
        </p>
      </div>
      
      <div className="skills-grid">
        {/* OPTION A: UPLOAD RESUME */}
        <div className="card text-center flex flex-col justify-center items-center" style={{ minHeight: '300px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: '600' }}>Option A: Upload Resume</h2>
          
          <div style={{ padding: '2rem', border: '2px dashed var(--border)', borderRadius: 'var(--radius-lg)', width: '100%', marginBottom: '1.5rem', backgroundColor: 'var(--bg-page)', position: 'relative' }}>
            <Upload size={48} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
            <p style={{ fontWeight: '500', marginBottom: '0.25rem' }}>Upload your Resume</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '1.5rem' }}>PDF, DOCX supported</p>
            
            <input 
              type="file"
              id="resume-upload"
              accept=".pdf,.docx"
              onChange={handleUpload}
              style={{ display: 'none' }}
              disabled={isUploading}
            />
            <label 
              htmlFor="resume-upload" 
              className={`btn btn-primary ${isUploading ? 'disabled' : ''}`}
              style={{ cursor: isUploading ? 'not-allowed' : 'pointer', opacity: isUploading ? 0.7 : 1, display: 'inline-flex' }}
            >
              {isUploading ? 'Analyzing your resume...' : 'Choose File & Extract'}
            </label>
          </div>
          
          {uploadSuccess && (
            <div style={{ color: 'var(--success)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
              <span>✓ Skills extracted successfully!</span>
            </div>
          )}
        </div>
        
        {/* OPTION B: ADD MANUALLY */}
        <div className="card" style={{ minHeight: '300px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: '600' }}>Option B: Add Skills Manually</h2>
          
          <form onSubmit={handleAddSkill} className="flex gap-4 mb-8">
            <input 
              type="text" 
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Search or enter a skill..."
              style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
            />
            <button type="submit" className="btn btn-outline">
              <Plus size={18} /> Add Skill
            </button>
          </form>
          
          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Quick Add by Category:</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {SKILL_CATEGORIES["Frameworks"].slice(0,5).map(skill => (
                <button key={skill} onClick={() => addSkill(skill)} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>
                  + {skill}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* SKILL SUMMARY */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Your Skills</h2>
          <span style={{ color: 'var(--text-muted)' }}>{skills.length} skills added</span>
        </div>
        
        <div className="flex" style={{ flexWrap: 'wrap', marginBottom: '2rem' }}>
          {skills.map(skill => (
            <span key={skill} className="skill-chip">
              {skill}
              <button onClick={() => removeSkill(skill)}><X size={14} /></button>
            </span>
          ))}
          {skills.length === 0 && <span style={{ color: 'var(--text-light)' }}>No skills added yet.</span>}
        </div>
        
        <div className="text-center" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <button 
            className="btn btn-primary" 
            style={{ fontSize: '1.125rem', padding: '0.75rem 2rem' }}
            onClick={() => navigate('/jobs')}
            disabled={skills.length === 0}
          >
            Find Matching Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillProfile;
