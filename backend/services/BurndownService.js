class BurndownService {
  constructor() {
    this.burndownData = new Map(); // sprintId -> burndown data
  }

  calculateIdealBurndown(totalPoints, sprintDuration) {
    const idealBurndown = [];
    const pointsPerDay = totalPoints / sprintDuration;

    for (let day = 0; day <= sprintDuration; day++) {
      idealBurndown.push({
        day,
        remainingPoints: Math.max(0, totalPoints - (day * pointsPerDay))
      });
    }

    return idealBurndown;
  }

  async getBurndownData(sprintId, sprintData, tasks) {
    try {
      const {
        startDate,
        endDate,
        totalStoryPoints
      } = sprintData;

      // Calculate sprint duration in days
      const start = new Date(startDate);
      const end = new Date(endDate);
      const sprintDuration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

      // Get ideal burndown
      const idealBurndown = this.calculateIdealBurndown(totalStoryPoints, sprintDuration);

      // Calculate actual burndown
      const actualBurndown = this.calculateActualBurndown(
        tasks,
        start,
        sprintDuration,
        totalStoryPoints
      );

      // Store the data
      const burndownData = {
        sprintId,
        startDate,
        endDate,
        totalStoryPoints,
        idealBurndown,
        actualBurndown,
        lastUpdated: new Date().toISOString()
      };

      this.burndownData.set(sprintId, burndownData);

      return burndownData;
    } catch (error) {
      console.error('Error calculating burndown data:', error);
      throw error;
    }
  }

  calculateActualBurndown(tasks, startDate, duration, totalPoints) {
    const actualBurndown = [];
    const start = new Date(startDate);
    
    // Create a map of completed points by date
    const completedByDate = new Map();
    tasks.forEach(task => {
      if (task.completedAt) {
        const completedDate = new Date(task.completedAt);
        const dayDiff = Math.floor((completedDate - start) / (1000 * 60 * 60 * 24));
        
        if (dayDiff >= 0 && dayDiff <= duration) {
          const currentPoints = completedByDate.get(dayDiff) || 0;
          completedByDate.set(dayDiff, currentPoints + (task.storyPoints || 0));
        }
      }
    });

    // Calculate remaining points for each day
    let remainingPoints = totalPoints;
    for (let day = 0; day <= duration; day++) {
      const completedToday = completedByDate.get(day) || 0;
      remainingPoints -= completedToday;

      actualBurndown.push({
        day,
        remainingPoints: Math.max(0, remainingPoints)
      });
    }

    return actualBurndown;
  }

  async updateBurndownData(sprintId, taskId, action) {
    const burndownData = this.burndownData.get(sprintId);
    if (!burndownData) return;

    // In a real application, you would:
    // 1. Get the updated task data
    // 2. Recalculate the actual burndown
    // 3. Update the stored burndown data
    // 4. Notify any real-time listeners

    return this.burndownData.get(sprintId);
  }
}

module.exports = BurndownService;
