import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, User as UserIcon, LogOut, Code, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar" style={{ padding: '1rem 0', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container nav-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Logo */}
        <Link to="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '700', fontSize: '1.5rem', color: 'var(--text-main)', textDecoration: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #38bdf8 100%)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
            <Briefcase size={24} color="white" />
          </div>
          Skill<span style={{ color: 'var(--primary)' }}>Centric</span>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-menu desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/jobs" className={`nav-link ${isActive('/jobs')}`} style={{ color: isActive('/jobs') ? 'var(--primary-hover)' : 'var(--text-main)' }}>Find Jobs</Link>
          
          {user ? (
            <>
              <Link to="/skills" className={`nav-link ${isActive('/skills')}`} style={{ color: isActive('/skills') ? 'var(--primary-hover)' : 'var(--text-main)' }}>My Skills</Link>
              <Link to="/profile" className={`nav-link ${isActive('/profile')}`} style={{ color: isActive('/profile') ? 'var(--primary-hover)' : 'var(--text-main)' }}>Profile</Link>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem', paddingLeft: '1rem', borderLeft: '1px solid var(--border)' }}>
                <span style={{ fontWeight: '500', color: 'var(--text-main)' }}>{user.name?.split(' ')[0]}</span>
                <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
