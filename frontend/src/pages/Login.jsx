import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Target, AlertCircle, Zap, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login({ email, password });
    setLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message || 'Invalid email or password');
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@skillcentric.dev');
    setPassword('password123');
    setLoading(true);
    setError('');
    
    // Attempt login or fallback guest demo
    const res = await login({ email: 'demo@skillcentric.dev', password: 'password123' });
    setLoading(false);
    
    if (res.success) {
      navigate('/dashboard');
    } else {
      // Direct demo redirect
      navigate('/dashboard');
    }
  };

  return (
    <div className="main-content container" style={{ maxWidth: '440px', paddingTop: '3rem' }}>
      <div className="card" style={{ padding: '2.5rem' }}>
        <div className="text-center" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '0.85rem', background: 'rgba(139, 92, 246, 0.12)', borderRadius: 'var(--radius-md)', color: 'var(--primary-hover)', marginBottom: '0.75rem', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
            <Target size={34} />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Sign in to access your skill-centric job matching feed
          </p>
        </div>

        {error && (
          <div style={{ padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--error)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
              Email Address
            </label>
            <input
              type="email"
              required
              className="search-input"
              style={{ paddingLeft: '1rem', width: '100%' }}
              placeholder="candidate@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
              Password
            </label>
            <input
              type="password"
              required
              className="search-input"
              style={{ paddingLeft: '1rem', width: '100%' }}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.8rem', fontSize: '1rem', gap: '0.5rem' }}
          >
            <LogIn size={18} /> {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Login Quick Action */}
        <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
          <button
            onClick={handleDemoLogin}
            className="btn btn-secondary"
            style={{ width: '100%', fontSize: '0.875rem', gap: '0.5rem' }}
          >
            <Zap size={16} color="var(--warning)" /> Quick Demo Sign In
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary-hover)', fontWeight: 600 }}>
            Create one free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
