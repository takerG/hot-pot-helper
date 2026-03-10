// 蘸料配方数据
export const sauces = {
  classic: {
    id: 'classic',
    name: '经典搭配',
    icon: '🏆',
    recipes: [
      {
        id: 'sesame-garlic',
        name: '芝麻蒜泥酱',
        description: '最经典的火锅蘸料，香浓可口',
        tags: ['通用', '香辣'],
        ingredients: [
          { name: '芝麻酱', amount: '2 勺' },
          { name: '蒜泥', amount: '1 勺' },
          { name: '生抽', amount: '1 勺' },
          { name: '香醋', amount: '半勺' },
          { name: '香油', amount: '半勺' },
          { name: '葱花', amount: '适量' },
          { name: '香菜', amount: '适量' },
        ],
        tips: '适合搭配牛羊肉、蔬菜',
      },
      {
        id: 'haidilao',
        name: '海底捞式',
        description: '复刻海底捞招牌蘸料',
        tags: ['香辣', '浓郁'],
        ingredients: [
          { name: '芝麻酱', amount: '2 勺' },
          { name: '花生酱', amount: '1 勺' },
          { name: '蒜泥', amount: '2 勺' },
          { name: '牛肉粒', amount: '1 勺' },
          { name: '芹菜粒', amount: '1 勺' },
          { name: '小米辣', amount: '适量' },
          { name: '生抽', amount: '1 勺' },
          { name: '香油', amount: '1 勺' },
        ],
        tips: '牛肉粒和芹菜粒是灵魂',
      },
      {
        id: 'spicy-sichuan',
        name: '川味红油酱',
        description: '地道川渝风味，麻辣鲜香',
        tags: ['麻辣', '川渝'],
        ingredients: [
          { name: '辣椒油', amount: '2 勺' },
          { name: '花椒油', amount: '半勺' },
          { name: '蒜泥', amount: '2 勺' },
          { name: '葱花', amount: '1 勺' },
          { name: '香菜', amount: '适量' },
          { name: '蚝油', amount: '1 勺' },
          { name: '白糖', amount: '少许' },
        ],
        tips: '适合麻辣锅底，搭配内脏类食材',
      },
    ]
  },
  regional: {
    id: 'regional',
    name: '地方特色',
    icon: '🗺️',
    recipes: [
      {
        id: 'northeast-sesame',
        name: '东北麻酱',
        description: '浓香型，东北火锅标配',
        tags: ['东北', '浓郁'],
        ingredients: [
          { name: '纯芝麻酱', amount: '3 勺' },
          { name: '韭菜花', amount: '1 勺' },
          { name: '腐乳汁', amount: '1 勺' },
          { name: '辣椒油', amount: '适量' },
          { name: '蒜泥', amount: '1 勺' },
        ],
        tips: '韭菜花和腐乳汁是东北蘸料的灵魂',
      },
      {
        id: 'cantonese-seafood',
        name: '粤式海鲜酱',
        description: '清淡鲜美，突出食材原味',
        tags: ['粤式', '清淡'],
        ingredients: [
          { name: '海鲜酱', amount: '2 勺' },
          { name: '蒜泥', amount: '半勺' },
          { name: '小米辣', amount: '适量' },
          { name: '生抽', amount: '1 勺' },
          { name: '葱花', amount: '适量' },
        ],
        tips: '适合海鲜火锅、粥底火锅',
      },
      {
        id: 'yunnan-mushroom',
        name: '云南菌菇酱',
        description: '野生菌菇的鲜美',
        tags: ['云南', '鲜美'],
        ingredients: [
          { name: '菌菇酱', amount: '2 勺' },
          { name: '蒜泥', amount: '1 勺' },
          { name: '香菜', amount: '适量' },
          { name: '生抽', amount: '半勺' },
          { name: '香油', amount: '半勺' },
        ],
        tips: '适合菌菇火锅',
      },
      {
        id: 'guizhou-sour',
        name: '贵州酸汤酱',
        description: '酸辣开胃，贵州特色',
        tags: ['贵州', '酸辣'],
        ingredients: [
          { name: '酸汤', amount: '2 勺' },
          { name: '木姜子油', amount: '几滴' },
          { name: '蒜泥', amount: '1 勺' },
          { name: '小米辣', amount: '适量' },
          { name: '葱花', amount: '适量' },
        ],
        tips: '木姜子油是灵魂，不要多放',
      },
    ]
  },
  special: {
    id: 'special',
    name: '特色配方',
    icon: '✨',
    recipes: [
      {
        id: 'tomato-base',
        name: '番茄浓汤酱',
        description: '酸甜开胃，适合番茄锅底',
        tags: ['酸甜', '番茄'],
        ingredients: [
          { name: '番茄酱', amount: '2 勺' },
          { name: '蒜泥', amount: '1 勺' },
          { name: '芝麻酱', amount: '半勺' },
          { name: '生抽', amount: '1 勺' },
          { name: '白糖', amount: '半勺' },
          { name: '香菜', amount: '适量' },
        ],
        tips: '适合番茄锅底，搭配牛肉、蔬菜',
      },
      {
        id: 'dry-dish',
        name: '干碟',
        description: '川渝特色，干香麻辣',
        tags: ['麻辣', '干碟'],
        ingredients: [
          { name: '辣椒面', amount: '2 勺' },
          { name: '花椒面', amount: '半勺' },
          { name: '花生碎', amount: '1 勺' },
          { name: '芝麻', amount: '1 勺' },
          { name: '盐', amount: '少许' },
          { name: '味精', amount: '少许' },
        ],
        tips: '适合腰片、黄喉、郡肝',
      },
      {
        id: 'vinegar-garlic',
        name: '醋蒜酱',
        description: '解腻神器，吃羊肉必备',
        tags: ['清淡', '解腻'],
        ingredients: [
          { name: '香醋', amount: '3 勺' },
          { name: '蒜泥', amount: '2 勺' },
          { name: '生抽', amount: '1 勺' },
          { name: '香油', amount: '半勺' },
          { name: '香菜', amount: '适量' },
        ],
        tips: '吃羊肉火锅必备，解腻去膻',
      },
      {
        id: 'thai-style',
        name: '泰式酸辣酱',
        description: '东南亚风味，酸辣清新',
        tags: ['泰式', '酸辣'],
        ingredients: [
          { name: '鱼露', amount: '1 勺' },
          { name: '青柠汁', amount: '1 勺' },
          { name: '小米辣', amount: '适量' },
          { name: '蒜泥', amount: '1 勺' },
          { name: '白糖', amount: '半勺' },
          { name: '香菜', amount: '适量' },
        ],
        tips: '适合冬阴功火锅、海鲜',
      },
    ]
  },
};

