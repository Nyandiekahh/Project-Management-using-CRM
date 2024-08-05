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
const complaintsFilePath = path.join(__dirname, 'complaints.json');
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

// Read file with error handling
async function readFile(filePath) {
  try {
    const data = await readFileAsync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Write file atomically
async function writeFile(filePath, data) {
  await writeFileAtomic(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Task routes
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await readFile(tasksFilePath);
    res.json(tasks);
  } catch (error) {
    console.error('Error reading tasks file:', error);
    res.status(500).json({ error: 'Error reading tasks file' });
  }
});

app.get('/tasks/:id', async (req, res) => {
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
});

app.post('/tasks', upload.single('document'), async (req, res) => {
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
});

app.put('/tasks/:id', upload.single('document'), async (req, res) => {
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
});

app.put('/tasks/:id/save-content', async (req, res) => {
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
});

app.put('/tasks/:id/save-progress', async (req, res) => {
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
});

app.put('/tasks/:id/delegate', async (req, res) => {
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
});

app.delete('/tasks/:id', async (req, res) => {
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
});

// Endpoint to get senior officers
app.get('/senior-officers', async (req, res) => {
  const seniorOfficers = [
    { id: 1, name: 'Senior Officer 1' },
    { id: 2, name: 'Senior Officer 2' },
  ];
  res.json(seniorOfficers);
});

// Complaint routes
app.get('/complaints', async (req, res) => {
  try {
    const complaints = await readFile(complaintsFilePath);
    res.json(complaints);
  } catch (error) {
    console.error('Error reading complaints file:', error);
    res.status(500).json({ error: 'Error reading complaints file' });
  }
});

app.post('/complaints', upload.single('document'), async (req, res) => {
  try {
    const complaints = await readFile(complaintsFilePath);
    const newComplaint = {
      ...req.body,
      documentUrl: req.file ? `/uploads/${req.file.filename}` : null,
      id: Math.floor(100000 + Math.random() * 900000),
      status: 'Open',
      createdAt: new Date().toISOString(),
    };
    complaints.push(newComplaint);
    await writeFile(complaintsFilePath, complaints);
    res.status(201).json({ message: 'Complaint submitted successfully', newComplaint });
  } catch (error) {
    console.error('Error writing complaints file:', error);
    res.status(500).json({ error: 'Error writing complaints file' });
  }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
