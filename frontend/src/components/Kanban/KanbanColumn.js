import React from 'react';
import { TaskCard } from './TaskCard';

// KanbanColumn component following SRP - responsible for displaying a single status column
export const KanbanColumn = ({ status, tasks, onDragStart, onDrop, onDragOver }) => {
  const columnTitle = status.replace('_', ' ');

  return (
    <div
      className="kanban-column"
      onDrop={(e) => onDrop(e, status)}
      onDragOver={onDragOver}
    >
      <h3 className="column-title">{columnTitle}</h3>
      <div className="task-list">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </div>
  );
};
