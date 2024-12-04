import React, { useState, useEffect } from 'react';
import { useTaskService } from '../../hooks/useTaskService';
import { KanbanColumn } from './KanbanColumn';

// KanbanBoard component following SRP - responsible for managing the overall board state
export const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const taskService = useTaskService();

  const STATUSES = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const loadedTasks = await taskService.getAllTasks();
    setTasks(loadedTasks);
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      await loadTasks(); // Reload tasks to get updated state
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="kanban-board">
      {STATUSES.map(status => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={tasks.filter(task => task.status === status)}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        />
      ))}
    </div>
  );
};