// 火锅底料搭配推荐
export const soupBases = {
  mild: {
    id: 'mild',
    name: '清淡锅底',
    icon: '🍵',
    description: '突出食材原味，适合养生',
    pairings: [
      { name: '清汤锅', sauces: ['cantonese-seafood', 'vinegar-garlic'] },
      { name: '菌菇锅', sauces: ['yunnan-mushroom', 'sesame-garlic'] },
      { name: '番茄锅', sauces: ['tomato-base', 'haidilao'] },
      { name: '粥底锅', sauces: ['cantonese-seafood', 'guizhou-sour'] },
    ]
  },
  spicy: {
    id: 'spicy',
    name: '麻辣锅底',
    icon: '🌶️',
    description: '川渝经典，麻辣鲜香',
    pairings: [
      { name: '重庆老火锅', sauces: ['spicy-sichuan', 'dry-dish', 'northeast-sesame'] },
      { name: '成都麻辣锅', sauces: ['spicy-sichuan', 'dry-dish'] },
      { name: '酸菜鱼锅', sauces: ['haidilao', 'sesame-garlic'] },
    ]
  },
  special: {
    id: 'special',
    name: '特色锅底',
    icon: '🍜',
    description: '地方特色风味',
    pairings: [
      { name: '酸汤锅', sauces: ['guizhou-sour', 'thai-style'] },
      { name: '冬阴功锅', sauces: ['thai-style', 'cantonese-seafood'] },
      { name: '椰子鸡锅', sauces: ['cantonese-seafood', 'vinegar-garlic'] },
      { name: '老北京涮肉', sauces: ['northeast-sesame', 'sesame-garlic'] },
    ]
  },
};

export const sauceCategories = Object.keys(sauces);
export const soupBaseCategories = Object.keys(soupBases);
