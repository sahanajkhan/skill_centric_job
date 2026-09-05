import React, { createContext, useState, useContext, useEffect } from 'react';
import { getJobFeed, getApplications, applyToJob as apiApplyToJob } from '../services/api';
import { useAuth } from './AuthContext';

const JobContext = createContext();

export const useJobs = () => useContext(JobContext);

export const JobProvider = ({ children }) => {
  const [feed, setFeed] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadData();
    } else {
      setFeed([]);
      setApplications([]);
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [feedRes, appRes] = await Promise.all([
        getJobFeed(),
        getApplications()
      ]);
      setFeed(feedRes.data);
      setApplications(appRes.data);
    } catch (error) {
      console.error("Failed to load job data", error);
    }
    setLoading(false);
  };

  const applyToJob = async (jobId) => {
    try {
      const res = await apiApplyToJob(jobId);
      setApplications([...applications, res.data]);
      return true;
    } catch (error) {
      console.error("Failed to apply", error);
      return false;
    }
  };

  const hasApplied = (jobId) => {
    return applications.some(app => app.jobId === jobId);
  };

  return (
    <JobContext.Provider value={{ feed, applications, loading, applyToJob, hasApplied, refreshJobs: loadData }}>
      {children}
    </JobContext.Provider>
  );
};
