import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSprintService } from '../../hooks/useSprintService';
import { useTaskService } from '../../hooks/useTaskService';
import { BurndownChart } from './BurndownChart';
import { TaskList } from './TaskList';

export const SprintDetail = () => {
  const { sprintId } = useParams();
  const [sprint, setSprint] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' or 'burndown'

  const sprintService = useSprintService();
  const taskService = useTaskService();

  useEffect(() => {
    loadSprintData();
  }, [sprintId]);

  const loadSprintData = async () => {
    try {
      setLoading(true);
      const [sprintData, taskData] = await Promise.all([
        sprintService.getSprintById(sprintId),
        taskService.getTasksBySprint(sprintId)
      ]);
      setSprint(sprintData);
      setTasks(taskData);
      setError(null);
    } catch (err) {
      console.error('Error loading sprint data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      await taskService.updateTask(taskId, updates);
      await loadSprintData();
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  if (loading) {
    return <div className="loading">Loading sprint details...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!sprint) {
    return <div className="error">Sprint not found</div>;
  }

  return (
    <div className="sprint-detail">
      <header className="sprint-header">
        <h1>{sprint.name}</h1>
        <div className="sprint-meta">
          <span>Start: {new Date(sprint.startDate).toLocaleDateString()}</span>
          <span>End: {new Date(sprint.endDate).toLocaleDateString()}</span>
          <span>Story Points: {sprint.totalStoryPoints}</span>
        </div>
      </header>

      <div className="sprint-tabs">
        <button
          className={`tab-button ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          Tasks
        </button>
        <button
          className={`tab-button ${activeTab === 'burndown' ? 'active' : ''}`}
          onClick={() => setActiveTab('burndown')}
        >
          Burndown Chart
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'tasks' ? (
          <TaskList
            tasks={tasks}
            onTaskUpdate={handleTaskUpdate}
          />
        ) : (
          <BurndownChart sprintId={sprintId} />
        )}
      </div>
    </div>
  );
};
