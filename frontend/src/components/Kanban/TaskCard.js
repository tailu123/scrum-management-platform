import React from 'react';

// TaskCard component following SRP - responsible for displaying a single task
export const TaskCard = ({ task, onDragStart }) => {
  return (
    <div
      className="task-card"
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
    >
      <h4 className="task-title">{task.title}</h4>
      <p className="task-description">{task.description}</p>
      <div className="task-metadata">
        <span className="task-priority">{task.priority}</span>
        <span className="task-assignee">{task.assignee}</span>
      </div>
    </div>
  );
};
