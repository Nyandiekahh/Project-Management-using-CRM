// src/routes/officerRoutes.js
const express = require('express');
const router = express.Router();
const { readFile } = require('../utils/fileHandler');
const { usersFilePath } = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const users = await readFile(usersFilePath);
    const seniorOfficers = users.filter(user => 
      user.role === 'seniorOfficer' || 
      user.role === 'principalOfficer'
    ).map(user => ({
      id: user.id,
      name: user.username,
      role: user.role
    }));
    res.json(seniorOfficers);
  } catch (error) {
    console.error('Error fetching senior officers:', error);
    res.status(500).json({ error: 'Failed to fetch senior officers' });
  }
});

module.exports = router;