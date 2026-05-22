import React from 'react';
import './History.css';

const History = ({ sessions }) => {
  return (
    <div className="history">
      <h3 className="history-title">Daily History</h3>
      {sessions.length === 0 ? (
        <p className="history-empty">No sessions yet.</p>
      ) : (
        <ul className="history-list">
          {sessions.map((session, idx) => (
            <li key={idx} className="history-item">
              <div className="history-icon">✓</div>
              <div className="history-content">
                <div className="history-label">Deep Focus</div>
                <div className="history-duration">{session.duration}m</div>
              </div>
              <div className="history-time">{session.time}</div>
            </li>
          ))}
        </ul>
      )}
      <div className="history-stats">
        <div className="stat">
          <div className="stat-value">{sessions.length}</div>
          <div className="stat-label">Sessions</div>
        </div>
        <div className="stat">
          <div className="stat-value">{sessions.reduce((acc, s) => acc + s.duration, 0)}</div>
          <div className="stat-label">Minutes</div>
        </div>
      </div>
    </div>
  );
};

export default History;