import React, { useState, useEffect } from 'react';
import Timer from './components/Timer/Timer';
import Controls from './components/Controls/Controls';
import Settings from './components/Settings/Settings';
import History from './components/History/History';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import './App.css';
import { predictFocusReadiness } from './services/focusApi';

function App() {
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [sessionHistory, setSessionHistory] = useState(() => {
    const stored = localStorage.getItem('pomodoroHistory');
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return parsed.filter(item => item.date === new Date().toDateString());
  });

  const [energy, setEnergy] = useState(5);
  const [stress, setStress] = useState(5);
  const [motivation, setMotivation] = useState(5);
  const [focusRecommendation, setFocusRecommendation] = useState(null);
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      isDarkMode ? 'dark' : 'light'
    );
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const addToHistory = (duration) => {
    const now = new Date();
    const newEntry = {
      duration,
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      date: now.toDateString(),
      type: 'focus'
    };
    const updated = [newEntry, ...sessionHistory];
    setSessionHistory(updated);
    localStorage.setItem('pomodoroHistory', JSON.stringify(updated));
  };

  const handleGetRecommendation = async () => {
    setIsLoadingRecommendation(true);
    try {
      const result = await predictFocusReadiness(energy, stress, motivation);
      console.log('Focus readiness:', result);
      setFocusRecommendation(result);
      setFocusDuration(result.target_minutes);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to get recommendation. Make sure backend is running on port 8000.');
    } finally {
      setIsLoadingRecommendation(false);
    }
  };

  return (
    <div className="app">
      <div className="app-wrapper">
        <header className="app-header">
          <div className="header-left">
            <h1 className="app-title">Focus</h1>
            <p className="app-subtitle">Focus Mode</p>
          </div>
          <ThemeToggle isDarkMode={isDarkMode} onToggle={setIsDarkMode} />
        </header>

        <div className="app-content">
          <main className="app-main">
            <div className="main-card">
              {/* Model Prediction Section - Above Timer */}
              <div className="focus-recommendation-section">
                <h3>Get Recommendation</h3>
                <div className="slider-group">
                  <div className="slider-item">
                    <label>Energy: {energy}</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={energy}
                      onChange={(e) => setEnergy(parseInt(e.target.value))}
                      disabled={isRunning}
                    />
                  </div>
                  <div className="slider-item">
                    <label>Stress: {stress}</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={stress}
                      onChange={(e) => setStress(parseInt(e.target.value))}
                      disabled={isRunning}
                    />
                  </div>
                  <div className="slider-item">
                    <label>Motivation: {motivation}</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={motivation}
                      onChange={(e) => setMotivation(parseInt(e.target.value))}
                      disabled={isRunning}
                    />
                  </div>
                </div>

                <button
                  onClick={handleGetRecommendation}
                  disabled={isRunning || isLoadingRecommendation}
                  className="recommendation-btn"
                >
                  {isLoadingRecommendation ? 'Loading...' : 'Get Recommendation'}
                </button>

                {focusRecommendation && (
                  <div className="recommendation-result">
                    <div className="score-display">
                      <strong>Focus Score: {focusRecommendation.focus_score}/100</strong>
                      <span className="category">{focusRecommendation.category}</span>
                    </div>
                    <p className="coach-message">{focusRecommendation.coach_message}</p>
                    <p className="target-minutes">Recommended: {focusRecommendation.target_minutes} minutes</p>
                  </div>
                )}
              </div>

              {/* Timer Section */}
              <p className="session-label">Stay present</p>
              <p className="session-subtitle">Deep work session in progress</p>
              
              <Timer
                focusDuration={focusDuration}
                breakDuration={breakDuration}
                isRunning={isRunning}
                onRunningChange={setIsRunning}
                onSessionComplete={addToHistory}
              />

              <Controls isRunning={isRunning} onRunningChange={setIsRunning} />

              <Settings
                focusDuration={focusDuration}
                breakDuration={breakDuration}
                onFocusChange={setFocusDuration}
                onBreakChange={setBreakDuration}
                isRunning={isRunning}
              />
            </div>
          </main>

          <aside className="app-sidebar">
            <History sessions={sessionHistory} />
          </aside>
        </div>
      </div>
    </div>
  );
}

export default App;
