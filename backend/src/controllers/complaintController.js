// src/controllers/complaintController.js
const { readFile, writeFile } = require('../utils/fileHandler');
const { complaintsFilePath } = require('../config/database');

const complaintController = {
  getAllComplaints: async (req, res) => {
    try {
      const complaints = await readFile(complaintsFilePath);
      res.json(complaints);
    } catch (error) {
      console.error('Error reading complaints file:', error);
      res.status(500).json({ error: 'Error reading complaints file' });
    }
  },

  createComplaint: async (req, res) => {
    try {
      const complaints = await readFile(complaintsFilePath);
      const newComplaint = {
        ...req.body,
        documentUrl: req.file ? `/uploads/${req.file.filename}` : null,
        id: Math.floor(100000 + Math.random() * 900000),
        status: 'Open',
        createdAt: new Date().toISOString(),
      };
      complaints.push(newComplaint);
      await writeFile(complaintsFilePath, complaints);
      res.status(201).json({ message: 'Complaint submitted successfully', newComplaint });
    } catch (error) {
      console.error('Error writing complaints file:', error);
      res.status(500).json({ error: 'Error writing complaints file' });
    }
  }
};

module.exports = complaintController;