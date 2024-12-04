import React, { useState, useEffect } from 'react';
import { useResourceService } from '../../hooks/useResourceService';
import { ResourceCard } from './ResourceCard';
import { ResourceFilter } from './ResourceFilter';

// Main component for the educational resources library
export const ResourceLibrary = () => {
  const [resources, setResources] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    tags: []
  });
  
  const resourceService = useResourceService();

  useEffect(() => {
    loadResources();
  }, [filters]);

  const loadResources = async () => {
    let fetchedResources;
    if (filters.tags.length > 0) {
      fetchedResources = await resourceService.searchResourcesByTags(filters.tags);
    } else if (filters.category) {
      fetchedResources = await resourceService.getResourcesByCategory(filters.category);
    } else {
      fetchedResources = await resourceService.getAllResources(filters);
    }
    setResources(fetchedResources);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="resource-library">
      <h2>Educational Resources</h2>
      <ResourceFilter 
        currentFilters={filters}
        onFilterChange={handleFilterChange}
      />
      <div className="resource-grid">
        {resources.map(resource => (
          <ResourceCard 
            key={resource.id}
            resource={resource}
          />
        ))}
      </div>
    </div>
  );
};
