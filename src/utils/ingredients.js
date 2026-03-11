// 食材数据工具函数
// 提供统一的食材查找接口，避免重复代码

import { ingredients, categories } from '../data.js';
import { storage } from './storage.js';

// 存储键名
const CUSTOM_TIME_KEY = 'custom-ingredient-times';

// 根据 ID 查找食材
export function getIngredientById(id) {
  for (const cat of categories) {
    const item = ingredients[cat].items.find(i => i.id === id);
    if (item) return item;
  }
  return null;
}

// 根据 ID 获取默认烹饪时间
export function getDefaultTime(id) {
  const item = getIngredientById(id);
  return item ? item.time : 60;
}

// 获取食材时间（优先自定义，其次默认）
export function getIngredientTime(id) {
  const customTimes = storage.getJSON(CUSTOM_TIME_KEY, {});
  if (customTimes[id] !== undefined) {
    return customTimes[id];
  }
  return getDefaultTime(id);
}

// 保存自定义时间
export function saveCustomTime(id, seconds) {
  const customTimes = storage.getJSON(CUSTOM_TIME_KEY, {});
  customTimes[id] = Math.max(5, Math.min(3600, seconds)); // 限制 5 秒 -1 小时
  storage.setJSON(CUSTOM_TIME_KEY, customTimes);
}

// 删除自定义时间（恢复默认）
export function removeCustomTime(id) {
  const customTimes = storage.getJSON(CUSTOM_TIME_KEY, {});
  delete customTimes[id];
  storage.setJSON(CUSTOM_TIME_KEY, customTimes);
}

// 检查是否有自定义时间
export function hasCustomTime(id) {
  const customTimes = storage.getJSON(CUSTOM_TIME_KEY, {});
  return customTimes[id] !== undefined;
}

// 获取所有自定义时间
export function getAllCustomTimes() {
  return storage.getJSON(CUSTOM_TIME_KEY, {});
}

// 格式化时间为 MM:SS 格式
export function formatTime(seconds) {
  const mins = Math.floor(Math.max(0, seconds) / 60);
  const secs = Math.max(0, seconds) % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 获取所有食材（扁平数组）
export function getAllIngredients() {
  return categories.flatMap(catId => ingredients[catId].items);
}

// 获取所有分类（带详细信息）
export function getCategoryList() {
  return categories.map(catId => ({
    ...ingredients[catId],
    count: ingredients[catId].items.length,
  }));
}
