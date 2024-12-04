class RetroTemplateService {
  constructor() {
    // Default templates
    this.templates = [
      {
        id: 'standard',
        name: 'Standard Retrospective',
        description: 'Classic format focusing on what went well and what needs improvement',
        categories: [
          { id: 'went-well', name: 'What Went Well', color: '#28a745' },
          { id: 'improve', name: 'What Could Be Improved', color: '#ffc107' },
          { id: 'actions', name: 'Action Items', color: '#007bff' }
        ]
      },
      {
        id: 'start-stop-continue',
        name: 'Start, Stop, Continue',
        description: 'Focus on actions to begin, cease, and maintain',
        categories: [
          { id: 'start', name: 'Start Doing', color: '#28a745' },
          { id: 'stop', name: 'Stop Doing', color: '#dc3545' },
          { id: 'continue', name: 'Continue Doing', color: '#007bff' }
        ]
      },
      {
        id: 'mad-sad-glad',
        name: 'Mad, Sad, Glad',
        description: 'Emotion-based retrospective format',
        categories: [
          { id: 'mad', name: 'Mad', color: '#dc3545' },
          { id: 'sad', name: 'Sad', color: '#6c757d' },
          { id: 'glad', name: 'Glad', color: '#28a745' }
        ]
      },
      {
        id: 'four-ls',
        name: '4 Ls Retrospective',
        description: 'Liked, Learned, Lacked, Longed For',
        categories: [
          { id: 'liked', name: 'Liked', color: '#28a745' },
          { id: 'learned', name: 'Learned', color: '#17a2b8' },
          { id: 'lacked', name: 'Lacked', color: '#ffc107' },
          { id: 'longed', name: 'Longed For', color: '#6f42c1' }
        ]
      },
      {
        id: 'sailboat',
        name: 'Sailboat Retrospective',
        description: 'Metaphorical format using a sailboat analogy',
        categories: [
          { id: 'wind', name: 'Wind (What Pushes Us Forward)', color: '#28a745' },
          { id: 'anchor', name: 'Anchor (What Holds Us Back)', color: '#dc3545' },
          { id: 'rocks', name: 'Rocks (Risks Ahead)', color: '#ffc107' },
          { id: 'island', name: 'Island (Our Goal)', color: '#007bff' }
        ]
      }
    ];
  }

  async getAllTemplates() {
    return this.templates;
  }

  async getTemplateById(id) {
    const template = this.templates.find(t => t.id === id);
    if (!template) {
      throw new Error('Template not found');
    }
    return template;
  }

  async createCustomTemplate(templateData) {
    const template = {
      id: Date.now().toString(),
      ...templateData,
      createdAt: new Date(),
      isCustom: true
    };
    this.templates.push(template);
    return template;
  }

  async updateCustomTemplate(id, updateData) {
    const templateIndex = this.templates.findIndex(t => t.id === id && t.isCustom);
    if (templateIndex === -1) {
      throw new Error('Custom template not found');
    }

    this.templates[templateIndex] = {
      ...this.templates[templateIndex],
      ...updateData,
      updatedAt: new Date()
    };

    return this.templates[templateIndex];
  }

  async deleteCustomTemplate(id) {
    const templateIndex = this.templates.findIndex(t => t.id === id && t.isCustom);
    if (templateIndex === -1) {
      throw new Error('Custom template not found');
    }

    this.templates.splice(templateIndex, 1);
    return { success: true };
  }
}

module.exports = RetroTemplateService;
