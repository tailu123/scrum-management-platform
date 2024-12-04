const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const writeFileAsync = promisify(fs.writeFile);

class ExportService {
  constructor() {
    this.exportPath = path.join(__dirname, '../exports');
    if (!fs.existsSync(this.exportPath)) {
      fs.mkdirSync(this.exportPath, { recursive: true });
    }
  }

  async exportToJSON(data, filename) {
    const jsonData = JSON.stringify(data, null, 2);
    const filePath = path.join(this.exportPath, `${filename}.json`);
    await writeFileAsync(filePath, jsonData);
    return filePath;
  }

  async exportToCSV(data, fields, filename) {
    const parser = new Parser({ fields });
    const csv = parser.parse(data);
    const filePath = path.join(this.exportPath, `${filename}.csv`);
    await writeFileAsync(filePath, csv);
    return filePath;
  }

  async exportToPDF(retroData, filename) {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const filePath = path.join(this.exportPath, `${filename}.pdf`);
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      // Title
      doc.fontSize(24)
         .text(retroData.title, { align: 'center' })
         .moveDown(2);

      // Date and Template Info
      doc.fontSize(12)
         .text(`Date: ${new Date(retroData.createdAt).toLocaleDateString()}`)
         .text(`Template: ${retroData.template.name}`)
         .moveDown(2);

      // Categories and Items
      retroData.categories.forEach(category => {
        // Category Header
        doc.fontSize(16)
           .fillColor(category.color)
           .text(category.name)
           .moveDown(0.5);

        // Category Items
        const items = retroData.items.filter(item => item.categoryId === category.id);
        items.forEach(item => {
          doc.fontSize(12)
             .fillColor('black')
             .text(`• ${item.content} (${item.votes} votes)`)
             .moveDown(0.5);
        });

        doc.moveDown(1);
      });

      // Action Items
      if (retroData.actionItems && retroData.actionItems.length > 0) {
        doc.fontSize(16)
           .text('Action Items')
           .moveDown(0.5);

        retroData.actionItems.forEach(item => {
          doc.fontSize(12)
             .text(`• ${item.content} (Assigned to: ${item.assignee})`)
             .moveDown(0.5);
        });
      }

      // Footer
      doc.fontSize(10)
         .text(`Generated on ${new Date().toLocaleString()}`, {
           align: 'center',
           bottom: 30
         });

      doc.end();

      stream.on('finish', () => resolve(filePath));
      stream.on('error', reject);
    });
  }

  async exportRetro(retroData, format = 'pdf') {
    const sanitizedTitle = retroData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '');
    const filename = `retro_${sanitizedTitle}_${timestamp}`;

    switch (format.toLowerCase()) {
      case 'json':
        return this.exportToJSON(retroData, filename);
      
      case 'csv': {
        const fields = ['category', 'content', 'votes', 'author'];
        const flatData = retroData.items.map(item => ({
          category: retroData.categories.find(c => c.id === item.categoryId)?.name || '',
          content: item.content,
          votes: item.votes,
          author: item.author
        }));
        return this.exportToCSV(flatData, fields, filename);
      }
      
      case 'pdf':
        return this.exportToPDF(retroData, filename);
      
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  deleteExportFile(filePath) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

module.exports = ExportService;
