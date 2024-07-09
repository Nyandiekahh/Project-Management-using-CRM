const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

const tasksFilePath = path.join(__dirname, 'tasks.json');

app.get('/tasks', (req, res) => {
  fs.readFile(tasksFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading tasks file' });
    }
    res.json(JSON.parse(data));
  });
});

app.post('/tasks', (req, res) => {
  fs.readFile(tasksFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading tasks file' });
    }
    const tasks = JSON.parse(data);
    const newTask = req.body;
    tasks.push(newTask);
    fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2), 'utf8', err => {
      if (err) {
        return res.status(500).json({ error: 'Error writing tasks file' });
      }
      res.status(201).json(newTask);
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
