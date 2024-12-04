import React, { useState, useEffect } from 'react';
import { SprintCard } from './SprintCard';
import { useSprintService } from '../../hooks/useSprintService';

// SprintList component following SRP - only responsible for displaying sprints
export const SprintList = () => {
  const [sprints, setSprints] = useState([]);
  const sprintService = useSprintService();

  useEffect(() => {
    const loadSprints = async () => {
      const data = await sprintService.getAllSprints();
      setSprints(data);
    };
    loadSprints();
  }, [sprintService]);

  return (
    <div className="sprint-list">
      {sprints.map(sprint => (
        <SprintCard key={sprint.id} sprint={sprint} />
      ))}
    </div>
  );
};
