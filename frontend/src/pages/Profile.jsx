import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../services/api';
import { Edit2, Plus, Save, X, Briefcase, GraduationCap, Github, Linkedin, Globe, MapPin } from 'lucide-react';

const Profile = () => {
  const { user, login } = useAuth(); // Assume login can be used to update local context if needed, or we just rely on local state
  const [profile, setProfile] = useState(null);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (user) {
      setProfile(user);
      setBioInput(user.bio || '');
      setTitleInput(user.title || '');
    }
  }, [user]);

  const handleSaveBio = async () => {
    setLoading(true);
    try {
      const res = await updateUserProfile({ bio: bioInput, title: titleInput });
      if (res.data.success) {
        setProfile({ ...profile, bio: bioInput, title: titleInput });
        setIsEditingBio(false);
        showSuccess('Profile updated successfully!');
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  if (!profile) return <div className="container text-center p-8">Loading profile...</div>;

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '900px' }}>
      {successMsg && (
        <div style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', textAlign: 'center' }}>
          {successMsg}
        </div>
      )}
      
      {/* Header Section */}
      <div className="card mb-8" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ height: '120px', background: 'linear-gradient(135deg, var(--primary) 0%, #38bdf8 100%)', margin: '-1.5rem -1.5rem 1.5rem -1.5rem' }}></div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end', marginTop: '-4rem', paddingBottom: '1rem' }}>
          <div style={{ 
            width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'var(--bg-page)', 
            border: '4px solid var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)'
          }}>
            {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={{ flex: 1, paddingBottom: '0.5rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{profile.name}</h1>
            <p style={{ color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase size={16} /> {profile.title || 'Add a professional title'}
            </p>
          </div>
          <button onClick={() => setIsEditingBio(!isEditingBio)} className="btn btn-outline" style={{ alignSelf: 'center' }}>
            <Edit2 size={16} /> Edit Info
          </button>
        </div>

        {isEditingBio ? (
          <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--bg-page)', borderRadius: 'var(--radius-md)' }}>
            <div className="mb-4">
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Professional Title</label>
              <input 
                type="text" 
                value={titleInput} 
                onChange={(e) => setTitleInput(e.target.value)} 
                style={{ width: '100%' }}
                placeholder="e.g. Full Stack Developer"
              />
            </div>
            <div className="mb-4">
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Bio</label>
              <textarea 
                value={bioInput} 
                onChange={(e) => setBioInput(e.target.value)} 
                style={{ width: '100%', minHeight: '100px' }}
                placeholder="Tell us about yourself..."
              />
            </div>
            <div className="flex gap-4">
              <button onClick={handleSaveBio} className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : <><Save size={16} /> Save Changes</>}
              </button>
              <button onClick={() => setIsEditingBio(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>About</h3>
            <p style={{ color: 'var(--text-main)', lineHeight: '1.7' }}>
              {profile.bio || "You haven't added a bio yet. Write something to make your profile stand out to recruiters!"}
            </p>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        
        {/* Experience Section */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase size={24} color="var(--primary)" /> Experience
            </h2>
            <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem' }}><Plus size={16} /> Add</button>
          </div>
          
          {profile.experience && profile.experience.length > 0 ? (
            profile.experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1.125rem' }}>{exp.role}</h3>
                <p style={{ color: 'var(--primary-hover)', fontWeight: '500' }}>{exp.company}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{exp.startDate} - {exp.endDate}</p>
                <p style={{ color: 'var(--text-light)' }}>{exp.description}</p>
              </div>
            ))
          ) : (
            <div className="text-center p-8" style={{ backgroundColor: 'var(--bg-page)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ color: 'var(--text-muted)' }}>No experience added yet.</p>
            </div>
          )}
        </div>

        {/* Education Section */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GraduationCap size={24} color="var(--primary)" /> Education
            </h2>
            <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem' }}><Plus size={16} /> Add</button>
          </div>
          
          {profile.education && profile.education.length > 0 ? (
            profile.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem' }}>{edu.degree}</h3>
                <p style={{ color: 'var(--text-main)' }}>{edu.institution}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{edu.year}</p>
              </div>
            ))
          ) : (
            <div className="text-center p-8" style={{ backgroundColor: 'var(--bg-page)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ color: 'var(--text-muted)' }}>No education added yet.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
