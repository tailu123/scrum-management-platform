// SprintService.js - Follows SRP by handling only sprint-related business logic
class SprintService {
  constructor() {
    // In a real application, inject dependencies here
    this.sprints = [];
  }

  async getAllSprints() {
    // In a real application, this would fetch from a database
    return this.sprints;
  }

  async createSprint(sprintData) {
    const sprint = {
      id: Date.now().toString(),
      ...sprintData,
      createdAt: new Date(),
      status: 'active'
    };
    this.sprints.push(sprint);
    return sprint;
  }

  async updateSprint(id, updateData) {
    const sprintIndex = this.sprints.findIndex(sprint => sprint.id === id);
    if (sprintIndex === -1) {
      throw new Error('Sprint not found');
    }
    
    // Following OCP: We can extend sprint properties without modifying existing code
    this.sprints[sprintIndex] = {
      ...this.sprints[sprintIndex],
      ...updateData,
      updatedAt: new Date()
    };
    
    return this.sprints[sprintIndex];
  }
}

module.exports = SprintService;
