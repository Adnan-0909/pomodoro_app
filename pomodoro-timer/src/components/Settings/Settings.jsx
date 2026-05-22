import React from 'react';
import './Settings.css';

const Settings = ({ focusDuration, breakDuration, onFocusChange, onBreakChange, isRunning }) => {
  const handleChange = (value, callback) => {
    const num = Math.max(1, Math.min(60, parseInt(value) || 1));
    callback(num);
  };

  return (
    <div className="settings">
      <div className="settings-group">
        <label htmlFor="focus-input">Focus Duration</label>
        <div className="settings-input-wrapper">
          <input
            id="focus-input"
            type="number"
            min="1"
            max="60"
            value={focusDuration}
            onChange={(e) => handleChange(e.target.value, onFocusChange)}
            disabled={isRunning}
            className="settings-input"
          />
          <span className="settings-unit">min</span>
        </div>
      </div>
      <div className="settings-group">
        <label htmlFor="break-input">Break Duration</label>
        <div className="settings-input-wrapper">
          <input
            id="break-input"
            type="number"
            min="1"
            max="60"
            value={breakDuration}
            onChange={(e) => handleChange(e.target.value, onBreakChange)}
            disabled={isRunning}
            className="settings-input"
          />
          <span className="settings-unit">min</span>
        </div>
      </div>
    </div>
  );
};

export default Settings;