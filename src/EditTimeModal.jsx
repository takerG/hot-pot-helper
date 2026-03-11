import React, { useState, useCallback } from 'react';
import { formatTime } from './utils/ingredients.js';

function EditTimeModal({ id, name, currentTime, onSave, onReset, onClose }) {
  const [minutes, setMinutes] = useState(Math.floor(currentTime / 60));
  const [seconds, setSeconds] = useState(currentTime % 60);

  const handleSave = useCallback(() => {
    const totalSeconds = Math.max(5, Math.min(3600, minutes * 60 + seconds));
    onSave(id, totalSeconds);
  }, [id, minutes, seconds, onSave]);

  const handleResetToDefault = useCallback(() => {
    onReset(id);
  }, [id, onReset]);

  const handleMinuteChange = useCallback((e) => {
    const value = Math.max(0, Math.min(60, parseInt(e.target.value) || 0));
    setMinutes(value);
  }, []);

  const handleSecondChange = useCallback((e) => {
    const value = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
    setSeconds(value);
  }, []);

  const handleQuickSet = useCallback((mins) => {
    setMinutes(mins);
    setSeconds(0);
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="edit-time-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>⏱️ 编辑烹饪时间</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="edit-time-content">
          <div className="ingredient-name-display">{name}</div>

          <div className="time-input-section">
            <div className="time-inputs">
              <div className="time-input-wrapper">
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={minutes}
                  onChange={handleMinuteChange}
                  className="time-input"
                  id="edit-minutes"
                />
                <label htmlFor="edit-minutes" className="time-label">分钟</label>
              </div>

              <span className="time-separator">:</span>

              <div className="time-input-wrapper">
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={handleSecondChange}
                  className="time-input"
                  id="edit-seconds"
                />
                <label htmlFor="edit-seconds" className="time-label">秒</label>
              </div>
            </div>

            <div className="time-preview">
              总计：<span className="time-total">{formatTime(minutes * 60 + seconds)}</span>
            </div>
          </div>

          {/* 快捷设置 */}
          <div className="quick-set-section">
            <span className="quick-set-label">快捷设置：</span>
            <div className="quick-set-buttons">
              <button
                type="button"
                className="quick-set-btn"
                onClick={() => handleQuickSet(0.5 * 60 / 60)}
              >
                30 秒
              </button>
              <button
                type="button"
                className="quick-set-btn"
                onClick={() => handleQuickSet(1)}
              >
                1 分钟
              </button>
              <button
                type="button"
                className="quick-set-btn"
                onClick={() => handleQuickSet(2)}
              >
                2 分钟
              </button>
              <button
                type="button"
                className="quick-set-btn"
                onClick={() => handleQuickSet(3)}
              >
                3 分钟
              </button>
              <button
                type="button"
                className="quick-set-btn"
                onClick={() => handleQuickSet(5)}
              >
                5 分钟
              </button>
              <button
                type="button"
                className="quick-set-btn"
                onClick={() => handleQuickSet(10)}
              >
                10 分钟
              </button>
            </div>
          </div>
        </div>

        <div className="edit-time-actions">
          <button
            className="edit-time-btn-reset"
            onClick={handleResetToDefault}
          >
            🔄 恢复默认
          </button>
          <button
            className="edit-time-btn-cancel"
            onClick={onClose}
          >
            取消
          </button>
          <button
            className="edit-time-btn-save"
            onClick={handleSave}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditTimeModal;
