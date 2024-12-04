import React from 'react';

// Component for filtering educational resources
export const ResourceFilter = ({ currentFilters, onFilterChange }) => {
  const categories = [
    'fundamentals',
    'roles',
    'events',
    'artifacts',
    'best-practices'
  ];

  const difficulties = [
    'beginner',
    'intermediate',
    'advanced'
  ];

  const commonTags = [
    'scrum',
    'agile',
    'sprint',
    'planning',
    'retrospective',
    'daily-scrum',
    'product-backlog'
  ];

  const handleCategoryChange = (e) => {
    onFilterChange({ category: e.target.value });
  };

  const handleDifficultyChange = (e) => {
    onFilterChange({ difficulty: e.target.value });
  };

  const handleTagClick = (tag) => {
    const newTags = currentFilters.tags.includes(tag)
      ? currentFilters.tags.filter(t => t !== tag)
      : [...currentFilters.tags, tag];
    onFilterChange({ tags: newTags });
  };

  return (
    <div className="resource-filter">
      <div className="filter-section">
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          value={currentFilters.category}
          onChange={handleCategoryChange}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <label htmlFor="difficulty">Difficulty:</label>
        <select
          id="difficulty"
          value={currentFilters.difficulty}
          onChange={handleDifficultyChange}
        >
          <option value="">All Levels</option>
          {difficulties.map(difficulty => (
            <option key={difficulty} value={difficulty}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <label>Common Tags:</label>
        <div className="tag-cloud">
          {commonTags.map(tag => (
            <button
              key={tag}
              className={`tag-button ${currentFilters.tags.includes(tag) ? 'active' : ''}`}
              onClick={() => handleTagClick(tag)}
            >
              {tag.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
