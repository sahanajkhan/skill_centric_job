import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Target,
  Bookmark,
  Cpu,
  Database,
  LayoutDashboard,
  Briefcase,
  LogOut,
  LogIn,
  FileText,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on route change or resize
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isActive = (path) => (location.pathname === path ? 'active' : '');

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/jobs', label: 'Jobs', icon: Briefcase },
    { path: '/skills', label: 'Skills', icon: Cpu },
    { path: '/projects', label: 'AI Projects', icon: Sparkles },
    { path: '/saved-jobs', label: 'Saved', icon: Bookmark },
    { path: '/applications', label: 'Applications', icon: FileText },
    { path: '/apis', label: 'APIs', icon: Database },
  ];

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="logo-icon-box">
            <Target size={20} />
          </div>
          <span className="logo-text">Skill-Centric</span>
          <span className="logo-ai-badge">AI</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="navbar-center-links desktop-only">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`navbar-item ${isActive(item.path)}`}
              >
                <Icon size={15} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right Section: User Profile or Auth Buttons */}
        <div className="navbar-actions desktop-only">
          {user ? (
            <div className="navbar-user-section">
              <Link to="/profile" className="user-profile-badge" title="View Profile">
                <div className="user-avatar-dot">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="user-profile-name">{user.name}</span>
              </Link>
              <button
                className="btn-logout"
                onClick={handleLogout}
                title="Log out"
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="navbar-auth-buttons">
              <Link to="/login" className="btn-nav-signin">
                <LogIn size={15} /> Sign In
              </Link>
              <Link to="/register" className="btn-nav-getstarted">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="navbar-hamburger mobile-only"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-drawer mobile-only">
          <div className="mobile-nav-list">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={`m-${item.path}`}
                  to={item.path}
                  className={`mobile-nav-link ${isActive(item.path)}`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="mobile-drawer-footer">
            {user ? (
              <div className="mobile-user-box">
                <Link to="/profile" className="mobile-user-info">
                  <div className="user-avatar-dot">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#F8FAFC' }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.targetRole || 'Developer'}</div>
                  </div>
                </Link>
                <button
                  className="btn-logout"
                  onClick={handleLogout}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div className="mobile-auth-grid">
                <Link to="/login" className="btn-nav-signin" style={{ textAlign: 'center', justifyContent: 'center' }}>
                  <LogIn size={15} /> Sign In
                </Link>
                <Link to="/register" className="btn-nav-getstarted" style={{ textAlign: 'center', justifyContent: 'center' }}>
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
