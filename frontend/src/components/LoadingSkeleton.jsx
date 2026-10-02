import React from 'react';

const LoadingSkeleton = ({ count = 3 }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="card"
          style={{
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
            background: 'rgba(30, 41, 59, 0.5)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ width: '60%' }}>
              <div style={{ height: '24px', width: '80%', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', marginBottom: '0.5rem' }}></div>
              <div style={{ height: '16px', width: '40%', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px' }}></div>
            </div>
            <div style={{ height: '45px', width: '65px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '8px' }}></div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ height: '22px', width: '70px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '12px' }}></div>
            <div style={{ height: '22px', width: '90px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '12px' }}></div>
            <div style={{ height: '22px', width: '60px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '12px' }}></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
            <div style={{ height: '18px', width: '120px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px' }}></div>
            <div style={{ height: '32px', width: '140px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '6px' }}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
