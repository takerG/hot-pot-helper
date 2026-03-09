import { useState, useCallback } from 'react';
import { sauces, sauceCategories, soupBases, soupBaseCategories } from './sauces.js';

// 搜索和筛选蘸料
function useSauceFilter() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('sauce-favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleFavorite = useCallback((id) => {
    setFavorites(prev => {
      const next = prev.includes(id)
        ? prev.filter(f => f !== id)
        : [...prev, id];
      localStorage.setItem('sauce-favorites', JSON.stringify(next));
      return next;
    });
  }, []);

  return { searchTerm, setSearchTerm, selectedTag, setSelectedTag, favorites, toggleFavorite };
}

// 标签组件
function Tag({ tag, active, onClick }) {
  return (
    <button
      className={`sauce-tag ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      {tag}
    </button>
  );
}

// 收藏按钮
function FavoriteButton({ isFavorite, onToggle }) {
  return (
    <button
      className={`favorite-btn ${isFavorite ? 'active' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
    >
      {isFavorite ? '★' : '☆'}
    </button>
  );
}

// 单个蘸料卡片
function SauceCard({ recipe, isFavorite, onToggleFavorite, onClick }) {
  return (
    <div className="sauce-card" onClick={onClick}>
      <div className="sauce-card-header">
        <h3 className="sauce-card-title">{recipe.name}</h3>
        <FavoriteButton isFavorite={isFavorite} onToggle={onToggleFavorite} />
      </div>
      <p className="sauce-card-desc">{recipe.description}</p>
      <div className="sauce-card-tags">
        {recipe.tags.map(tag => (
          <span key={tag} className="sauce-tag">{tag}</span>
        ))}
      </div>
      <p className="sauce-card-preview">
        {recipe.ingredients.slice(0, 3).map(i => i.name).join(' · ')}...
      </p>
    </div>
  );
}

// 蘸料详情弹窗
function SauceModal({ recipe, onClose, isFavorite, onToggleFavorite }) {
  if (!recipe) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="sauce-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{recipe.name}</h2>
          <div className="modal-actions">
            <FavoriteButton isFavorite={isFavorite} onToggle={onToggleFavorite} />
            <button className="modal-close" onClick={onClose}>×</button>
          </div>
        </div>

        <p className="modal-description">{recipe.description}</p>

        <div className="modal-tags">
          {recipe.tags.map(tag => (
            <span key={tag} className="sauce-tag">{tag}</span>
          ))}
        </div>

        <div className="modal-section">
          <h3>📋 所需配料</h3>
          <ul className="ingredient-list-modal">
            {recipe.ingredients.map((item, idx) => (
              <li key={idx} className="modal-ingredient">
                <span className="ingredient-name">{item.name}</span>
                <span className="ingredient-amount">{item.amount}</span>
              </li>
            ))}
          </ul>
        </div>

        {recipe.tips && (
          <div className="modal-section modal-tips">
            <h3>💡 小贴士</h3>
            <p>{recipe.tips}</p>
          </div>
        )}

        <button className="modal-done" onClick={onClose}>知道了</button>
      </div>
    </div>
  );
}

// 锅底搭配推荐
function SoupBasePairing() {
  const [selectedBase, setSelectedBase] = useState(null);

  const allPairings = Object.values(soupBases).flatMap(base => base.pairings);

  return (
    <div className="soup-pairings">
      <h3 className="section-title">🍲 锅底蘸料搭配</h3>

      <div className="pairings-grid">
        {Object.entries(soupBases).map(([key, base]) => (
          <div key={key} className="pairing-category">
            <div className="pairing-category-header">
              <span className="pairing-icon">{base.icon}</span>
              <span className="pairing-name">{base.name}</span>
            </div>
            <p className="pairing-desc">{base.description}</p>

            <div className="pairings-list">
              {base.pairings.map(pairing => (
                <div key={pairing.name} className="pairing-item">
                  <div className="pairing-soup">{pairing.name}</div>
                  <div className="pairing-sauces">
                    {pairing.sauces.map(sauceId => {
                      // 查找蘸料名称
                      let sauceName = '';
                      for (const cat of Object.values(sauces)) {
                        const found = cat.recipes.find(r => r.id === sauceId);
                        if (found) {
                          sauceName = found.name;
                          break;
                        }
                      }
                      return (
                        <span key={sauceId} className="pairing-sauce-tag">
                          {sauceName}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 蘸料手册主页面
function SauceGuide() {
  const [activeCategory, setActiveCategory] = useState('classic');
  const [selectedSauce, setSelectedSauce] = useState(null);
  const { searchTerm, setSearchTerm, favorites, toggleFavorite } = useSauceFilter();
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const category = sauces[activeCategory];

  // 筛选蘸料
  let filteredRecipes = category.recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.includes(searchTerm);
    const matchesFavorite = !showOnlyFavorites || favorites.includes(recipe.id);
    return matchesSearch && matchesFavorite;
  });

  // 收集所有标签
  const allTags = ['all', ...new Set(category.recipes.flatMap(r => r.tags))];

  return (
    <div className="sauce-guide">
      <div className="sauce-header">
        <h2 className="page-title">🥣 蘸料手册</h2>
        <p className="page-subtitle">调配属于你的完美蘸料</p>
      </div>

      {/* 搜索栏 */}
      <div className="sauce-search-bar">
        <input
          type="text"
          placeholder="搜索蘸料配方..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="sauce-search-input"
        />
        <button
          className={`favorite-filter ${showOnlyFavorites ? 'active' : ''}`}
          onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
          title="只看收藏"
        >
          ★
        </button>
      </div>

      {/* 分类标签 */}
      <div className="category-tabs sauce-category-tabs">
        {sauceCategories.map(catId => {
          const cat = sauces[catId];
          return (
            <button
              key={catId}
              className={`category-tab ${activeCategory === catId ? 'active' : ''}`}
              onClick={() => setActiveCategory(catId)}
            >
              <span className="tab-icon">{cat.icon}</span>
              <span className="tab-name">{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* 标签筛选 */}
      <div className="tag-filter">
        {allTags.map(tag => (
          <Tag
            key={tag}
            tag={tag === 'all' ? '全部' : tag}
            active={false}
            onClick={() => {}}
          />
        ))}
      </div>

      {/* 蘸料列表 */}
      <div className="sauce-list">
        {filteredRecipes.length === 0 ? (
          <div className="empty-state">
            <p>暂无蘸料配方</p>
          </div>
        ) : (
          filteredRecipes.map(recipe => (
            <SauceCard
              key={recipe.id}
              recipe={recipe}
              isFavorite={favorites.includes(recipe.id)}
              onToggleFavorite={() => toggleFavorite(recipe.id)}
              onClick={() => setSelectedSauce(recipe)}
            />
          ))
        )}
      </div>

      {/* 锅底搭配 */}
      <SoupBasePairing />

      {/* 详情弹窗 */}
      {selectedSauce && (
        <SauceModal
          recipe={selectedSauce}
          onClose={() => setSelectedSauce(null)}
          isFavorite={favorites.includes(selectedSauce.id)}
          onToggleFavorite={() => toggleFavorite(selectedSauce.id)}
        />
      )}
    </div>
  );
}

export default SauceGuide;
