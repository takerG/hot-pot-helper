// 火锅食材数据 - 按类别分类，时间为推荐涮煮时间（秒）
export const ingredients = {
  meats: {
    id: 'meats',
    name: '肉类',
    icon: '🥩',
    items: [
      { id: 'lamb-slices', name: '羊肉片', time: 15 },
      { id: 'beef-slices', name: '牛肉片', time: 15 },
      { id: 'pork-slices', name: '猪肉片', time: 20 },
      { id: 'lamb-chop', name: '羊排', time: 180 },
      { id: 'beef-ball', name: '牛肉丸', time: 300 },
      { id: 'meatball', name: '猪肉丸', time: 300 },
      { id: 'sausage', name: '香肠', time: 240 },
      { id: 'bacon', name: '培根', time: 30 },
    ]
  },
  offal: {
    id: 'offal',
    name: '内脏',
    icon: '🫀',
    items: [
      { id: 'tripe', name: '毛肚', time: 15 },
      { id: 'duck-tripe', name: '千层肚', time: 30 },
      { id: 'duck-intestines', name: '鸭肠', time: 30 },
      { id: 'beef-liver', name: '牛肝', time: 60 },
      { id: 'pig-liver', name: '猪肝', time: 60 },
      { id: 'pig-heart', name: '猪心', time: 180 },
      { id: 'duck-blood', name: '鸭血', time: 300 },
      { id: 'pig-blood', name: '猪血', time: 300 },
    ]
  },
  vegetables: {
    id: 'vegetables',
    name: '蔬菜',
    icon: '🥬',
    items: [
      { id: 'lettuce', name: '生菜', time: 10 },
      { id: 'spinach', name: '菠菜', time: 30 },
      { id: 'cabbage', name: '白菜', time: 60 },
      { id: 'potato', name: '土豆', time: 300 },
      { id: 'lotus-root', name: '莲藕', time: 180 },
      { id: 'mushroom', name: '香菇', time: 180 },
      { id: 'enoki', name: '金针菇', time: 120 },
      { id: 'wood-ear', name: '木耳', time: 180 },
      { id: 'kelp', name: '海带', time: 180 },
      { id: 'bamboo-shoot', name: '竹笋', time: 300 },
      { id: 'gong-cai', name: '贡菜', time: 60 },
      { id: 'watercress', name: '西洋菜', time: 30 },
    ]
  },
  seafood: {
    id: 'seafood',
    name: '海鲜',
    icon: '🦐',
    items: [
      { id: 'shrimp', name: '虾', time: 60 },
      { id: 'fish-slices', name: '鱼片', time: 30 },
      { id: 'squid', name: '鱿鱼', time: 60 },
      { id: 'clam', name: '花甲', time: 180 },
      { id: 'oyster', name: '生蚝', time: 300 },
      { id: 'crab', name: '螃蟹', time: 600 },
      { id: 'fish-ball', name: '鱼丸', time: 300 },
      { id: 'shrimp-ball', name: '虾丸', time: 300 },
    ]
  },
  tofu: {
    id: 'tofu',
    name: '豆制品',
    icon: '🧊',
    items: [
      { id: 'tofu', name: '豆腐', time: 300 },
      { id: 'tofu-skin', name: '豆皮', time: 60 },
      { id: 'fried-tofu', name: '油豆腐', time: 180 },
      { id: 'tofu-bubble', name: '豆泡', time: 180 },
      { id: 'gluten', name: '面筋', time: 180 },
    ]
  },
  staple: {
    id: 'staple',
    name: '主食',
    icon: '🍜',
    items: [
      { id: 'noodle', name: '面条', time: 180 },
      { id: 'glass-noodle', name: '粉丝', time: 60 },
      { id: 'rice-cake', name: '年糕', time: 300 },
      { id: 'mantou', name: '馒头', time: 60 },
      { id: 'corn', name: '玉米', time: 600 },
      { id: 'pumpkin', name: '南瓜', time: 480 },
    ]
  }
};

export const categories = Object.keys(ingredients);
