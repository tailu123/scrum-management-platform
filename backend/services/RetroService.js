class RetroService {
  constructor() {
    this.retros = [];
    this.retroItems = [];
  }

  async createRetro(retroData) {
    const retro = {
      id: Date.now().toString(),
      ...retroData,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      categories: [
        { id: '1', name: 'What Went Well', color: '#28a745' },
        { id: '2', name: 'What Could Be Improved', color: '#ffc107' },
        { id: '3', name: 'Action Items', color: '#007bff' }
      ]
    };
    this.retros.push(retro);
    return retro;
  }

  async getRetroById(id) {
    const retro = this.retros.find(r => r.id === id);
    if (!retro) {
      throw new Error('Retrospective not found');
    }
    return retro;
  }

  async getRetrosBySprintId(sprintId) {
    return this.retros.filter(retro => retro.sprintId === sprintId);
  }

  async updateRetroStatus(id, status) {
    const retroIndex = this.retros.findIndex(r => r.id === id);
    if (retroIndex === -1) {
      throw new Error('Retrospective not found');
    }

    this.retros[retroIndex] = {
      ...this.retros[retroIndex],
      status,
      updatedAt: new Date()
    };

    return this.retros[retroIndex];
  }

  // Retro Items Methods
  async addRetroItem(retroId, itemData) {
    const retro = await this.getRetroById(retroId);
    
    const item = {
      id: Date.now().toString(),
      retroId,
      ...itemData,
      votes: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.retroItems.push(item);
    return item;
  }

  async getRetroItems(retroId) {
    return this.retroItems.filter(item => item.retroId === retroId);
  }

  async updateRetroItem(itemId, updateData) {
    const itemIndex = this.retroItems.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error('Retro item not found');
    }

    this.retroItems[itemIndex] = {
      ...this.retroItems[itemIndex],
      ...updateData,
      updatedAt: new Date()
    };

    return this.retroItems[itemIndex];
  }

  async addVoteToItem(itemId) {
    const item = this.retroItems.find(item => item.id === itemId);
    if (!item) {
      throw new Error('Retro item not found');
    }

    item.votes += 1;
    item.updatedAt = new Date();
    return item;
  }

  async removeVoteFromItem(itemId) {
    const item = this.retroItems.find(item => item.id === itemId);
    if (!item) {
      throw new Error('Retro item not found');
    }

    if (item.votes > 0) {
      item.votes -= 1;
      item.updatedAt = new Date();
    }
    return item;
  }

  async deleteRetroItem(itemId) {
    const itemIndex = this.retroItems.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error('Retro item not found');
    }

    this.retroItems.splice(itemIndex, 1);
    return { success: true };
  }

  async getRetroWithDetails(retroId) {
    try {
      const retro = await this.getRetroById(retroId);
      if (!retro) return null;

      const items = await this.getRetroItems(retroId);
      const template = await this.templateService.getTemplateById(retro.template);
      const actionItems = await this.getActionItems(retroId);

      return {
        ...retro,
        items,
        template,
        actionItems
      };
    } catch (error) {
      console.error('Error getting retro details:', error);
      throw error;
    }
  }

}

module.exports = RetroService;
