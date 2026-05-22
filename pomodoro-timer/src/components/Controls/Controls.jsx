import React from 'react';
import './Controls.css';

const Controls = ({ isRunning, onRunningChange }) => {
  return (
    <div className="controls">
      <button
        className={`controls-btn controls-btn--primary ${isRunning ? 'controls-btn--active' : ''}`}
        onClick={() => onRunningChange(!isRunning)}
        title="Space to toggle"
      >
        {isRunning ? '⏸ Pause' : '▶ Start'}
      </button>
      <button
        className="controls-btn controls-btn--secondary"
        onClick={() => onRunningChange(false)}
        title="R to reset"
      >
        ↻
      </button>
      <button
        className="controls-btn controls-btn--secondary"
        title="Skip to next"
      >
        ⤳
      </button>
    </div>
  );
};

export default Controls;