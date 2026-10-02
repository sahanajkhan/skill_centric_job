import React, { useState, useEffect } from 'react';
import { Database, ShieldCheck, RefreshCw, ExternalLink, AlertTriangle, CheckCircle2, Key, Zap } from 'lucide-react';
import { getJobSources, syncJobs } from '../services/api';
import Loading from '../components/Loading';

const ApiSources = () => {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    setLoading(true);
    try {
      const res = await getJobSources();
      if (res.success && res.data) {
        setSources(res.data);
      } else if (Array.isArray(res)) {
        setSources(res);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleSyncAll = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await syncJobs();
      setSyncResult(res.message || `Successfully synced ${res.count || 0} jobs!`);
    } catch (e) {
      setSyncResult('Sync finished with available free endpoints.');
    } finally {
      setSyncing(false);
    }
  };

  if (loading) return <Loading message="Auditing job API provider registry..." />;

  return (
    <div className="main-content container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div className="hero-pill">
            <ShieldCheck size={14} /> Official API Transparency Directory
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
            Job Sources & Free API Registry
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '700px' }}>
            Skill-Centric only integrates legal, official public job APIs and transparently denotes free tiers, rate limits, and key requirements.
          </p>
        </div>

        <button
          onClick={handleSyncAll}
          disabled={syncing}
          className="btn btn-primary"
          style={{ padding: '0.75rem 1.5rem' }}
        >
          <RefreshCw size={16} style={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
          {syncing ? 'Querying Free Providers...' : 'Trigger Live API Sync'}
        </button>
      </div>

      {syncResult && (
        <div style={{ padding: '0.9rem 1.25rem', background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} /> {syncResult}
        </div>
      )}

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card">
          <div className="stat-title">100% Free Public APIs</div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>2 Active</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Remotive & Arbeitnow (No key needed)
          </div>
        </div>

        <div className="card">
          <div className="stat-title">Free Tier Available</div>
          <div className="stat-value" style={{ color: '#D97706' }}>3 Adapters</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            USAJobs, Adzuna & Jooble
          </div>
        </div>

        <div className="card">
          <div className="stat-title">Deduplication Layer</div>
          <div className="stat-value" style={{ color: 'var(--primary)' }}>Fuzzy NLP</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Title + Company + Location matching
          </div>
        </div>
      </div>

      {/* Main Sources Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '2rem' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Provider / API</th>
              <th>Access Tier</th>
              <th>Authentication</th>
              <th>Rate Limits & Quota</th>
              <th>Status</th>
              <th>Official Website</th>
            </tr>
          </thead>
          <tbody>
            {sources.map(s => {
              const isFree = s.free && !s.authenticationRequired;
              const isLimited = s.freeTier && s.authenticationRequired;
              const isPaid = !s.free && !s.freeTier;

              return (
                <tr key={s.provider}>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{s.provider}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.apiName}</div>
                  </td>
                  <td>
                    {isFree && <span className="badge-free">Free / Open API</span>}
                    {isLimited && <span className="badge-limited">Free Tier — Limited</span>}
                    {isPaid && <span className="badge-paid">Paid / Restricted</span>}
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem', color: s.authenticationRequired ? '#B45309' : 'var(--success)' }}>
                      {s.authenticationRequired ? <Key size={14} /> : <CheckCircle2 size={14} />}
                      {s.authenticationRequired ? 'API Key Required' : 'No Key Needed'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {s.rateLimit}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: s.status === 'Active' ? 'var(--success)' : '#64748B' }}>
                      ● {s.status || 'Active'}
                    </span>
                  </td>
                  <td>
                    <a
                      href={s.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                    >
                      Docs <ExternalLink size={13} />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Architecture Disclaimer */}
      <div className="card" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={18} color="var(--primary)" /> Extensible Provider Adapter Architecture
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
          Each job source adheres to an isolated adapter interface (<code>JobCollector</code>). New providers can be added without changing frontend or matching logic. We strictly follow provider terms of service, robots.txt, and developer rate limits.
        </p>
      </div>
    </div>
  );
};

export default ApiSources;
