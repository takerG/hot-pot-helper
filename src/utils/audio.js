// 音频工具 - 统一管理 Web Audio API
// 防止内存泄漏，提供简单接口

let audioContext = null;
let isAudioEnabled = false;

// 初始化音频上下文（用户交互后才能播放）
function initAudio() {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    isAudioEnabled = true;
    return true;
  } catch (e) {
    console.warn('[audio] Failed to init audio context:', e);
    isAudioEnabled = false;
    return false;
  }
}

// 播放提示音（两声 beep）
export function playAlarm() {
  try {
    if (!audioContext) {
      const initOk = initAudio();
      if (!initOk) return;
    }

    // 如果音频上下文被挂起（浏览器策略），恢复它
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const playTone = (freq, startTime, duration) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';

      // 音量包络：避免爆音
      gainNode.gain.setValueAtTime(0.3, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    const now = audioContext.currentTime;
    playTone(880, now, 0.5);
    playTone(880, now + 0.6, 0.5);
  } catch (e) {
    console.warn('[audio] Failed to play alarm:', e);
  }
}

// 检查音频是否可用
export function checkAudioSupport() {
  return !!(window.AudioContext || window.webkitAudioContext);
}

// 清理音频上下文（页面卸载时调用）
export function cleanupAudio() {
  if (audioContext) {
    try {
      audioContext.close();
    } catch (e) {
      // 忽略关闭错误
    }
    audioContext = null;
  }
}
