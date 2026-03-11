// 安全的 localStorage 操作封装
// 防止 JSON 解析错误和 quota 超限等问题

export const storage = {
  // 安全读取并解析 JSON
  getJSON(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      return JSON.parse(item);
    } catch (e) {
      console.warn(`[storage] Failed to parse ${key}:`, e);
      return defaultValue;
    }
  },

  // 安全写入 JSON
  setJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn(`[storage] Failed to save ${key}:`, e);
      return false;
    }
  },

  // 安全读取字符串
  get(key, defaultValue = '') {
    try {
      return localStorage.getItem(key) || defaultValue;
    } catch (e) {
      console.warn(`[storage] Failed to get ${key}:`, e);
      return defaultValue;
    }
  },

  // 安全写入字符串
  set(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.warn(`[storage] Failed to save ${key}:`, e);
      return false;
    }
  },

  // 安全删除
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn(`[storage] Failed to remove ${key}:`, e);
      return false;
    }
  },

  // 安全清空
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      console.warn('[storage] Failed to clear:', e);
      return false;
    }
  },
};
