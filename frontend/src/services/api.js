import axios from 'axios';
import { MOCK_JOBS, MOCK_USER_SKILLS } from '../utils/constants';

const BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock State for MVP
let mockSkills = [...MOCK_USER_SKILLS];

// === AUTHENTICATION API ===
export const login = async (credentials) => {
  return new Promise(resolve => resolve({ data: { token: 'mock-token', user: { id: 1, name: 'Student' } } }));
};

export const register = async (userData) => {
  return new Promise(resolve => resolve({ data: { token: 'mock-token', user: { id: 1, ...userData } } }));
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
  // Simulate network
  return new Promise(resolve => {
    setTimeout(() => {
      // In a real app, the backend calculates matching_skills, missing_skills, and match_score.
      // Since our mock data already has these pre-calculated for the default MOCK_USER_SKILLS, 
      // we'll just return the mock jobs directly for the MVP demo.
      // If mockSkills changes drastically, the mock data won't perfectly reflect it, 
      // but it's enough to demonstrate the UI workflow.
      resolve({ data: MOCK_JOBS });
    }, 800);
  });
};

export const getJobById = async (jobId) => {
  return new Promise((resolve, reject) => {
    const job = MOCK_JOBS.find(j => j.id === parseInt(jobId));
    if (job) resolve({ data: job });
    else reject(new Error('Job not found'));
  });
};

export default api;
