// 火锅食材数据 - 按类别分类，时间为推荐涮煮时间（秒）
export const ingredients = {
  meats: {
    id: 'meats',
    name: '肉类',
    icon: '🥩',
    items: [
      { id: 'fatty-beef', name: '肥牛卷', time: 20, minTime: 15, maxTime: 30, type: '涮', tip: '变色即可食用，久煮会柴', recommendedSauce: 'sesame-garlic', popular: true },
      { id: 'beef-slices', name: '牛肉片', time: 30, minTime: 20, maxTime: 40, type: '涮', tip: '薄片快速涮熟', recommendedSauce: 'haidilao', popular: true },
      { id: 'beef-steak', name: '火锅牛排', time: 180, minTime: 150, maxTime: 240, type: '煮', tip: '煮熟后再剪开食用', recommendedSauce: 'spicy-sichuan', popular: true },
      { id: 'lamb-slices', name: '羊肉卷', time: 20, minTime: 15, maxTime: 25, type: '涮', tip: '变色即可', recommendedSauce: 'vinegar-garlic', popular: true },
      { id: 'pork-slices', name: '猪肉片', time: 60, minTime: 50, maxTime: 80, type: '煮', tip: '需完全熟透', recommendedSauce: 'sesame-garlic', popular: false },
      { id: 'bacon', name: '培根', time: 40, minTime: 30, maxTime: 50, type: '涮', tip: '油脂香味浓', recommendedSauce: 'vinegar-garlic', popular: false },
      { id: 'luncheon-meat', name: '午餐肉', time: 60, minTime: 50, maxTime: 80, type: '煮', tip: '加热即可', recommendedSauce: 'haidilao', popular: true },
      { id: 'chicken-slices', name: '鸡肉片', time: 120, minTime: 90, maxTime: 150, type: '煮', tip: '需熟透', recommendedSauce: 'cantonese-seafood', popular: false },
    ]
  },
  offal: {
    id: 'offal',
    name: '内脏',
    icon: '🫀',
    items: [
      { id: 'tripe', name: '毛肚', time: 15, minTime: 10, maxTime: 20, type: '涮', tip: '七上八下，15 秒最脆', recommendedSauce: 'spicy-sichuan', popular: true },
      { id: 'duck-intestines', name: '鸭肠', time: 15, minTime: 10, maxTime: 20, type: '涮', tip: '快速涮保持脆感', recommendedSauce: 'spicy-sichuan', popular: true },
      { id: 'yellow-throat', name: '黄喉', time: 120, minTime: 90, maxTime: 150, type: '煮', tip: '脆嫩弹牙', recommendedSauce: 'spicy-sichuan', popular: true },
      { id: 'duck-blood', name: '鸭血', time: 300, minTime: 240, maxTime: 360, type: '煮', tip: '吸汤后更好吃', recommendedSauce: 'dry-dish', popular: true },
      { id: 'pig-brain', name: '猪脑', time: 600, minTime: 480, maxTime: 720, type: '久煮', tip: '必须完全熟透', recommendedSauce: 'dry-dish', popular: false },
      { id: 'intestine', name: '肥肠', time: 480, minTime: 420, maxTime: 540, type: '久煮', tip: '久煮更入味', recommendedSauce: 'spicy-sichuan', popular: false },
    ]
  },
  seafood: {
    id: 'seafood',
    name: '海鲜',
    icon: '🦐',
    items: [
      { id: 'shrimp-paste', name: '虾滑', time: 120, minTime: 90, maxTime: 150, type: '煮', tip: '浮起即可', recommendedSauce: 'cantonese-seafood', popular: true },
      { id: 'fish-slices', name: '鱼片', time: 120, minTime: 90, maxTime: 150, type: '煮', tip: '变白即可', recommendedSauce: 'cantonese-seafood', popular: true },
      { id: 'fresh-shrimp', name: '鲜虾', time: 120, minTime: 90, maxTime: 150, type: '煮', tip: '变红即可', recommendedSauce: 'cantonese-seafood', popular: true },
      { id: 'squid', name: '鱿鱼', time: 120, minTime: 90, maxTime: 150, type: '煮', tip: '卷起即可', recommendedSauce: 'thai-style', popular: false },
      { id: 'clam', name: '花蛤', time: 180, minTime: 150, maxTime: 210, type: '煮', tip: '开口即可食用', recommendedSauce: 'cantonese-seafood', popular: false },
    ]
  },
  vegetables: {
    id: 'vegetables',
    name: '蔬菜',
    icon: '🥬',
    items: [
      { id: 'bean-sprouts', name: '黄豆芽', time: 90, minTime: 60, maxTime: 120, type: '煮', tip: '脆口最佳', recommendedSauce: 'haidilao', popular: true },
      { id: 'lettuce', name: '生菜', time: 30, minTime: 20, maxTime: 40, type: '涮', tip: '烫软即可', recommendedSauce: 'sesame-garlic', popular: true },
      { id: 'baby-cabbage', name: '娃娃菜', time: 120, minTime: 90, maxTime: 150, type: '煮', tip: '中间部分多煮', recommendedSauce: 'haidilao', popular: true },
      { id: 'enoki', name: '金针菇', time: 120, minTime: 90, maxTime: 150, type: '煮', tip: '软即可', recommendedSauce: 'sesame-garlic', popular: true },
      { id: 'shiitake', name: '香菇', time: 240, minTime: 210, maxTime: 270, type: '煮', tip: '吸汤更好吃', recommendedSauce: 'yunnan-mushroom', popular: false },
      { id: 'potato-slices', name: '土豆片', time: 180, minTime: 150, maxTime: 210, type: '煮', tip: '透明即可', recommendedSauce: 'dry-dish', popular: true },
    ]
  },
  tofu: {
    id: 'tofu',
    name: '豆制品',
    icon: '🧊',
    items: [
      { id: 'tofu-pudding', name: '豆花', time: 120, minTime: 90, maxTime: 150, type: '煮', tip: '吸汤很好吃', recommendedSauce: 'spicy-sichuan', popular: true },
      { id: 'tender-tofu', name: '嫩豆腐', time: 180, minTime: 150, maxTime: 210, type: '煮', tip: '易碎，小心夹', recommendedSauce: 'spicy-sichuan', popular: true },
      { id: 'tofu-skin', name: '腐竹', time: 180, minTime: 150, maxTime: 210, type: '煮', tip: '煮软即可', recommendedSauce: 'sesame-garlic', popular: true },
      { id: 'ring-roll', name: '响铃卷', time: 30, minTime: 20, maxTime: 40, type: '涮', tip: '快速涮保持酥感', recommendedSauce: 'haidilao', popular: true },
    ]
  },
  staple: {
    id: 'staple',
    name: '主食',
    icon: '🍜',
    items: [
      { id: 'noodle', name: '面条', time: 180, minTime: 150, maxTime: 210, type: '煮', tip: 'Q 弹即可', recommendedSauce: 'haidilao', popular: true },
      { id: 'wide-noodle', name: '宽粉', time: 300, minTime: 270, maxTime: 330, type: '煮', tip: '透明即可', recommendedSauce: 'spicy-sichuan', popular: true },
      { id: 'glass-noodle', name: '粉丝', time: 180, minTime: 150, maxTime: 210, type: '煮', tip: '软弹即可', recommendedSauce: 'sesame-garlic', popular: true },
      { id: 'rice-cake', name: '年糕', time: 180, minTime: 150, maxTime: 210, type: '煮', tip: '软糯即可', recommendedSauce: 'haidilao', popular: false },
    ]
  }
};

export const categories = Object.keys(ingredients);
