// src/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const taskController = require('../controllers/taskController');

router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', upload.single('document'), taskController.createTask);
router.put('/:id', upload.single('document'), taskController.updateTask);
router.put('/:id/save-content', taskController.saveContent);
router.put('/:id/save-progress', taskController.saveProgress);
router.put('/:id/delegate', taskController.delegateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;