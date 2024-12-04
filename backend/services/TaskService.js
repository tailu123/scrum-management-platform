class TaskService {
  constructor() {
    this.tasks = [];
  }

  async getAllTasks(filters = {}) {
    // In a real application, this would query a database with filters
    return this.tasks.filter(task => {
      for (const [key, value] of Object.entries(filters)) {
        if (task[key] !== value) return false;
      }
      return true;
    });
  }

  async createTask(taskData) {
    const task = {
      id: Date.now().toString(),
      ...taskData,
      status: taskData.status || 'TODO',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.tasks.push(task);
    return task;
  }

  async updateTask(id, updateData) {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }

    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...updateData,
      updatedAt: new Date()
    };

    return this.tasks[taskIndex];
  }

  async updateTaskStatus(id, newStatus) {
    return this.updateTask(id, { status: newStatus });
  }

  async deleteTask(id) {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    this.tasks.splice(taskIndex, 1);
    return { success: true };
  }
}

module.exports = TaskService;
