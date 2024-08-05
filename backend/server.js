const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const { promisify } = require('util');
const writeFileAtomic = require('write-file-atomic');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

const tasksFilePath = path.join(__dirname, 'tasks.json');
const readFileAsync = promisify(fs.readFile);

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

// Read tasks file with error handling
async function readTasksFile() {
  try {
    const data = await readFileAsync(tasksFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return an empty array
      return [];
    }
    throw error;
  }
}

// Write tasks file atomically
async function writeTasksFile(tasks) {
  await writeFileAtomic(tasksFilePath, JSON.stringify(tasks, null, 2), 'utf8');
}

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await readTasksFile();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error reading tasks file' });
  }
});

app.get('/tasks/:id', async (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  try {
    const tasks = await readTasksFile();
    const task = tasks.find(task => task.id === taskId);
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error reading tasks file' });
  }
});

app.post('/tasks', upload.single('document'), async (req, res) => {
  try {
    const tasks = await readTasksFile();
    const newTask = {
      ...req.body,
      documentUrl: req.file ? `/uploads/${req.file.filename}` : null,
      id: Math.floor(100000 + Math.random() * 900000), // Generate a unique ID
      status: 'Assigned', // Ensure status is set to "Assigned"
      assignedAt: new Date().toISOString(), // Add the current date and time
      content: '', // Initialize the content field
      progress: 0 // Initialize progress to 0
    };
    tasks.push(newTask);
    await writeTasksFile(tasks);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Error writing tasks file' });
  }
});

app.put('/tasks/:id', upload.single('document'), async (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  try {
    const tasks = await readTasksFile();
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
    await writeTasksFile(tasks);
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Error writing tasks file' });
  }
});

app.put('/tasks/:id/save-content', async (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const { content } = req.body;

  try {
    const tasks = await readTasksFile();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    tasks[taskIndex].content = content; // Save the editor content
    await writeTasksFile(tasks);
    res.json(tasks[taskIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Error writing tasks file' });
  }
});

app.put('/tasks/:id/save-progress', async (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const { progress } = req.body;

  try {
    const tasks = await readTasksFile();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    tasks[taskIndex].progress = progress; // Save the progress
    await writeTasksFile(tasks);
    res.json(tasks[taskIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Error writing tasks file' });
  }
});

app.put('/tasks/:id/delegate', async (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const { newOfficer } = req.body;

  try {
    const tasks = await readTasksFile();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Add the new officer to the assignedOfficer list
    tasks[taskIndex].assignedOfficer += `, ${newOfficer}`;
    await writeTasksFile(tasks);
    res.json(tasks[taskIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Error writing tasks file' });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  try {
    let tasks = await readTasksFile();
    tasks = tasks.filter(task => task.id !== taskId);
    await writeTasksFile(tasks);
    res.status(200).json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error writing tasks file' });
  }
});

// Endpoint to get senior officers
app.get('/senior-officers', async (req, res) => {
  // Replace this with your actual logic to get senior officers
  const seniorOfficers = [
    { id: 1, name: 'Senior Officer 1' },
    { id: 2, name: 'Senior Officer 2' },
  ];
  res.json(seniorOfficers);
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
