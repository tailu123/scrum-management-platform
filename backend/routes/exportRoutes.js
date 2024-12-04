const express = require('express');
const router = express.Router();
const ExportService = require('../services/ExportService');
const RetroService = require('../services/RetroService');

const exportService = new ExportService();
const retroService = new RetroService();

// Export retrospective
router.get('/retro/:retroId/:format', async (req, res) => {
  try {
    const { retroId, format } = req.params;
    
    // Get retro data
    const retroData = await retroService.getRetroWithDetails(retroId);
    if (!retroData) {
      return res.status(404).json({ message: 'Retrospective not found' });
    }

    // Generate export file
    const filePath = await exportService.exportRetro(retroData, format);

    // Send file
    res.download(filePath, (err) => {
      // Delete the temporary file after sending
      exportService.deleteExportFile(filePath);
      
      if (err) {
        console.error('Error sending file:', err);
      }
    });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
