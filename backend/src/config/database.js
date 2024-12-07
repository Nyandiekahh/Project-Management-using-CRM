// src/config/database.js
const path = require('path');

module.exports = {
  tasksFilePath: path.join(__dirname, '../../data/tasks.json'),
  usersFilePath: path.join(__dirname, '../../data/users.json'),  // Add this line
  complaintsFilePath: path.join(__dirname, '../../data/complaints.json'),
  uploadsDir: path.join(__dirname, '../../uploads')
};