import React from 'react';
import { Link } from 'react-router-dom';
import { SearchX, RefreshCw } from 'lucide-react';

const EmptyState = ({
  icon: Icon = SearchX,
  title = "No results found",
  description = "Try adjusting your search criteria, resetting filters, or adding skills to your profile.",
  actionText,
  onAction,
  actionLink
}) => {
  return (
    <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center', margin: '1.5rem 0' }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'rgba(139, 92, 246, 0.1)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem',
        color: 'var(--primary-hover)'
      }}>
        <Icon size={32} />
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
        {title}
      </h3>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '440px', margin: '0 auto 1.5rem auto', lineHeight: 1.6 }}>
        {description}
      </p>

      {actionText && actionLink && (
        <Link to={actionLink} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          {actionText}
        </Link>
      )}

      {actionText && onAction && !actionLink && (
        <button onClick={onAction} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCw size={16} /> {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
