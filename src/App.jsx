import { useState, useEffect, useCallback } from 'react';
import { ingredients, categories } from './data.js';
import SauceGuide from './SauceGuide.jsx';
import version from './version.js';
import './App.css';

// 格式化时间为 MM:SS 格式
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 播放提示音
function playAlarm() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 880;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);

    setTimeout(() => {
      const osc2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();
      osc2.connect(gain2);
      gain2.connect(audioContext.destination);
      osc2.frequency.value = 880;
      osc2.type = 'sine';
      gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      osc2.start(audioContext.currentTime);
      osc2.stop(audioContext.currentTime + 0.5);
    }, 600);
  } catch (e) {
    console.log('Audio not supported');
  }
}

// 震动反馈
function vibrate(pattern = 200) {
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}

// 单个计时器组件
function Timer({ item, isActive, timeLeft, onToggle, onReset, onFinish }) {
  const progress = item.time > 0 ? (timeLeft / item.time) * 100 : 0;
  const isFinished = timeLeft <= 0 && isActive;

  useEffect(() => {
    if (isFinished) {
      playAlarm();
      vibrate([200, 100, 200, 100, 200]);
      onFinish(item.id);
    }
  }, [isFinished, item.id, onFinish]);

  const getStatusClass = () => {
    if (isFinished) return 'timer-finished';
    if (isActive) return 'timer-running';
    return '';
  };

  return (
    <div className={`timer-card ${getStatusClass()}`}>
      <div className="timer-header">
        <span className="timer-name">{item.name}</span>
        <span className="timer-duration">{formatTime(item.time)}</span>
      </div>

      <div className="timer-display">
        <span className={`timer-countdown ${isFinished ? 'finished' : ''}`}>
          {isFinished ? '完成!' : formatTime(timeLeft)}
        </span>
      </div>

      <div className="timer-progress">
        <div
          className="timer-progress-bar"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      <div className="timer-controls">
        <button
          className={`timer-btn ${isActive ? 'pause' : 'play'}`}
          onClick={() => onToggle(item.id)}
        >
          {isActive ? '暂停' : '开始'}
        </button>
        <button
          className="timer-btn reset"
          onClick={() => onReset(item.id)}
        >
          重置
        </button>
      </div>
    </div>
  );
}

