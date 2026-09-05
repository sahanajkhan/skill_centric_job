import React, { createContext, useState, useContext, useEffect } from 'react';
import { getSkills, addSkill as apiAddSkill, removeSkill as apiRemoveSkill, uploadResume } from '../services/api';

const SkillContext = createContext();

export const useSkills = () => useContext(SkillContext);

export const SkillProvider = ({ children }) => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    setLoading(true);
    try {
      const res = await getSkills();
      setSkills(res.data);
    } catch (error) {
      console.error("Failed to load skills", error);
    }
    setLoading(false);
  };

  const addSkill = async (skillName) => {
    try {
      const res = await apiAddSkill(skillName);
      setSkills(res.data);
    } catch (error) {
      console.error("Failed to add skill", error);
    }
  };

  const removeSkill = async (skillName) => {
    try {
      const res = await apiRemoveSkill(skillName);
      setSkills(res.data);
    } catch (error) {
      console.error("Failed to remove skill", error);
    }
  };

  const extractFromResume = async (file) => {
    try {
      const res = await uploadResume(file);
      setSkills(res.data.all_skills);
      return res.data.extracted_skills;
    } catch (error) {
      console.error("Failed to extract skills", error);
      throw error;
    }
  };

  return (
    <SkillContext.Provider value={{ skills, loading, addSkill, removeSkill, extractFromResume }}>
      {children}
    </SkillContext.Provider>
  );
};
