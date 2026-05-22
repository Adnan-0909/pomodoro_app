import React, { useState, useEffect, useRef } from 'react';
import './Timer.css';

const Timer = ({
  focusDuration,
  breakDuration,
  isRunning,
  onRunningChange,
  onSessionComplete,
}) => {
  const [isBreak, setIsBreak] = useState(false);
  const [timeLeft, setTimeLeft] = useState(focusDuration * 60);
  const [isPaused, setIsPaused] = useState(false);
  const targetTimeRef = useRef(null);

  useEffect(() => {
    setTimeLeft(focusDuration * 60);
    targetTimeRef.current = null;
  }, [focusDuration]);

  useEffect(() => {
    setTimeLeft(breakDuration * 60);
    targetTimeRef.current = null;
  }, [breakDuration]);

  useEffect(() => {
    if (!isRunning || isPaused) {
      return;
    }

    if (targetTimeRef.current === null) {
      targetTimeRef.current = Date.now() + timeLeft * 1000;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((targetTimeRef.current - now) / 1000));

      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        handleSessionComplete();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, isPaused, timeLeft]);

  useEffect(() => {
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const seconds = String(timeLeft % 60).padStart(2, '0');
    document.title = `${minutes}:${seconds} - Pomodoro`;
  }, [timeLeft]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPaused(!isPaused);
      }
      if (e.key.toLowerCase() === 'r') {
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, isRunning]);

  const handleSessionComplete = () => {
    playNotification();
    if (!isBreak) {
      onSessionComplete(focusDuration);
    }
    setIsBreak(!isBreak);
    targetTimeRef.current = null;
    const newDuration = isBreak ? focusDuration : breakDuration;
    setTimeLeft(newDuration * 60);
    onRunningChange(true);
  };

  const playNotification = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const handleReset = () => {
    onRunningChange(false);
    setIsPaused(false);
    setIsBreak(false);
    targetTimeRef.current = null;
    setTimeLeft(focusDuration * 60);
  };

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');
  const totalSeconds = isBreak ? breakDuration * 60 : focusDuration * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  return (
    <div className={`timer ${isBreak ? 'timer--break' : 'timer--focus'} ${isPaused ? 'timer--paused' : ''}`}>
      <div className="timer-ring-container">
        <svg className="timer-ring" viewBox="0 0 200 200">
          <circle className="timer-ring-bg" cx="100" cy="100" r="90" />
          <circle
            className="timer-ring-progress"
            cx="100"
            cy="100"
            r="90"
            style={{ strokeDashoffset: 565.48 - (565.48 * progress) / 100 }}
          />
        </svg>
        <div className="timer-display">
          <div className="timer-time">
            {minutes}:{seconds}
          </div>
          <div className="timer-label">
            {isBreak ? 'BREAK' : 'WORK PHASE'}
          </div>
          {isPaused && <div className="timer-paused-badge">PAUSED</div>}
        </div>
      </div>
    </div>
  );
};

export default Timer;