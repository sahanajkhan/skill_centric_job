export const calculateMatchScore = (jobRequiredSkills, userSkills) => {
  if (!jobRequiredSkills || jobRequiredSkills.length === 0) return 100;
  if (!userSkills || userSkills.length === 0) return 0;
  
  const userSkillNames = userSkills.map(s => s.name.toLowerCase());
  const matchCount = jobRequiredSkills.filter(skill => 
    userSkillNames.includes(skill.toLowerCase())
  ).length;
  
  return Math.round((matchCount / jobRequiredSkills.length) * 100);
};

export const getMatchScoreColor = (score) => {
  if (score >= 80) return '#10B981'; // Emerald 500
  if (score >= 50) return '#F59E0B'; // Amber 500
  return '#F43F5E'; // Rose 500
};

export const getMatchScoreClass = (score) => {
  if (score >= 80) return 'high-match';
  if (score >= 50) return 'medium-match';
  return 'low-match';
};

export const getMatchingAndMissingSkills = (jobRequiredSkills, userSkills) => {
  if (!jobRequiredSkills) return { matching: [], missing: [] };
  const userSkillNames = (userSkills || []).map(s => s.name.toLowerCase());
  
  const matching = [];
  const missing = [];
  
  jobRequiredSkills.forEach(skill => {
    if (userSkillNames.includes(skill.toLowerCase())) {
      matching.push(skill);
    } else {
      missing.push(skill);
    }
  });
  
  return { matching, missing };
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
