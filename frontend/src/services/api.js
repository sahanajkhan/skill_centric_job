import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// === AUTHENTICATION API ===
export const login = async (credentials) => {
  const res = await api.post('/auth/login', credentials);
  return res.data;
};

export const register = async (userData) => {
  const res = await api.post('/auth/register', userData);
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};

export const updateProfile = async (profileData) => {
  const res = await api.put('/users/profile', profileData);
  return res.data;
};

// === SKILLS API ===
export const getSkills = async () => {
  const res = await api.get('/skills');
  return res.data;
};

export const addSkill = async (name, category = '') => {
  const res = await api.post('/skills', { name, category });
  return res.data;
};

export const removeSkill = async (skillId) => {
  const res = await api.delete(`/skills/${skillId}`);
  return res.data;
};

export const uploadResume = async (fileOrFormData) => {
  let formData;
  if (fileOrFormData instanceof FormData) {
    formData = fileOrFormData;
  } else {
    formData = new FormData();
    formData.append('resume', fileOrFormData);
  }

  const res = await api.post('/skills/resume', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// === JOBS & RECOMMENDATIONS API ===
export const getJobs = async (params = {}) => {
  const res = await api.get('/jobs', { params });
  return res.data;
};

export const getJobById = async (jobId) => {
  const res = await api.get(`/jobs/${jobId}`);
  return res.data;
};

export const getJobFeed = async (params = {}) => {
  const res = await api.get('/jobs/feed', { params });
  return res.data;
};

export const syncJobs = async (options = {}) => {
  const res = await api.post('/jobs/sync', options);
  return res.data;
};

export const getJobSources = async () => {
  const res = await api.get('/jobs/sources');
  return res.data;
};

// === SAVED JOBS & APPLICATIONS ===
export const saveJob = async (jobId, jobDetails, notes = '') => {
  const res = await api.post('/saved-jobs', { jobId, jobDetails, notes });
  return res.data;
};

export const getSavedJobs = async () => {
  const res = await api.get('/saved-jobs');
  return res.data;
};

export const removeSavedJob = async (jobId) => {
  const res = await api.delete(`/saved-jobs/${jobId}`);
  return res.data;
};

export const applyToJob = async (jobId, jobTitle, company, notes = '') => {
  const res = await api.post('/applications', { jobId, jobTitle, company, notes });
  return res.data;
};

export const getApplications = async () => {
  const res = await api.get('/applications');
  return res.data;
};

// === AI SKILL ANALYSIS & PROJECT BUILDER ===
export const getSkillAnalysis = async () => {
  const res = await api.get('/recommendations/analysis');
  return res.data;
};

export const getRecommendedProjects = async () => {
  const res = await api.get('/recommendations/projects');
  return res.data;
};

export const generateProjectPlan = async (projectParams) => {
  const res = await api.post('/recommendations/generate-project', projectParams);
  return res.data;
};

export const getUserProjects = async () => {
  const res = await api.get('/recommendations/user-projects');
  return res.data;
};

export default api;
