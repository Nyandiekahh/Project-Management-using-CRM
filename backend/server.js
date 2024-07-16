const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

const tasksFilePath = path.join(__dirname, 'tasks.json');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.get('/tasks', (req, res) => {
  fs.readFile(tasksFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading tasks file' });
    }
    res.json(JSON.parse(data));
  });
});

app.get('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  fs.readFile(tasksFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading tasks file' });
    }
    const tasks = JSON.parse(data);
    const task = tasks.find(task => task.id === taskId);
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  });
});

app.post('/tasks', upload.single('document'), (req, res) => {
  fs.readFile(tasksFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading tasks file' });
    }
    const tasks = JSON.parse(data);
    const newTask = {
      ...req.body,
      documentUrl: req.file ? `/uploads/${req.file.filename}` : null,
      id: Math.floor(100000 + Math.random() * 900000), // Generate a unique ID
      status: 'Assigned', // Ensure status is set to "Assigned"
      assignedAt: new Date().toISOString() // Add the current date and time
    };
    tasks.push(newTask);
    fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2), 'utf8', err => {
      if (err) {
        return res.status(500).json({ error: 'Error writing tasks file' });
      }
      res.status(201).json(newTask);
    });
  });
});

app.put('/tasks/:id', upload.single('document'), (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  fs.readFile(tasksFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading tasks file' });
    }
    let tasks = JSON.parse(data);
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

    fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2), 'utf8', err => {
      if (err) {
        return res.status(500).json({ error: 'Error writing tasks file' });
      }
      res.json(updatedTask);
    });
  });
});

app.put('/tasks/:id/delegate', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const { newOfficer } = req.body;

  fs.readFile(tasksFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading tasks file' });
    }
    let tasks = JSON.parse(data);
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Add the new officer to the assignedOfficer list
    tasks[taskIndex].assignedOfficer = tasks[taskIndex].assignedOfficer + `, ${newOfficer}`;

    fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2), 'utf8', err => {
      if (err) {
        return res.status(500).json({ error: 'Error writing tasks file' });
      }
      res.json(tasks[taskIndex]);
    });
  });
});

app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  fs.readFile(tasksFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading tasks file' });
    }
    let tasks = JSON.parse(data);
    tasks = tasks.filter(task => task.id !== taskId);
    fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2), 'utf8', err => {
      if (err) {
        return res.status(500).json({ error: 'Error writing tasks file' });
      }
      res.status(200).json({ message: 'Task deleted' });
    });
  });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
