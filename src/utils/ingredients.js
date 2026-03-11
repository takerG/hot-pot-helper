// 食材数据工具函数
// 提供统一的食材查找接口，避免重复代码

import { ingredients, categories } from '../data.js';

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
