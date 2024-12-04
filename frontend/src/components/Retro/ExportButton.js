import React, { useState } from 'react';
import '../../styles/retroTemplates.css';

export const ExportButton = ({ retroId }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const handleExport = async (format) => {
    try {
      const response = await fetch(
        `${API_URL}/export/retro/${retroId}/${format}`,
        { method: 'GET' }
      );

      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Get filename from response headers
      const contentDisposition = response.headers.get('content-disposition');
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/["']/g, '')
        : `retro_export.${format}`;

      // Download file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
      // You might want to add proper error handling/notification here
    }
    setShowDropdown(false);
  };

  return (
    <div className="export-button-container">
      <button 
        className="export-button"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        Export
      </button>
      
      {showDropdown && (
        <div className="export-dropdown">
          <button onClick={() => handleExport('pdf')}>
            Export as PDF
          </button>
          <button onClick={() => handleExport('csv')}>
            Export as CSV
          </button>
          <button onClick={() => handleExport('json')}>
            Export as JSON
          </button>
        </div>
      )}
    </div>
  );
};
