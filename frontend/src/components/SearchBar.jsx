import React from 'react';
import { Search, MapPin, X, SlidersHorizontal } from 'lucide-react';

const SearchBar = ({
  searchTerm = '',
  onSearchChange,
  locationTerm = '',
  onLocationChange,
  selectedRole = '',
  onRoleChange,
  onClear,
  onToggleFilters,
  showFilterToggle = true
}) => {
  const roles = [
    'All Roles',
    'Frontend Developer',
    'Backend Engineer',
    'Full Stack Engineer',
    'React Developer',
    'Node.js Engineer',
    'Python Developer',
    'DevOps / Cloud Engineer',
    'UI/UX Developer'
  ];

  return (
    <div className="search-bar-container card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px 200px auto', gap: '0.75rem', alignItems: 'center' }}>
        
        {/* Keyword Search */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by job title, skill (e.g. React, Node), or company..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.5rem', paddingRight: searchTerm ? '2.5rem' : '1rem' }}
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              style={{ position: 'absolute', right: '0.75rem', color: 'var(--text-muted)', display: 'flex' }}
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Location Search */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <MapPin size={18} style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Location or Remote"
            value={locationTerm}
            onChange={(e) => onLocationChange(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.5rem' }}
          />
        </div>

        {/* Role Select Filter */}
        <div>
          <select
            value={selectedRole}
            onChange={(e) => onRoleChange(e.target.value)}
            style={{ width: '100%', cursor: 'pointer' }}
          >
            {roles.map((role) => (
              <option key={role} value={role === 'All Roles' ? '' : role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {showFilterToggle && (
            <button
              onClick={onToggleFilters}
              className="btn btn-secondary"
              style={{ padding: '0.75rem 1rem' }}
              title="Toggle Advanced Filters"
            >
              <SlidersHorizontal size={18} />
              <span className="hide-mobile">Filters</span>
            </button>
          )}
          {(searchTerm || locationTerm || selectedRole) && (
            <button
              onClick={onClear}
              className="btn btn-outline"
              style={{ padding: '0.75rem 1rem' }}
            >
              Clear
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default SearchBar;
