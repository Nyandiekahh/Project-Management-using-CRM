// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User management routes
router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.get('/roles', userController.getRoles);

module.exports = router;