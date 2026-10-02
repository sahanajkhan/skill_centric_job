import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  getSkills,
  addSkill as apiAddSkill,
  removeSkill as apiRemoveSkill,
  uploadResume,
  getSkillAnalysis
} from '../services/api';
import { useAuth } from './AuthContext';

const SkillContext = createContext();

export const useSkills = () => {
  const ctx = useContext(SkillContext);
  return ctx || { skills: [], analysis: null, loading: false, addSkill: () => {}, removeSkill: () => {}, extractFromResume: async () => {}, loadAnalysis: async () => {}, loadSkills: async () => {} };
};

export const SkillProvider = ({ children }) => {
  const [skills, setSkills] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadSkills();
    } else {
      // Default initial skills for guests/demo
      setSkills(['React', 'JavaScript', 'Node.js', 'MongoDB', 'Python']);
    }
  }, [user]);

  const loadSkills = async () => {
    setLoading(true);
    try {
      const res = await getSkills();
      if (res.success && res.data) {
        setSkills(res.data);
      }
    } catch (error) {
      console.warn("Could not load skills from backend:", error.message);
    }
    setLoading(false);
  };

  const loadAnalysis = async () => {
    try {
      const res = await getSkillAnalysis();
      if (res.success && res.data) {
        setAnalysis(res.data);
        return res.data;
      }
    } catch (error) {
      console.warn("Could not fetch skill analysis:", error.message);
    }
    return null;
  };

  const addSkill = async (skillName) => {
    if (!skillName || !skillName.trim()) return;
    const cleanName = skillName.trim();
    if (!skills.some(s => s.toLowerCase() === cleanName.toLowerCase())) {
      setSkills(prev => [...prev, cleanName]);
    }
    if (user) {
      try {
        await apiAddSkill(cleanName);
        await loadSkills();
      } catch (error) {
        console.error("Failed to add skill on server:", error);
      }
    }
  };

  const removeSkill = async (skillName) => {
    setSkills(prev => prev.filter(s => s.toLowerCase() !== skillName.toLowerCase()));
    if (user) {
      try {
        await apiRemoveSkill(skillName);
        await loadSkills();
      } catch (error) {
        console.error("Failed to remove skill on server:", error);
      }
    }
  };

  const extractFromResume = async (fileOrFormData) => {
    setLoading(true);
    try {
      const res = await uploadResume(fileOrFormData);
      if (res.success && res.data) {
        const extracted = res.data.extractedSkills || [];
        setSkills(prev => [...new Set([...prev, ...extracted])]);
        await loadAnalysis();
        setLoading(false);
        return res.data;
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
    setLoading(false);
  };

  return (
    <SkillContext.Provider
      value={{
        skills,
        analysis,
        loading,
        addSkill,
        removeSkill,
        extractFromResume,
        loadAnalysis,
        loadSkills
      }}
    >
      {children}
    </SkillContext.Provider>
  );
};
