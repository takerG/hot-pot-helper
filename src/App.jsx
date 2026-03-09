import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ingredients, categories } from './data.js';
import { sauces, sauceCategories } from './sauces.js';
import SauceGuide, { SauceModal, FavoriteButton, useSauceFilter } from './SauceGuide.jsx';
import version from './version.js';
import './App.css';

// 格式化时间为 MM:SS 格式
function formatTime(seconds) {
  const mins = Math.floor(Math.max(0, seconds) / 60);
  const secs = Math.max(0, seconds) % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 播放提示音 - 使用单例模式
let audioContext = null;
function playAlarm() {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    const playTone = (freq, startTime, duration) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    const now = audioContext.currentTime;
    playTone(880, now, 0.5);
    playTone(880, now + 0.6, 0.5);
  } catch (e) {
    console.log('Audio not supported');
  }
}

// 震动反馈
function vibrate(pattern = 200) {
  if (navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      // 忽略震动 API 错误
    }
  }
}

// 单个计时器组件 - 使用 useMemo 优化
const Timer = React.memo(function Timer({ item, isActive, timeLeft, onToggle, onReset, onFinish, isFinished, onSauceClick }) {
  const progress = useMemo(() => {
    return item.time > 0 ? (timeLeft / item.time) * 100 : 0;
  }, [item.time, timeLeft]);

  const showFinished = timeLeft <= 0 && isFinished;

  useEffect(() => {
    if (timeLeft <= 0 && isActive) {
      playAlarm();
      vibrate([200, 100, 200, 100, 200]);
      onFinish(item.id);
    }
  }, [timeLeft, isActive, item.id, onFinish]);

  const getStatusClass = useCallback(() => {
    if (showFinished) return 'timer-finished';
    if (isActive) return 'timer-running';
    return '';
  }, [showFinished, isActive]);

  return (
    <div className={`timer-card ${getStatusClass()}`}>
      <div className="timer-header">
        <div className="timer-name-wrapper">
          <span className="timer-name">{item.name}</span>
          {showFinished && <span className="timer-checkmark">✓</span>}
          {item.recommendedSauce && !showFinished && (
            <button
              className="sauce-recommend-btn"
              onClick={(e) => {
                e.stopPropagation();
                onSauceClick(item.recommendedSauce);
              }}
              title="查看推荐蘸料"
            >
              🥣 推荐蘸料
            </button>
          )}
        </div>
        <span className="timer-duration">{formatTime(item.time)}</span>
      </div>

      <div className="timer-display">
        <span className={`timer-countdown ${showFinished ? 'finished' : ''}`}>
          {showFinished ? '完成!' : formatTime(timeLeft)}
        </span>
      </div>

      <div className="timer-progress">
        <div
          className="timer-progress-bar"
          style={{ width: `${showFinished ? 100 : Math.min(progress, 100)}%` }}
        />
      </div>

      <div className="timer-controls">
        <button
          className={`timer-btn ${isActive ? 'pause' : 'play'} ${showFinished ? 'finished' : ''}`}
          onClick={() => onToggle(item.id)}
        >
          {showFinished ? '已完成' : (isActive ? '暂停' : '开始')}
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
});

// 分类标签组件
const CategoryTabs = React.memo(function CategoryTabs({ activeCategory, onSelect }) {
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
});

// 食材列表组件
const IngredientList = React.memo(function IngredientList({ category, activeTimers, finishedTimers, onToggleTimer, onResetTimer, onTimerFinish, onSauceClick }) {
  const catData = ingredients[category];

  return (
    <div className="ingredient-list">
      <div className="ingredient-grid">
        {catData.items.map(item => {
          const timerState = activeTimers[item.id] || { isActive: false, timeLeft: item.time };
          const isFinished = finishedTimers.has(item.id);
          return (
            <Timer
              key={item.id}
              item={item}
              isActive={timerState.isActive}
              timeLeft={timerState.timeLeft}
              isFinished={isFinished}
              onToggle={onToggleTimer}
              onReset={onResetTimer}
              onFinish={onTimerFinish}
              onSauceClick={onSauceClick}
            />
          );
        })}
      </div>
    </div>
  );
});

// 活动计时器概览组件
const ActiveTimersOverview = React.memo(function ActiveTimersOverview({ activeTimers }) {
  const activeItems = useMemo(() => {
    return Object.entries(activeTimers)
      .filter(([_, state]) => state.isActive && state.timeLeft > 0)
      .map(([id, state]) => {
        for (const cat of categories) {
          const item = ingredients[cat].items.find(i => i.id === id);
          if (item) return { ...item, ...state };
        }
        return null;
      })
      .filter(Boolean);
  }, [activeTimers]);

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
});

// 已完成计时器概览组件
const FinishedTimersOverview = React.memo(function FinishedTimersOverview({ finishedTimers, activeTimers, onResetAll }) {
  const finishedItems = useMemo(() => {
    return Array.from(finishedTimers)
      .map(id => {
        for (const cat of categories) {
          const item = ingredients[cat].items.find(i => i.id === id);
          if (item) {
            const state = activeTimers[id];
            return { ...item, time: state?.timeLeft !== undefined ? state.timeLeft : item.time };
          }
        }
        return null;
      })
      .filter(Boolean);
  }, [finishedTimers, activeTimers]);

  if (finishedItems.length === 0) return null;

  return (
    <div className="finished-timers-overview">
      <div className="overview-header">
        <span className="overview-title finished-title">✅ 已完成</span>
        <div className="overview-actions">
          <span className="overview-count">{finishedItems.length}个食材</span>
          <button className="reset-all-btn" onClick={onResetAll}>
            🔄 一键重置
          </button>
        </div>
      </div>
      <div className="overview-items">
        {finishedItems.map(item => (
          <div key={item.id} className="overview-item finished">
            <span className="overview-item-name">{item.name}</span>
            <span className="overview-item-time">{formatTime(item.time)}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

// 计时器页面
function TimerPage({ activeTimers, finishedTimers, onToggleTimer, onResetTimer, onTimerFinish, onSauceClick, resetAllFinished }) {
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
          finishedTimers={finishedTimers}
          onToggleTimer={onToggleTimer}
          onResetTimer={onResetTimer}
          onTimerFinish={onTimerFinish}
          onSauceClick={onSauceClick}
        />
      </main>

      <FinishedTimersOverview
        finishedTimers={finishedTimers}
        activeTimers={activeTimers}
        onResetAll={resetAllFinished}
      />
    </>
  );
}

// 顶部导航
const TopNav = React.memo(function TopNav({ currentPage, onPageChange }) {
  const navItems = [
    { id: 'timer', icon: '🥬', label: '菜品' },
    { id: 'sauces', icon: '🥣', label: '蘸料手册' },
  ];

  return (
    <nav className="top-nav">
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
});

function App() {
  const [currentPage, setCurrentPage] = useState('timer');
  const [activeTimers, setActiveTimers] = useState({});
  const [finishedTimers, setFinishedTimers] = useState(new Set());
  const [selectedSauce, setSelectedSauce] = useState(null);

  // 从酱料数据中查找酱料 - 使用缓存
  const sauceCache = useMemo(() => {
    const cache = {};
    for (const cat of Object.values(sauces)) {
      for (const recipe of cat.recipes) {
        cache[recipe.id] = recipe;
      }
    }
    return cache;
  }, []);

  const findSauceById = useCallback((sauceId) => {
    return sauceCache[sauceId] || null;
  }, [sauceCache]);

  // 处理推荐蘸料点击
  const handleSauceClick = useCallback((sauceId) => {
    const recipe = findSauceById(sauceId);
    if (recipe) {
      setSelectedSauce(recipe);
    }
  }, [findSauceById]);

  // 计时器更新 - 优化：只在有活动计时器时更新
  useEffect(() => {
    const hasActiveTimers = Object.values(activeTimers).some(state => state.isActive && state.timeLeft > 0);
    if (!hasActiveTimers) return;

    const interval = setInterval(() => {
      setActiveTimers(prev => {
        const updated = {};
        let hasChanges = false;
        let hasActive = false;

        for (const [id, state] of Object.entries(prev)) {
          if (state.isActive && state.timeLeft > 0) {
            updated[id] = { ...state, timeLeft: state.timeLeft - 1 };
            hasChanges = true;
            hasActive = true;
          } else {
            updated[id] = state;
            if (state.isActive && state.timeLeft > 0) hasActive = true;
          }
        }

        // 如果没有活动计时器，清除 interval
        if (!hasActive) {
          // 会在下次 effect 运行时清除
        }

        return hasChanges ? updated : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimers]);

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
    let defaultTime = 60;
    for (const cat of categories) {
      const item = ingredients[cat].items.find(i => i.id === id);
      if (item) {
        defaultTime = item.time;
        break;
      }
    }
    setActiveTimers(prev => ({
      ...prev,
      [id]: { isActive: false, timeLeft: defaultTime }
    }));
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

  // 一键重置所有完成的计时器
  const resetAllFinished = useCallback(() => {
    setFinishedTimers(new Set());
    setActiveTimers(prev => {
      const updated = { ...prev };
      for (const [id, state] of Object.entries(prev)) {
        for (const cat of categories) {
          const item = ingredients[cat].items.find(i => i.id === id);
          if (item) {
            updated[id] = { isActive: false, timeLeft: item.time };
            break;
          }
        }
      }
      return updated;
    });
  }, []);

  // 蘸料手册页面的收藏夹状态 - 使用统一的 useSauceFilter
  const { favorites: sauceFavorites, toggleFavorite: toggleSauceFavorite } = useSauceFilter();

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">🍲 火锅助手</h1>
        <p className="app-subtitle">
          {currentPage === 'timer' ? '精准掌握每种食材的最佳口感' : '调配属于你的完美蘸料'}
        </p>
      </header>

      <nav className="top-nav">
        <TopNav currentPage={currentPage} onPageChange={setCurrentPage} />
      </nav>

      <div className="page-content">
        {currentPage === 'timer' ? (
          <TimerPage
            activeTimers={activeTimers}
            onToggleTimer={handleToggleTimer}
            onResetTimer={handleResetTimer}
            onTimerFinish={handleTimerFinish}
            finishedTimers={finishedTimers}
            onSauceClick={handleSauceClick}
            resetAllFinished={resetAllFinished}
          />
        ) : (
          <SauceGuide />
        )}
      </div>

      {/* 蘸料详情弹窗 - 全局可用 */}
      {selectedSauce && (
        <SauceModal
          recipe={selectedSauce}
          onClose={() => setSelectedSauce(null)}
          isFavorite={sauceFavorites.includes(selectedSauce.id)}
          onToggleFavorite={() => toggleSauceFavorite(selectedSauce.id)}
        />
      )}

      <footer className="app-footer">
        <p>Version {version}</p>
      </footer>
    </div>
  );
}

export default App;
