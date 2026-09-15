import axios from 'axios';
import { MOCK_JOBS, MOCK_USER_SKILLS } from '../utils/constants';

const BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Mock State for MVP
let mockSkills = [...MOCK_USER_SKILLS];

// === AUTHENTICATION API ===
export const loginUser = async (credentials) => {
  return await api.post('/auth/login', credentials);
};

export const registerUser = async (userData) => {
  return await api.post('/auth/register', userData);
};

export const googleLoginUser = async (token) => {
  return await api.post('/auth/google', { token });
};

export const getCurrentUser = async () => {
  return await api.get('/auth/me');
};

export const updateUserProfile = async (profileData) => {
  return await api.put('/users/profile', profileData);
};

// === SKILLS API ===
export const getSkills = async () => {
  return new Promise(resolve => resolve({ data: mockSkills }));
};

export const addSkill = async (skill) => {
  if (!mockSkills.includes(skill)) {
    mockSkills = [...mockSkills, skill];
  }
  return new Promise(resolve => resolve({ data: mockSkills }));
};

export const removeSkill = async (skill) => {
  mockSkills = mockSkills.filter(s => s !== skill);
  return new Promise(resolve => resolve({ data: mockSkills }));
};

// === RESUME API ===
export const uploadResume = async (file) => {
  // Simulate AI extraction delay
  return new Promise(resolve => {
    setTimeout(() => {
      const extracted = ['React', 'Python', 'SQL', 'Git'];
      extracted.forEach(s => {
        if (!mockSkills.includes(s)) mockSkills.push(s);
      });
      resolve({ data: { extracted_skills: extracted, all_skills: mockSkills } });
    }, 2000);
  });
};

// === JOBS & RECOMMENDATIONS API ===
export const getRecommendations = async () => {
  return await api.get('/recommendations');
};

export const getJobById = async (jobId) => {
  return new Promise((resolve, reject) => {
    const job = MOCK_JOBS.find(j => j.id === parseInt(jobId));
    if (job) resolve({ data: job });
    else reject(new Error('Job not found'));
  });
};

export default api;
