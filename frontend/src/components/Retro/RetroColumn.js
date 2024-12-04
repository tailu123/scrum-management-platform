import React from 'react';
import { RetroItem } from './RetroItem';

export const RetroColumn = ({ 
  category, 
  items, 
  onVote, 
  onDelete,
  onAddClick 
}) => {
  const sortedItems = [...items].sort((a, b) => b.votes - a.votes);

  return (
    <div 
      className="retro-column"
      style={{ borderTopColor: category.color }}
    >
      <div className="column-header" style={{ color: category.color }}>
        <h2>{category.name}</h2>
        <span className="item-count">{items.length} items</span>
      </div>

      <div className="column-content">
        {sortedItems.map(item => (
          <RetroItem
            key={item.id}
            item={item}
            onVote={onVote}
            onDelete={onDelete}
          />
        ))}

        <button 
          className="add-item-button"
          onClick={onAddClick}
        >
          + Add Item
        </button>
      </div>
    </div>
  );
};
