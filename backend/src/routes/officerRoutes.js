// src/routes/officerRoutes.js
const express = require('express');
const router = express.Router();
const officerController = require('../controllers/officerController');

// Get senior officers - will be accessed at /officers/senior
router.get('/senior', officerController.getSeniorOfficers);

// Get all officers - will be accessed at /officers
router.get('/', officerController.getAllOfficers);

module.exports = router;