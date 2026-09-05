import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Target, User } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">
          <Target size={24} />
          Skill-Centric
        </Link>
        
        <div className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
          <Link to="/skills" className={`nav-link ${isActive('/skills')}`}>My Skills</Link>
          <Link to="/jobs" className={`nav-link ${isActive('/jobs')}`}>Jobs</Link>
        </div>

        <div className="nav-links items-center">
          <span className="nav-link flex items-center gap-2"><User size={18} /> Profile</span>
          <button className="btn btn-outline" onClick={() => alert("Logout simulated")}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
