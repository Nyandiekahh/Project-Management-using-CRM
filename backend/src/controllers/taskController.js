// src/controllers/taskController.js
const { readFile, writeFile } = require('../utils/fileHandler');
const { tasksFilePath } = require('../config/database');

const taskController = {
  getAllTasks: async (req, res) => {
    try {
      const tasks = await readFile(tasksFilePath);
      res.json(tasks);
    } catch (error) {
      console.error('Error reading tasks file:', error);
      res.status(500).json({ error: 'Error reading tasks file' });
    }
  },

  getTaskById: async (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    try {
      const tasks = await readFile(tasksFilePath);
      const task = tasks.find(task => task.id === taskId);
      if (task) {
        res.json(task);
      } else {
        res.status(404).json({ error: 'Task not found' });
      }
    } catch (error) {
      console.error('Error reading tasks file:', error);
      res.status(500).json({ error: 'Error reading tasks file' });
    }
  },

  createTask: async (req, res) => {
    try {
      const tasks = await readFile(tasksFilePath);
      const newTask = {
        ...req.body,
        documentUrl: req.file ? `/uploads/${req.file.filename}` : null,
        id: Math.floor(100000 + Math.random() * 900000),
        status: 'Assigned',
        assignedAt: new Date().toISOString(),
        content: '',
        progress: 0
      };
      tasks.push(newTask);
      await writeFile(tasksFilePath, tasks);
      res.status(201).json({ message: 'Task created successfully', newTask });
    } catch (error) {
      console.error('Error writing tasks file:', error);
      res.status(500).json({ error: 'Error writing tasks file' });
    }
  },

  updateTask: async (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    try {
      const tasks = await readFile(tasksFilePath);
      const taskIndex = tasks.findIndex(task => task.id === taskId);
      if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const updatedTask = {
        ...tasks[taskIndex],
        ...req.body,
        documentUrl: req.file ? `/uploads/${req.file.filename}` : tasks[taskIndex].documentUrl
      };

      tasks[taskIndex] = updatedTask;
      await writeFile(tasksFilePath, tasks);
      res.json({ message: 'Task updated successfully', updatedTask });
    } catch (error) {
      console.error('Error writing tasks file:', error);
      res.status(500).json({ error: 'Error writing tasks file' });
    }
  },

  saveContent: async (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const { content } = req.body;

    try {
      const tasks = await readFile(tasksFilePath);
      const taskIndex = tasks.findIndex(task => task.id === taskId);
      if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
      }

      tasks[taskIndex].content = content;
      await writeFile(tasksFilePath, tasks);
      res.json({ message: 'Content saved successfully', task: tasks[taskIndex] });
    } catch (error) {
      console.error('Error writing tasks file:', error);
      res.status(500).json({ error: 'Error writing tasks file' });
    }
  },

  saveProgress: async (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const { progress } = req.body;

    try {
      const tasks = await readFile(tasksFilePath);
      const taskIndex = tasks.findIndex(task => task.id === taskId);
      if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
      }

      tasks[taskIndex].progress = progress;
      await writeFile(tasksFilePath, tasks);
      res.json({ message: 'Progress saved successfully', task: tasks[taskIndex] });
    } catch (error) {
      console.error('Error writing tasks file:', error);
      res.status(500).json({ error: 'Error writing tasks file' });
    }
  },

  delegateTask: async (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const { newOfficer } = req.body;

    try {
      const tasks = await readFile(tasksFilePath);
      const taskIndex = tasks.findIndex(task => task.id === taskId);
      if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
      }

      tasks[taskIndex].assignedOfficer += `, ${newOfficer}`;
      await writeFile(tasksFilePath, tasks);
      res.json({ message: 'Task delegated successfully', task: tasks[taskIndex] });
    } catch (error) {
      console.error('Error writing tasks file:', error);
      res.status(500).json({ error: 'Error writing tasks file' });
    }
  },

  deleteTask: async (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    try {
      let tasks = await readFile(tasksFilePath);
      tasks = tasks.filter(task => task.id !== taskId);
      await writeFile(tasksFilePath, tasks);
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Error writing tasks file:', error);
      res.status(500).json({ error: 'Error writing tasks file' });
    }
  }
};

module.exports = taskController;