import React from 'react';

const MatchScore = ({ score }) => {
  const rounded = Math.round(score || 0);
  let scoreClass = 'match-low';

  if (rounded >= 75) {
    scoreClass = 'match-high';
  } else if (rounded >= 45) {
    scoreClass = 'match-medium';
  }

  return (
    <div className={`match-score-badge ${scoreClass}`}>
      <span>{rounded}%</span>
      <span className="match-label">Match</span>
    </div>
  );
};

export default MatchScore;
