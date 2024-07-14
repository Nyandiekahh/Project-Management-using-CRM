import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Correct import for datepicker CSS
import { addBusinessDays, formatDate, isHoliday } from '../utils/dateUtils'; // Adjust the path as needed
import { isSaturday, isSunday } from 'date-fns'; // Import isSaturday and isSunday from date-fns

const FormContainer = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
  font-family: 'Arial', sans-serif;
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

const StyledDatePicker = styled(DatePicker)`
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

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #3498db;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-top: -10px;
  margin-bottom: 10px;
`;

const TaskForm = ({ officers, onSubmit, initialTask }) => {
  const [task, setTask] = useState({
    id: '',
    name: '',
    description: '',
    deadline: '',
    assignedOfficer: officers[0].name,
    document: null,
    timeframe: 0
  });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (initialTask) {
      const daysDiff = Math.ceil((new Date(initialTask.deadline) - new Date()) / (1000 * 60 * 60 * 24));
      setTask({
        ...initialTask,
        timeframe: daysDiff
      });
    }
  }, [initialTask]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: files ? files[0] : value,
    }));
  };

  const handleTimeframeChange = (e) => {
    const { value } = e.target;
    const timeframe = parseInt(value, 10);
    const deadline = addBusinessDays(new Date(), timeframe);
    setTask((prevTask) => ({
      ...prevTask,
      timeframe,
      deadline: formatDate(deadline),
    }));
  };

  const handleDateChange = (date) => {
    const holiday = isHoliday(date);
    if (isSaturday(date) || isSunday(date)) {
      setErrorMessage('You cannot set a deadline on a weekend.');
      return;
    } else if (holiday) {
      setErrorMessage(`You cannot set a deadline on ${holiday}.`);
      return;
    }

    const now = new Date();
    const timeframe = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    setTask((prevTask) => ({
      ...prevTask,
      timeframe,
      deadline: formatDate(date),
    }));
    setErrorMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (errorMessage) {
      return;
    }
    onSubmit(task);
  };

  return (
    <FormContainer>
      <Title>{task.id ? 'Editing Previously Assigned Task' : 'Create New Task'}</Title>
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
            min="1"
            required
          />
        </FormField>
        <FormField>
          <Label htmlFor="deadline">Deadline</Label>
          <StyledDatePicker
            selected={task.deadline ? new Date(task.deadline) : null}
            onChange={handleDateChange}
            minDate={new Date()}
            filterDate={(date) => {
              const day = date.getDay();
              return day !== 0 && day !== 6 && !isHoliday(date);
            }}
            required
          />
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
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
        <Button type="submit">{task.id ? 'Update Task' : 'Save Task'}</Button>
      </form>
    </FormContainer>
  );
};

export default TaskForm;
