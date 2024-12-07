// src/routes/complaintRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const complaintController = require('../controllers/complaintController');

router.get('/', complaintController.getAllComplaints);
router.post('/', upload.single('document'), complaintController.createComplaint);

module.exports = router;