import React, { useState, useEffect } from 'react';
import Timer from './components/Timer/Timer';
import Controls from './components/Controls/Controls';
import Settings from './components/Settings/Settings';
import History from './components/History/History';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import './App.css';

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
