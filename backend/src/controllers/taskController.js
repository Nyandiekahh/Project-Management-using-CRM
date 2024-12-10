const { readFile, writeFile } = require('../utils/fileHandler');
const { tasksFilePath, usersFilePath } = require('../config/database');

// Helper function to convert ID to username
const convertToUsername = (officerId, users) => {
  // If the input is already a comma-separated list
  if (officerId.includes(',')) {
    return officerId
      .split(',')
      .map(id => id.trim())
      .map(id => {
        const user = users.find(u => u.id === id);
        return user ? user.username : id;
      })
      .join(', ');
  }
  
  // Single ID conversion
  const user = users.find(u => u.id === officerId);
  return user ? user.username : officerId;
};

const taskController = {
  getAllTasks: async (req, res) => {
    try {
      const tasks = await readFile(tasksFilePath);
      const users = await readFile(usersFilePath);
      
      const tasksWithUserDetails = tasks.map(task => ({
        ...task,
        assignedOfficer: task.assignedOfficer ? 
          convertToUsername(task.assignedOfficer, users) : 
          task.assignedOfficer
      }));

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
      const users = await readFile(usersFilePath);
      const task = tasks.find(task => task.id === taskId);
      
      if (task) {
        const taskWithUserDetails = {
          ...task,
          assignedOfficer: task.assignedOfficer ? 
            convertToUsername(task.assignedOfficer, users) : 
            task.assignedOfficer
        };
        res.json(taskWithUserDetails);
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

      // Store the task with original IDs
      tasks.push(newTask);
      await writeFile(tasksFilePath, tasks);

      // Convert IDs to usernames for response
      const taskWithUserDetails = {
        ...newTask,
        assignedOfficer: newTask.assignedOfficer ? 
          convertToUsername(newTask.assignedOfficer, users) : 
          newTask.assignedOfficer
      };

      res.status(201).json({ 
        message: 'Task created successfully', 
        task: taskWithUserDetails 
      });
    } catch (error) {
      console.error('Error writing tasks file:', error);
      res.status(500).json({ error: 'Error writing tasks file' });
    }
  },

  updateTask: async (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    try {
      const tasks = await readFile(tasksFilePath);
      const users = await readFile(usersFilePath);
      const taskIndex = tasks.findIndex(task => task.id === taskId);
      
      if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const updatedTask = {
        ...tasks[taskIndex],
        ...req.body,
        documentUrl: req.file ? 
          `/uploads/${req.file.filename}` : 
          tasks[taskIndex].documentUrl
      };

      tasks[taskIndex] = updatedTask;
      await writeFile(tasksFilePath, tasks);

      // Convert IDs to usernames for response
      const taskWithUserDetails = {
        ...updatedTask,
        assignedOfficer: updatedTask.assignedOfficer ? 
          convertToUsername(updatedTask.assignedOfficer, users) : 
          updatedTask.assignedOfficer
      };

      res.json({ 
        message: 'Task updated successfully', 
        task: taskWithUserDetails 
      });
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

      // Store IDs in comma-separated format
      tasks[taskIndex].assignedOfficer = tasks[taskIndex].assignedOfficer ? 
        `${tasks[taskIndex].assignedOfficer},${newOfficer}` : 
        newOfficer;
      
      await writeFile(tasksFilePath, tasks);

      // Convert IDs to usernames for response
      const taskWithUserDetails = {
        ...tasks[taskIndex],
        assignedOfficer: convertToUsername(tasks[taskIndex].assignedOfficer, users)
      };

      res.json({ 
        message: 'Task delegated successfully', 
        task: taskWithUserDetails 
      });
    } catch (error) {
      console.error('Error writing tasks file:', error);
      res.status(500).json({ error: 'Error writing tasks file' });
    }
  },

  // Other methods remain unchanged
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