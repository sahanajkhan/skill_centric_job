import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Target, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const isActive = (path) => location.pathname === path ? 'active' : '';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">
          <Target size={24} />
          Skill-Centric
        </Link>
        
        <div className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
          {user && (
            <>
              <Link to="/skills" className={`nav-link ${isActive('/skills')}`}>My Skills</Link>
              <Link to="/jobs" className={`nav-link ${isActive('/jobs')}`}>Jobs</Link>
            </>
          )}
        </div>

        <div className="nav-links items-center">
          {user ? (
            <>
              <span className="nav-link flex items-center gap-2">
                <User size={18} /> {user.name || 'Profile'}
              </span>
              <button className="btn btn-outline flex items-center gap-2" onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Log In</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
