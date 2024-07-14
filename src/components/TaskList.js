import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const TaskListContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 20px auto;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TaskItem = styled.div`
  border-bottom: 1px solid #ddd;
  padding: 10px 0;

  &:last-child {
    border-bottom: none;
  }
`;

const TaskDetail = styled.div`
  margin-bottom: 5px;
`;

const TaskActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 5px 10px;
  margin-left: 5px;
  background-color: ${props => props.delete ? '#e74c3c' : '#3498db'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.delete ? '#c0392b' : '#2980b9'};
  }
`;

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = () => {
      const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
      setTasks(savedTasks);
    };
    fetchTasks();
  }, []);

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  return (
    <TaskListContainer>
      <h1>Task List</h1>
      {tasks.map((task, index) => (
        <TaskItem key={task.id}>
          <TaskDetail><strong>S/No:</strong> {index + 1}</TaskDetail>
          <TaskDetail><strong>Task Name:</strong> {task.name}</TaskDetail>
          <TaskDetail><strong>Description:</strong> {task.description}</TaskDetail>
          <TaskDetail><strong>Deadline:</strong> {task.deadline}</TaskDetail>
          <TaskDetail><strong>Assigned Officer:</strong> {task.assignedOfficer}</TaskDetail>
          <TaskDetail><strong>Status:</strong> {task.status}</TaskDetail>
          <TaskDetail><strong>Optional Link:</strong> <a href={task.link} target="_blank" rel="noopener noreferrer">{task.link}</a></TaskDetail>
          <TaskDetail><strong>Assigned By:</strong> {task.assigningOfficer}</TaskDetail>
          <TaskActions>
            <Button onClick={() => deleteTask(task.id)} delete>Delete</Button>
          </TaskActions>
        </TaskItem>
      ))}
    </TaskListContainer>
  );
};

export default TaskList;
