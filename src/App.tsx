import { useState, useEffect } from 'react';
import './App.css';

const NOVEMBER_2024_START = new Date('2024-11-01T00:00:00').getTime();
const NOVEMBER_DAYS = 30;

const mantras = [
  "Discipline is the bridge between goals and accomplishment.",
  "The body achieves what the mind believes.",
  "Strength does not come from winning. Your struggles develop your strengths.",
  "Victory belongs to the most persevering.",
  "Master your mind, master your destiny.",
  "Every moment of resistance builds character.",
  "The oak fought the wind and was broken. The willow bent and survived.",
  "Self-control is strength. Calmness is mastery.",
];

function App() {
  const [currentDay, setCurrentDay] = useState(1);
  const [streak, setStreak] = useState(0);
  const [completedDays, setCompletedDays] = useState<boolean[]>(() => {
    const saved = localStorage.getItem('nnn-completed-days');
    return saved ? JSON.parse(saved) : Array(NOVEMBER_DAYS).fill(false);
  });
  const [lastFailedDay, setLastFailedDay] = useState<number | null>(() => {
    const saved = localStorage.getItem('nnn-last-failed');
    return saved ? JSON.parse(saved) : null;
  });
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [currentMantra, setCurrentMantra] = useState(mantras[0]);

  useEffect(() => {
    localStorage.setItem('nnn-completed-days', JSON.stringify(completedDays));
  }, [completedDays]);

  useEffect(() => {
    localStorage.setItem('nnn-last-failed', JSON.stringify(lastFailedDay));
  }, [lastFailedDay]);

  useEffect(() => {
    const calculateCurrentDay = () => {
      const now = new Date().getTime();
      const diff = now - NOVEMBER_2024_START;
      const day = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
      return Math.max(1, Math.min(day, NOVEMBER_DAYS));
    };
    setCurrentDay(calculateCurrentDay());

    const interval = setInterval(() => {
      setCurrentDay(calculateCurrentDay());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let count = 0;
    for (let i = 0; i < completedDays.length; i++) {
      if (completedDays[i]) {
        count++;
      } else if (i < currentDay - 1) {
        count = 0;
      }
    }
    setStreak(count);
  }, [completedDays, currentDay]);

  useEffect(() => {
    setCurrentMantra(mantras[Math.floor(Math.random() * mantras.length)]);
    const interval = setInterval(() => {
      setCurrentMantra(mantras[Math.floor(Math.random() * mantras.length)]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const toggleDay = (dayIndex: number) => {
    if (dayIndex >= currentDay) return;
    const newCompleted = [...completedDays];
    newCompleted[dayIndex] = !newCompleted[dayIndex];
    setCompletedDays(newCompleted);
  };

  const reportFailure = () => {
    setLastFailedDay(currentDay);
    const newCompleted = [...completedDays];
    for (let i = currentDay - 1; i < NOVEMBER_DAYS; i++) {
      newCompleted[i] = false;
    }
    setCompletedDays(newCompleted);
  };

  const resetChallenge = () => {
    setCompletedDays(Array(NOVEMBER_DAYS).fill(false));
    setLastFailedDay(null);
    setShowConfirmReset(false);
  };

  const completedCount = completedDays.filter(Boolean).length;
  const progressPercent = (completedCount / NOVEMBER_DAYS) * 100;
  const circumference = 2 * Math.PI * 140;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const getStatus = () => {
    if (lastFailedDay !== null) return 'FALLEN';
    if (completedCount === NOVEMBER_DAYS) return 'VICTORIOUS';
    if (streak >= 7) return 'STEADFAST';
    return 'PERSEVERING';
  };

  const status = getStatus();

  return (
    <div className="app">
      <div className="noise-overlay" />
      <div className="grid-lines" />

      <header className="header">
        <div className="header-badge">
          <span className="badge-text">OPERATION</span>
        </div>
        <h1 className="title">
          <span className="title-line">NO NUT</span>
          <span className="title-line accent">NOVEMBER</span>
        </h1>
        <div className="subtitle">ACCOUNTABILITY COMMAND CENTER</div>
      </header>

      <main className="main">
        <section className="progress-section">
          <div className="progress-ring-container">
            <svg className="progress-ring" viewBox="0 0 320 320">
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d4a574" />
                  <stop offset="100%" stopColor="#8b6914" />
                </linearGradient>
              </defs>
              <circle
                className="progress-ring-bg"
                cx="160"
                cy="160"
                r="140"
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="12"
              />
              <circle
                className="progress-ring-progress"
                cx="160"
                cy="160"
                r="140"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 160 160)"
              />
            </svg>
            <div className="progress-inner">
              <div className="progress-count">{completedCount}</div>
              <div className="progress-label">/ {NOVEMBER_DAYS} DAYS</div>
              <div className={`status-badge status-${status.toLowerCase()}`}>
                {status}
              </div>
            </div>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-value">{currentDay}</div>
              <div className="stat-label">CURRENT DAY</div>
            </div>
            <div className="stat-card highlight">
              <div className="stat-value">{streak}</div>
              <div className="stat-label">DAY STREAK</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{NOVEMBER_DAYS - currentDay + 1}</div>
              <div className="stat-label">DAYS LEFT</div>
            </div>
          </div>
        </section>

        <section className="calendar-section">
          <h2 className="section-title">MISSION LOG</h2>
          <div className="calendar-grid">
            {Array.from({ length: NOVEMBER_DAYS }, (_, i) => {
              const dayNum = i + 1;
              const isPast = dayNum < currentDay;
              const isToday = dayNum === currentDay;
              const isCompleted = completedDays[i];
              const isFailed = lastFailedDay !== null && dayNum >= lastFailedDay;

              return (
                <button
                  key={i}
                  className={`day-cell ${isPast ? 'past' : ''} ${isToday ? 'today' : ''} ${isCompleted ? 'completed' : ''} ${isFailed && dayNum >= lastFailedDay ? 'failed' : ''}`}
                  onClick={() => toggleDay(i)}
                  disabled={dayNum > currentDay}
                >
                  <span className="day-number">{dayNum}</span>
                  {isCompleted && <span className="check-mark">&#10003;</span>}
                  {isFailed && dayNum === lastFailedDay && <span className="fail-mark">&#10007;</span>}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mantra-section">
          <div className="mantra-container">
            <div className="mantra-icon">&#9775;</div>
            <p className="mantra-text">{currentMantra}</p>
          </div>
        </section>

        <section className="actions-section">
          <button
            className="action-btn complete-btn"
            onClick={() => {
              const newCompleted = [...completedDays];
              newCompleted[currentDay - 1] = true;
              setCompletedDays(newCompleted);
            }}
            disabled={completedDays[currentDay - 1] || lastFailedDay !== null}
          >
            <span className="btn-icon">&#9734;</span>
            LOG TODAY AS COMPLETE
          </button>

          <button
            className="action-btn fail-btn"
            onClick={reportFailure}
            disabled={lastFailedDay !== null}
          >
            <span className="btn-icon">&#9760;</span>
            REPORT FAILURE
          </button>

          <button
            className="action-btn reset-btn"
            onClick={() => setShowConfirmReset(true)}
          >
            <span className="btn-icon">&#8634;</span>
            RESET MISSION
          </button>
        </section>
      </main>

      {showConfirmReset && (
        <div className="modal-overlay" onClick={() => setShowConfirmReset(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">CONFIRM RESET</h3>
            <p className="modal-text">Are you sure you want to reset all progress? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setShowConfirmReset(false)}>
                ABORT
              </button>
              <button className="modal-btn confirm" onClick={resetChallenge}>
                CONFIRM RESET
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <p>Requested by @WhaleTonyOVO · Built by @clonkbot</p>
      </footer>
    </div>
  );
}

export default App;
