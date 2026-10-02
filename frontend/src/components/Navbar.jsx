import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Target, User, Bookmark, Cpu, Database, LayoutDashboard, Briefcase, LogOut, LogIn, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const isActive = (path) => (location.pathname === path ? 'active' : '');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">
          <Target size={24} color="var(--primary)" />
          <span>Skill-Centric</span>
        </Link>
        
        <div className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
          <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
            <LayoutDashboard size={16} /> Dashboard
          </Link>
          <Link to="/skills" className={`nav-link ${isActive('/skills')}`}>
            <Cpu size={16} /> My Skills
          </Link>
          <Link to="/jobs" className={`nav-link ${isActive('/jobs')}`}>
            <Briefcase size={16} /> Jobs
          </Link>
          <Link to="/saved-jobs" className={`nav-link ${isActive('/saved-jobs')}`}>
            <Bookmark size={16} /> Saved
          </Link>
          <Link to="/applications" className={`nav-link ${isActive('/applications')}`}>
            <FileText size={16} /> Applications
          </Link>
          <Link to="/projects" className={`nav-link ${isActive('/projects')}`}>
            <Cpu size={16} /> AI Projects
          </Link>
          <Link to="/apis" className={`nav-link ${isActive('/apis')}`}>
            <Database size={16} /> API Sources
          </Link>
        </div>

        <div className="nav-links" style={{ alignItems: 'center' }}>
          {user ? (
            <>
              <Link to="/profile" className={`nav-link ${isActive('/profile')}`} style={{ fontWeight: 600 }}>
                <User size={18} /> {user.name}
              </Link>
              <button className="btn btn-outline" onClick={handleLogout} title="Log out">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">
                <LogIn size={16} /> Sign In
              </Link>
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
