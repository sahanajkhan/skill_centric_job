import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import SkillProfile from './pages/SkillProfile';
import SavedJobs from './pages/SavedJobs';
import ProjectBuilder from './pages/ProjectBuilder';
import ApiSources from './pages/ApiSources';
import Login from './pages/Login';
import Register from './pages/Register';
import Applications from './pages/Applications';
import Profile from './pages/Profile';
import { AuthProvider } from './context/AuthContext';
import { SkillProvider } from './context/SkillContext';
import { JobProvider } from './context/JobContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <SkillProvider>
        <JobProvider>
          <Router>
            <div className="app-layout">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/skills" element={<SkillProfile />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/:id" element={<JobDetails />} />
                <Route path="/saved-jobs" element={<SavedJobs />} />
                <Route path="/projects" element={<ProjectBuilder />} />
                <Route path="/apis" element={<ApiSources />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </div>
          </Router>
        </JobProvider>
      </SkillProvider>
    </AuthProvider>
  );
}

export default App;
