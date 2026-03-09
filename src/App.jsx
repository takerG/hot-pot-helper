import { useState, useEffect, useCallback } from 'react';
import { ingredients, categories } from './data.js';
import { sauces, sauceCategories } from './sauces.js';
import SauceGuide, { SauceModal, FavoriteButton } from './SauceGuide.jsx';
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
function Timer({ item, isActive, timeLeft, onToggle, onReset, onFinish, isFinished, onSauceClick }) {
  const progress = item.time > 0 ? (timeLeft / item.time) * 100 : 0;
  const showFinished = timeLeft <= 0 && isFinished;

  useEffect(() => {
    if (timeLeft <= 0 && isActive) {
      playAlarm();
      vibrate([200, 100, 200, 100, 200]);
      onFinish(item.id);
    }
  }, [timeLeft, isActive, item.id, onFinish]);

  const getStatusClass = () => {
    if (showFinished) return 'timer-finished';
    if (isActive) return 'timer-running';
    return '';
  };

  return (
    <div className={`timer-card ${getStatusClass()}`}>
      <div className="timer-header">
        <div>
          <span className="timer-name">{item.name}</span>
          {item.recommendedSauce && (
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
          {showFinished ? '✓ 完成!' : formatTime(timeLeft)}
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
function IngredientList({ category, activeTimers, finishedTimers, onToggleTimer, onResetTimer, onTimerFinish, onSauceClick }) {
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
function TimerPage({ activeTimers, finishedTimers, onToggleTimer, onResetTimer, onTimerFinish, clearFinished, onSauceClick }) {
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

      {finishedTimers.size > 0 && (
        <div className="finished-toast" onClick={clearFinished}>
          <span>✅ {finishedTimers.size}个食材已完成</span>
          <span className="toast-hint">点击关闭</span>
        </div>
      )}
    </>
  );
}

// 顶部导航
function TopNav({ currentPage, onPageChange }) {
  const navItems = [
    { id: 'timer', icon: '⏱️', label: '计时器' },
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
}

function App() {
  const [currentPage, setCurrentPage] = useState('timer');
  const [activeTimers, setActiveTimers] = useState({});
  const [finishedTimers, setFinishedTimers] = useState(new Set());
  const [selectedSauce, setSelectedSauce] = useState(null);

  // 从酱料数据中查找酱料
  const findSauceById = useCallback((sauceId) => {
    for (const cat of Object.values(sauces)) {
      const recipe = cat.recipes.find(r => r.id === sauceId);
      if (recipe) return recipe;
    }
    return null;
  }, []);

  // 处理推荐蘸料点击
  const handleSauceClick = useCallback((sauceId) => {
    const recipe = findSauceById(sauceId);
    if (recipe) {
      setSelectedSauce(recipe);
    }
  }, [findSauceById]);

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

  // 蘸料手册页面的收藏夹状态
  const [sauceFavorites, setSauceFavorites] = useState(() => {
    const saved = localStorage.getItem('sauce-favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleSauceFavorite = useCallback((id) => {
    setSauceFavorites(prev => {
      const next = prev.includes(id)
        ? prev.filter(f => f !== id)
        : [...prev, id];
      localStorage.setItem('sauce-favorites', JSON.stringify(next));
      return next;
    });
  }, []);

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
            clearFinished={clearFinished}
            onSauceClick={handleSauceClick}
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