// 分类标签组件
function CategoryTabs({ activeCategory, onSelect }) {
  return (
    <div className="category-tabs">
      {categories.map(catId => {
        const cat = ingredients[catId];
        return (
          <button
            key={catId}
            className={`category-tab ${activeCategory === catId ? 'active' : ''}`}
            onClick={() => onSelect(catId)}
          >
            <span className="tab-icon">{cat.icon}</span>
            <span className="tab-name">{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}

// 食材列表组件
function IngredientList({ category, activeTimers, onToggleTimer, onResetTimer, onTimerFinish }) {
  const catData = ingredients[category];

  return (
    <div className="ingredient-list">
      <div className="ingredient-grid">
        {catData.items.map(item => {
          const timerState = activeTimers[item.id] || { isActive: false, timeLeft: item.time };
          return (
            <Timer
              key={item.id}
              item={item}
              isActive={timerState.isActive}
              timeLeft={timerState.timeLeft}
              onToggle={onToggleTimer}
              onReset={onResetTimer}
              onFinish={onTimerFinish}
            />
          );
        })}
      </div>
    </div>
  );
}

// 活动计时器概览组件
function ActiveTimersOverview({ activeTimers }) {
  const activeItems = Object.entries(activeTimers)
    .filter(([_, state]) => state.isActive && state.timeLeft > 0)
    .map(([id, state]) => {
      for (const cat of categories) {
        const item = ingredients[cat].items.find(i => i.id === id);
        if (item) return { ...item, ...state };
      }
      return null;
    })
    .filter(Boolean);

  if (activeItems.length === 0) return null;

  return (
    <div className="active-timers-overview">
      <div className="overview-header">
        <span className="overview-title">🔥 进行中</span>
        <span className="overview-count">{activeItems.length}个食材</span>
      </div>
      <div className="overview-items">
        {activeItems.map(item => (
          <div key={item.id} className="overview-item">
            <span className="overview-item-name">{item.name}</span>
            <span className="overview-item-time">{formatTime(item.timeLeft)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 计时器页面
function TimerPage({ activeTimers, onToggleTimer, onResetTimer, onTimerFinish, finishedTimers, clearFinished }) {
  const [activeCategory, setActiveCategory] = useState('meats');

  return (
    <>
      <ActiveTimersOverview activeTimers={activeTimers} />

      <CategoryTabs
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      <main className="app-main">
        <IngredientList
          category={activeCategory}
          activeTimers={activeTimers}
          onToggleTimer={onToggleTimer}
          onResetTimer={onResetTimer}
          onTimerFinish={onTimerFinish}
        />
      </main>

      {finishedTimers.size > 0 && (
        <div className="finished-toast" onClick={clearFinished}>
          <span>✅ {finishedTimers.size}个食材已完成</span>
          <span className="toast-hint">点击关闭</span>
        </div>
      )}
    </>
  );
}

// 底部导航
function BottomNav({ currentPage, onPageChange }) {
  const navItems = [
    { id: 'timer', icon: '⏱️', label: '计时器' },
    { id: 'sauces', icon: '🥣', label: '蘸料手册' },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map(item => (
        <button
          key={item.id}
          className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
          onClick={() => onPageChange(item.id)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState('timer');
  const [activeTimers, setActiveTimers] = useState({});
  const [finishedTimers, setFinishedTimers] = useState(new Set());

  // 计时器更新
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTimers(prev => {
        const updated = {};
        let hasChanges = false;

        for (const [id, state] of Object.entries(prev)) {
          if (state.isActive && state.timeLeft > 0) {
            updated[id] = { ...state, timeLeft: state.timeLeft - 1 };
            hasChanges = true;
          } else {
            updated[id] = state;
          }
        }

        return hasChanges ? updated : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleToggleTimer = useCallback((id) => {
    setActiveTimers(prev => {
      const currentState = prev[id];
      if (!currentState) {
        let defaultTime = 60;
        for (const cat of categories) {
          const item = ingredients[cat].items.find(i => i.id === id);
          if (item) {
            defaultTime = item.time;
            break;
          }
        }
        return { ...prev, [id]: { isActive: true, timeLeft: defaultTime } };
      }
      return {
        ...prev,
        [id]: { ...currentState, isActive: !currentState.isActive }
      };
    });
  }, []);

  const handleResetTimer = useCallback((id) => {
    setActiveTimers(prev => {
      let defaultTime = 60;
      for (const cat of categories) {
        const item = ingredients[cat].items.find(i => i.id === id);
        if (item) {
          defaultTime = item.time;
          break;
        }
      }
      return {
        ...prev,
        [id]: { isActive: false, timeLeft: defaultTime }
      };
    });
    setFinishedTimers(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const handleTimerFinish = useCallback((id) => {
    setActiveTimers(prev => ({
      ...prev,
      [id]: { ...prev[id], isActive: false }
    }));
    setFinishedTimers(prev => new Set(prev).add(id));
  }, []);

  const clearFinished = useCallback(() => {
    setFinishedTimers(new Set());
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">
          {currentPage === 'timer' ? '🍲 火锅助手' : '🥣 蘸料手册'}
        </h1>
        <p className="app-subtitle">
          {currentPage === 'timer' ? '精准掌握每种食材的最佳口感' : '调配属于你的完美蘸料'}
        </p>
      </header>

      <div className="page-content">
        {currentPage === 'timer' ? (
          <TimerPage
            activeTimers={activeTimers}
            onToggleTimer={handleToggleTimer}
            onResetTimer={handleResetTimer}
            onTimerFinish={handleTimerFinish}
            finishedTimers={finishedTimers}
            clearFinished={clearFinished}
          />
        ) : (
          <SauceGuide />
        )}
      </div>

      <BottomNav currentPage={currentPage} onPageChange={setCurrentPage} />

      <footer className="app-footer">
        <p>Version {version}</p>
      </footer>
    </div>
  );
}

export default App;
