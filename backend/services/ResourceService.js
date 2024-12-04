class ResourceService {
  constructor() {
    // In a real application, this would be stored in a database
    this.resources = [
      {
        id: '1',
        title: 'Scrum Guide',
        type: 'guide',
        category: 'fundamentals',
        content: {
          sections: [
            {
              title: 'What is Scrum?',
              content: 'Scrum is an agile framework for developing, delivering, and sustaining complex products.'
            },
            {
              title: 'Scrum Values',
              content: 'Commitment, Focus, Openness, Respect, and Courage'
            }
          ]
        },
        difficulty: 'beginner',
        tags: ['scrum', 'agile', 'fundamentals']
      }
    ];
  }

  async getAllResources(filters = {}) {
    return this.resources.filter(resource => {
      for (const [key, value] of Object.entries(filters)) {
        if (Array.isArray(resource[key])) {
          if (!resource[key].includes(value)) return false;
        } else if (resource[key] !== value) return false;
      }
      return true;
    });
  }

  async getResourceById(id) {
    const resource = this.resources.find(r => r.id === id);
    if (!resource) {
      throw new Error('Resource not found');
    }
    return resource;
  }

  async createResource(resourceData) {
    const resource = {
      id: Date.now().toString(),
      ...resourceData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.resources.push(resource);
    return resource;
  }

  async updateResource(id, updateData) {
    const resourceIndex = this.resources.findIndex(r => r.id === id);
    if (resourceIndex === -1) {
      throw new Error('Resource not found');
    }

    this.resources[resourceIndex] = {
      ...this.resources[resourceIndex],
      ...updateData,
      updatedAt: new Date()
    };

    return this.resources[resourceIndex];
  }

  async deleteResource(id) {
    const resourceIndex = this.resources.findIndex(r => r.id === id);
    if (resourceIndex === -1) {
      throw new Error('Resource not found');
    }

    this.resources.splice(resourceIndex, 1);
    return { success: true };
  }

  // Method to get resources by category
  async getResourcesByCategory(category) {
    return this.resources.filter(r => r.category === category);
  }

  // Method to get resources by difficulty level
  async getResourcesByDifficulty(difficulty) {
    return this.resources.filter(r => r.difficulty === difficulty);
  }

  // Method to search resources by tags
  async searchResourcesByTags(tags) {
    return this.resources.filter(r => 
      tags.some(tag => r.tags.includes(tag))
    );
  }
}

module.exports = ResourceService;
