// src/app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const { uploadsDir } = require('./config/database');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Ensure uploads directory exists
const fs = require('fs');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/tasks', require('./routes/taskRoutes'));
app.use('/complaints', require('./routes/complaintRoutes'));
app.use('/officers', require('./routes/officerRoutes'));
app.use('/users', require('./routes/userRoutes')); // Add this line
app.use('/user-management', require('./routes/userRoutes')); // This matches your frontend URL


// Error handling for file uploads
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File is too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ error: error.message });
  }
  
  if (error) {
    return res.status(500).json({ error: 'Something went wrong!' });
  }
  
  next();
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;