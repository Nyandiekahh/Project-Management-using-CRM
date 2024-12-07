// src/routes/officerRoutes.js
const express = require('express');
const router = express.Router();
const officerController = require('../controllers/officerController');

router.get('/', officerController.getSeniorOfficers);

module.exports = router;