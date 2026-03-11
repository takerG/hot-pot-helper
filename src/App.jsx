import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ingredients, categories } from './data.js';
import { sauces, sauceCategories, soupBases, soupBaseCategories } from './sauces.js';
import SauceGuide, { SauceModal, FavoriteButton, useSauceFilter } from './SauceGuide.jsx';
import EditTimeModal from './EditTimeModal.jsx';
import version from './version.js';
import { playAlarm, cleanupAudio } from './utils/audio.js';
import { formatTime, getDefaultTime, getIngredientTime, saveCustomTime, removeCustomTime, hasCustomTime } from './utils/ingredients.js';
import { storage } from './utils/storage.js';
import './App.css';

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
const Timer = React.memo(function Timer({ item, isActive, timeLeft, onStart, onReset, onFinish, isFinished, onSauceClick, onEditTime }) {
  const currentTime = getIngredientTime(item.id);
  const progress = currentTime > 0 ? (timeLeft / currentTime) * 100 : 0;
  const showFinished = timeLeft <= 0 && isFinished;
  const hasCustom = hasCustomTime(item.id);

  // 获取计时器状态类名
  const getStatusClass = () => {
    if (showFinished) return 'timer-finished';
    if (isActive) return 'timer-running';
    return '';
  };

  const handleEditClick = useCallback((e) => {
    e.stopPropagation();
    onEditTime(item.id, item.name, currentTime);
  }, [item.id, item.name, currentTime, onEditTime]);

  return (
    <div className={`timer-card ${getStatusClass()}`}>
      <div className="timer-header">
        <div className="timer-name-wrapper">
          <span className="timer-name">{item.name}</span>
          {showFinished && <span className="timer-checkmark">✓</span>}
          {!showFinished && (
            <>
              <button
                className="edit-time-btn"
                onClick={handleEditClick}
                title={hasCustom ? '已自定义时间，点击编辑' : '点击设置时间'}
              >
                ⏱️
              </button>
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
            </>
          )}
        </div>
        <span className={`timer-duration ${hasCustom ? 'custom' : ''}`}>
          {formatTime(currentTime)}
          {hasCustom && <span className="custom-indicator" title="自定义时间">●</span>}
        </span>
      </div>

      {item.tip && (
        <div className="timer-tip">
          💡 {item.tip}
        </div>
      )}

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
          className={`timer-btn ${showFinished ? 'finished' : 'start'}`}
          onClick={() => onStart(item.id)}
          disabled={isActive}
        >
          {showFinished ? '已完成' : (isActive ? '计时中...' : '开始')}
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

// 分类标签组件 - 带计时状态指示
const CategoryTabs = React.memo(function CategoryTabs({ activeCategory, onSelect, activeTimers, finishedTimers }) {
  return (
    <div className="category-tabs">
      {categories.map(catId => {
        const cat = ingredients[catId];
        const activeCount = cat.items.filter(item => activeTimers[item.id]?.isActive).length;
        const finishedCount = cat.items.filter(item => finishedTimers.has(item.id)).length;
        const hasActive = activeCount > 0;
        const hasFinished = finishedCount > 0;

        return (
          <button
            key={catId}
            className={`category-tab ${activeCategory === catId ? 'active' : ''}`}
            onClick={() => onSelect(catId)}
          >
            <div className="tab-content">
              <span className="tab-icon">{cat.icon}</span>
              <span className="tab-name">{cat.name}</span>
            </div>
            {(hasActive || hasFinished) && (
              <div className="tab-indicator">
                {hasActive && <span className="indicator-dot active" title={`${activeCount}个计时中`} />}
                {hasFinished && <span className="indicator-dot finished" title={`${finishedCount}个已完成`} />}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
});

// 食材列表组件
const IngredientList = React.memo(function IngredientList({ category, activeTimers, finishedTimers, onStartTimer, onResetTimer, onTimerFinish, onSauceClick, onEditTime }) {
  const catData = ingredients[category];

  return (
    <div className="ingredient-list">
      <div className="ingredient-grid">
        {catData.items.map(item => {
          const timerState = activeTimers[item.id] || { isActive: false, timeLeft: getIngredientTime(item.id) };
          const isFinished = finishedTimers.has(item.id);
          return (
            <Timer
              key={item.id}
              item={item}
              isActive={timerState.isActive}
              timeLeft={timerState.timeLeft}
              isFinished={isFinished}
              onStart={onStartTimer}
              onReset={onResetTimer}
              onFinish={onTimerFinish}
              onSauceClick={onSauceClick}
              onEditTime={onEditTime}
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

// 锅底选择器组件
const SoupBaseSelector = React.memo(function SoupBaseSelector({ selectedSoupBase, onSelect }) {
  return (
    <div className="soup-base-selector">
      <div className="selector-header">
        <span className="selector-title">🍲 选择锅底</span>
        {selectedSoupBase && (
          <button className="clear-soup-btn" onClick={() => onSelect(null)}>
            取消选择
          </button>
        )}
      </div>
      <div className="soup-base-grid">
        {soupBaseCategories.map(catId => {
          const cat = soupBases[catId];
          return (
            <div key={catId} className="soup-base-category">
              <div
                className={`soup-base-card ${selectedSoupBase === catId ? 'selected' : ''}`}
                onClick={() => onSelect(selectedSoupBase === catId ? null : catId)}
              >
                <div className="soup-base-icon">{cat.icon}</div>
                <div className="soup-base-name">{cat.name}</div>
                <div className="soup-base-desc">{cat.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

// 推荐食材提示组件
const RecommendedIngredients = React.memo(function RecommendedIngredients({ soupBase, onStartTimer, activeTimers }) {
  if (!soupBase) return null;

  const baseData = soupBases[soupBase];
  const recommendedSauces = baseData.pairings?.[0]?.sauces || [];

  // 收集所有推荐的食材（根据推荐蘸料反推）
  const recommendedIngredientIds = useMemo(() => {
    const ids = new Set();
    for (const sauceId of recommendedSauces) {
      // 查找使用该蘸料作为推荐的所有食材
      for (const cat of categories) {
        for (const item of ingredients[cat].items) {
          if (item.recommendedSauce === sauceId) {
            ids.add(item.id);
          }
        }
      }
    }
    return Array.from(ids);
  }, [recommendedSauces]);

  if (recommendedIngredientIds.length === 0) return null;

  return (
    <div className="recommended-ingredients">
      <div className="recommend-header">
        <span className="recommend-title">
          🥢 {baseData.pairings?.[0]?.name}推荐搭配
        </span>
        <span className="recommend-count">{recommendedIngredientIds.length}种食材</span>
      </div>
      <div className="recommend-list">
        {recommendedIngredientIds.slice(0, 8).map(id => {
          const item = {};
          let found = null;
          for (const cat of categories) {
            found = ingredients[cat].items.find(i => i.id === id);
            if (found) {
              item.name = found.name;
              item.icon = ingredients[cat].icon;
              item.time = found.time;
              break;
            }
          }
          const isRunning = activeTimers[id]?.isActive;
          return (
            <button
              key={id}
              className={`recommend-item ${isRunning ? 'running' : ''}`}
              onClick={() => !isRunning && onStartTimer(id)}
              disabled={isRunning}
            >
              <span className="recommend-item-icon">{item.icon}</span>
              <span className="recommend-item-name">{item.name}</span>
              {isRunning && <span className="recommend-item-status">计时中</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
});

// 计时器页面
function TimerPage({ activeTimers, finishedTimers, onStartTimer, onResetTimer, onTimerFinish, onSauceClick, resetAllFinished, onEditTime }) {
  const [activeCategory, setActiveCategory] = useState('meats');
  const [selectedSoupBase, setSelectedSoupBase] = useState(() => {
    return storage.getJSON('selected-soup-base', null);
  });

  // 保存锅底选择
  useEffect(() => {
    storage.setJSON('selected-soup-base', selectedSoupBase);
  }, [selectedSoupBase]);

  return (
    <>
      <SoupBaseSelector
        selectedSoupBase={selectedSoupBase}
        onSelect={setSelectedSoupBase}
      />

      <RecommendedIngredients
        soupBase={selectedSoupBase}
        onStartTimer={onStartTimer}
        activeTimers={activeTimers}
      />

      <ActiveTimersOverview activeTimers={activeTimers} />
      <FinishedTimersOverview
        finishedTimers={finishedTimers}
        activeTimers={activeTimers}
        onResetAll={resetAllFinished}
      />

      <CategoryTabs
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
        activeTimers={activeTimers}
        finishedTimers={finishedTimers}
      />

      <main className="app-main">
        <IngredientList
          category={activeCategory}
          activeTimers={activeTimers}
          finishedTimers={finishedTimers}
          onStartTimer={onStartTimer}
          onResetTimer={onResetTimer}
          onTimerFinish={onTimerFinish}
          onSauceClick={onSauceClick}
          onEditTime={onEditTime}
        />
      </main>
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
  const [editingTime, setEditingTime] = useState(null); // { id, name, currentTime }
  const [settings, setSettings] = useState(() => ({
    soundEnabled: storage.getJSON('settings-sound', true),
  }));

  // 保存设置
  const updateSetting = useCallback((key, value) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      storage.setJSON('settings-sound', next);
      return next;
    });
  }, []);

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

  const handleStartTimer = useCallback((id) => {
    setActiveTimers(prev => {
      const currentState = prev[id];
      // 如果已经激活，忽略点击（防止重复点击）
      if (currentState?.isActive) return prev;

      if (!currentState) {
        return { ...prev, [id]: { isActive: true, timeLeft: getDefaultTime(id) } };
      }
      // 如果已存在但未激活（重置后），重新开始
      return {
        ...prev,
        [id]: { ...currentState, isActive: true }
      };
    });
  }, []);

  const handleResetTimer = useCallback((id) => {
    setActiveTimers(prev => ({
      ...prev,
      [id]: { isActive: false, timeLeft: getDefaultTime(id) }
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

    // 播放提示音和震动（根据设置）
    if (settings.soundEnabled) {
      playAlarm();
    }
    vibrate([200, 100, 200, 100, 200]);
  }, [settings.soundEnabled]);

  // 一键重置所有完成的计时器
  const resetAllFinished = useCallback(() => {
    setFinishedTimers(new Set());
    setActiveTimers(prev => {
      const updated = { ...prev };
      for (const [id, state] of Object.entries(prev)) {
        updated[id] = { isActive: false, timeLeft: getDefaultTime(id) };
      }
      return updated;
    });
  }, []);

  // 蘸料手册页面的收藏夹状态 - 使用统一的 useSauceFilter
  const { favorites: sauceFavorites, toggleFavorite: toggleSauceFavorite } = useSauceFilter();

  // 页面卸载时清理音频
  useEffect(() => {
    return () => cleanupAudio();
  }, []);

  // 切换声音设置
  const toggleSound = useCallback(() => {
    updateSetting('soundEnabled', !settings.soundEnabled);
  }, [settings.soundEnabled, updateSetting]);

  // 处理编辑时间
  const handleEditTime = useCallback((id, name, currentTime) => {
    setEditingTime({ id, name, currentTime });
  }, []);

  // 保存自定义时间
  const handleSaveTime = useCallback((id, newTime) => {
    saveCustomTime(id, newTime);
    setEditingTime(null);
    // 如果这个 timer 正在运行，更新剩余时间
    setActiveTimers(prev => {
      if (prev[id]?.isActive) {
        return { ...prev, [id]: { ...prev[id], timeLeft: newTime } };
      }
      return prev;
    });
  }, []);

  // 恢复默认时间
  const handleResetTime = useCallback((id) => {
    removeCustomTime(id);
    setEditingTime(null);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">🍲 火锅助手</h1>
          <p className="app-subtitle">
            {currentPage === 'timer' ? '精准掌握每种食材的最佳口感' : '调配属于你的完美蘸料'}
          </p>
        </div>
        <button
          className={`sound-toggle ${settings.soundEnabled ? 'on' : 'off'}`}
          onClick={toggleSound}
          title={settings.soundEnabled ? '点击静音' : '点击开启声音'}
        >
          {settings.soundEnabled ? '🔊' : '🔇'}
        </button>
      </header>

      <nav className="top-nav">
        <TopNav currentPage={currentPage} onPageChange={setCurrentPage} />
      </nav>

      <div className="page-content">
        {currentPage === 'timer' ? (
          <TimerPage
            activeTimers={activeTimers}
            onStartTimer={handleStartTimer}
            onResetTimer={handleResetTimer}
            onTimerFinish={handleTimerFinish}
            finishedTimers={finishedTimers}
            onSauceClick={handleSauceClick}
            resetAllFinished={resetAllFinished}
            onEditTime={handleEditTime}
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

      {/* 编辑时间弹窗 */}
      {editingTime && (
        <EditTimeModal
          {...editingTime}
          onSave={handleSaveTime}
          onReset={handleResetTime}
          onClose={() => setEditingTime(null)}
        />
      )}

      <footer className="app-footer">
        <p>Version {version}</p>
      </footer>
    </div>
  );
}

export default App;
