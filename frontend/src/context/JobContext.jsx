import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  getJobFeed,
  getJobs,
  getApplications,
  getSavedJobs,
  saveJob as apiSaveJob,
  removeSavedJob as apiRemoveSavedJob,
  applyToJob as apiApplyToJob,
  syncJobs as apiSyncJobs
} from '../services/api';
import { useAuth } from './AuthContext';

const JobContext = createContext();

export const useJobs = () => {
  const ctx = useContext(JobContext);
  return ctx || { feed: [], jobs: [], savedJobs: [], applications: [], loading: false, syncing: false, syncJobs: async () => ({ count: 0 }), saveJob: async () => false, removeSavedJob: async () => false, isJobSaved: () => false, applyToJob: async () => false, hasApplied: () => false, refreshJobs: async () => {} };
};

export const JobProvider = ({ children }) => {
  const [feed, setFeed] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (user) {
        const [feedRes, savedRes, appRes] = await Promise.all([
          getJobFeed().catch(() => ({ data: [] })),
          getSavedJobs().catch(() => ({ data: [] })),
          getApplications().catch(() => ({ data: [] }))
        ]);
        setFeed(feedRes.data || []);
        setSavedJobs(savedRes.data || []);
        setApplications(appRes.data || []);
      } else {
        // Guest user: fetch jobs catalog
        const jobsRes = await getJobs({ limit: 30 }).catch(() => ({ jobs: [] }));
        const list = jobsRes.jobs || [];
        setJobs(list);
        setFeed(list.map(j => ({
          ...j,
          id: j.jobId,
          matchPercentage: 75,
          matchedSkills: j.skills?.slice(0, 3) || [],
          missingSkills: j.skills?.slice(3) || []
        })));
      }
    } catch (error) {
      console.warn("Could not load initial job data:", error.message);
    }
    setLoading(false);
  };

  const handleSyncJobs = async (options = {}) => {
    setSyncing(true);
    try {
      const res = await apiSyncJobs(options);
      await loadData();
      setSyncing(false);
      return res;
    } catch (error) {
      setSyncing(false);
      throw error;
    }
  };

  const handleSaveJob = async (job) => {
    const jobId = job.id || job.jobId;
    try {
      await apiSaveJob(jobId, job);
      setSavedJobs(prev => [...prev, { jobId, jobDetails: job, createdAt: new Date() }]);
      return true;
    } catch (error) {
      console.error("Save job error:", error);
      return false;
    }
  };

  const handleRemoveSavedJob = async (jobId) => {
    try {
      await apiRemoveSavedJob(jobId);
      setSavedJobs(prev => prev.filter(item => item.jobId !== jobId));
      return true;
    } catch (error) {
      console.error("Remove saved job error:", error);
      return false;
    }
  };

  const isJobSaved = (jobId) => {
    return savedJobs.some(item => item.jobId === jobId);
  };

  const handleApplyToJob = async (job, notes = '') => {
    const jobId = job.id || job.jobId;
    try {
      const res = await apiApplyToJob(jobId, job.title, job.company, notes);
      if (res.success && res.data) {
        setApplications(prev => [...prev, res.data]);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Apply job error:", error);
      return false;
    }
  };

  const hasApplied = (jobId) => {
    return applications.some(app => app.jobId === jobId);
  };

  return (
    <JobContext.Provider
      value={{
        feed,
        jobs,
        savedJobs,
        applications,
        loading,
        syncing,
        syncJobs: handleSyncJobs,
        saveJob: handleSaveJob,
        removeSavedJob: handleRemoveSavedJob,
        isJobSaved,
        applyToJob: handleApplyToJob,
        hasApplied,
        refreshJobs: loadData
      }}
    >
      {children}
    </JobContext.Provider>
  );
};
