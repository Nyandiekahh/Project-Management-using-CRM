import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  margin: 20px auto;
`;

const FormTitle = styled.h2`
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #2980b9;
  }
`;

const TaskForm = ({ officers, onSubmit, initialTask }) => {
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [assignedOfficer, setAssignedOfficer] = useState('');
  const [status, setStatus] = useState('Pending');
  const [link, setLink] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (initialTask) {
      setTaskName(initialTask.name);
      setDescription(initialTask.description);
      setDeadline(initialTask.deadline);
      setAssignedOfficer(initialTask.assignedOfficer);
      setStatus(initialTask.status);
      setLink(initialTask.link);
      setFile(initialTask.file);
    }
  }, [initialTask]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTask = {
      id: initialTask ? initialTask.id : Date.now(),
      name: taskName,
      description,
      deadline,
      assignedOfficer,
      status,
      link,
      file,
    };

    const existingTasks = JSON.parse(localStorage.getItem('tasks')) || [];

    if (initialTask) {
      const updatedTasks = existingTasks.map(task =>
        task.id === initialTask.id ? newTask : task
      );
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } else {
      existingTasks.push(newTask);
      localStorage.setItem('tasks', JSON.stringify(existingTasks));
    }

    onSubmit(newTask);
    setTaskName('');
    setDescription('');
    setDeadline('');
    setAssignedOfficer('');
    setStatus('Pending');
    setLink('');
    setFile(null);
  };

  return (
    <FormContainer>
      <FormTitle>{initialTask ? 'Edit Task' : 'Create a New Task'}</FormTitle>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Task Name</Label>
          <Input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Deadline</Label>
          <Input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Assigned Officer</Label>
          <Select
            value={assignedOfficer}
            onChange={(e) => setAssignedOfficer(e.target.value)}
            required
          >
            <option value="">Select an Officer</option>
            {officers.map((officer) => (
              <option key={officer.id} value={officer.name}>
                {officer.name}
              </option>
            ))}
          </Select>
        </FormGroup>
        <FormGroup>
          <Label>Status</Label>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Not Done">Not Done</option>
          </Select>
        </FormGroup>
        <FormGroup>
          <Label>Optional Link</Label>
          <Input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label>Upload File</Label>
          <Input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.png"
            onChange={handleFileChange}
          />
        </FormGroup>
        <Button type="submit">{initialTask ? 'Save Changes' : 'Create Task'}</Button>
      </form>
    </FormContainer>
  );
};

export default TaskForm;
