import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Target, AlertCircle } from 'lucide-react';
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
      setError(res.message || 'Invalid credentials');
    }
  };

  return (
    <div className="main-content container" style={{ maxWidth: '440px', paddingTop: '4rem' }}>
      <div className="card" style={{ padding: '2.5rem' }}>
        <div className="text-center" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '0.75rem', background: '#EEF2FF', borderRadius: '12px', color: 'var(--primary)', marginBottom: '0.75rem' }}>
            <Target size={32} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Sign in to access your skill-centric job feed
          </p>
        </div>

        {error && (
          <div style={{ padding: '0.75rem', background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Email Address
            </label>
            <input
              type="email"
              required
              className="search-input"
              style={{ paddingLeft: '1rem' }}
              placeholder="candidate@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Password
            </label>
            <input
              type="password"
              required
              className="search-input"
              style={{ paddingLeft: '1rem' }}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Create one free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
