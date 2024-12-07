// src/controllers/taskController.js
const { readFile, writeFile } = require('../utils/fileHandler');
const { tasksFilePath, usersFilePath } = require('../config/database');

const taskController = {
  getAllTasks: async (req, res) => {
    try {
      const tasks = await readFile(tasksFilePath);
      const users = await readFile(usersFilePath);
      
      // Map user details to tasks
      const tasksWithUserDetails = tasks.map(task => {
        if (!task.assignedOfficer) return task;
        
        // If assignedOfficer is a user ID
        if (task.assignedOfficer.includes('17335')) {
          const user = users.find(u => u.id === task.assignedOfficer);
          return {
            ...task,
            assignedOfficer: user ? user.username : task.assignedOfficer
          };
        }
        
        // If it's already a name/title, keep it as is
        return task;
      });

      res.json(tasksWithUserDetails);
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
      const users = await readFile(usersFilePath);
      
      const newTask = {
        ...req.body,
        documentUrl: req.file ? `/uploads/${req.file.filename}` : null,
        id: Math.floor(100000 + Math.random() * 900000),
        status: 'Assigned',
        assignedAt: new Date().toISOString(),
        content: '',
        progress: 0
      };

      // Store the task
      tasks.push(newTask);
      await writeFile(tasksFilePath, tasks);

      // For the response, convert ID to username if it's an ID
      if (newTask.assignedOfficer.includes('17335')) {
        const user = users.find(u => u.id === newTask.assignedOfficer);
        if (user) {
          newTask.assignedOfficer = user.username;
        }
      }

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
      const users = await readFile(usersFilePath);
      
      const taskIndex = tasks.findIndex(task => task.id === taskId);
      if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
      }

      tasks[taskIndex].assignedOfficer += `,${newOfficer}`;
      await writeFile(tasksFilePath, tasks);

      // Convert IDs to usernames in response
      let assignedOfficers = tasks[taskIndex].assignedOfficer.split(',').map(officer => {
        officer = officer.trim();
        if (officer.includes('17335')) {
          const user = users.find(u => u.id === officer);
          return user ? user.username : officer;
        }
        return officer;
      });

      const taskWithUserDetails = {
        ...tasks[taskIndex],
        assignedOfficer: assignedOfficers.join(', ')
      };

      res.json({ message: 'Task delegated successfully', task: taskWithUserDetails });
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