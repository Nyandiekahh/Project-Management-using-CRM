import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
`;

const FormField = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  font-size: 16px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 8px rgba(52, 152, 219, 0.1);
    outline: none;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 8px rgba(52, 152, 219, 0.1);
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  background-color: white;
  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 8px rgba(52, 152, 219, 0.1);
    outline: none;
  }
`;

const Button = styled.button`
  padding: 14px 28px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #2980b9;
  }
`;

const TaskForm = ({ officers, onSubmit, initialTask }) => {
  const [task, setTask] = useState({
    name: '',
    description: '',
    deadline: '',
    assignedOfficer: officers[0].name,
    status: 'Not Done',
    document: null,
    timeframe: 0
  });

  useEffect(() => {
    if (initialTask) {
      setTask(initialTask);
    }
  }, [initialTask]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: files ? files[0] : value,
    }));
  };

  const calculateDeadline = (timeframe) => {
    let date = new Date();
    let daysAdded = 0;
    while (daysAdded < timeframe) {
      date.setDate(date.getDate() + 1);
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        daysAdded++;
      }
    }
    return date.toISOString().split('T')[0];
  };

  const handleTimeframeChange = (e) => {
    const { value } = e.target;
    const deadline = calculateDeadline(Number(value));
    setTask((prevTask) => ({
      ...prevTask,
      timeframe: value,
      deadline
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(task);
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <FormField>
          <Label htmlFor="name">Task Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={task.name}
            onChange={handleChange}
            required
          />
        </FormField>
        <FormField>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={task.description}
            onChange={handleChange}
            required
          />
        </FormField>
        <FormField>
          <Label htmlFor="timeframe">Timeframe (Weekdays)</Label>
          <Input
            id="timeframe"
            name="timeframe"
            type="number"
            value={task.timeframe}
            onChange={handleTimeframeChange}
            required
          />
        </FormField>
        <FormField>
          <Label htmlFor="deadline">Deadline</Label>
          <Input
            id="deadline"
            name="deadline"
            type="date"
            value={task.deadline}
            readOnly
          />
        </FormField>
        <FormField>
          <Label htmlFor="assignedOfficer">Assigned Officer</Label>
          <Select
            id="assignedOfficer"
            name="assignedOfficer"
            value={task.assignedOfficer}
            onChange={handleChange}
            required
          >
            {officers.map((officer) => (
              <option key={officer.id} value={officer.name}>
                {officer.name}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField>
          <Label htmlFor="document">Upload Document</Label>
          <Input
            id="document"
            name="document"
            type="file"
            onChange={handleChange}
          />
        </FormField>
        <Button type="submit">Save Task</Button>
      </form>
    </FormContainer>
  );
};

export default TaskForm;
