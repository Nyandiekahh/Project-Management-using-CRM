import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Select from 'react-select';
import Modal from 'react-modal';  // Ensure to install react-modal if you haven't

import { useAuth } from '../context/AuthProvider';

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

const SelectContainer = styled.div`
  margin-top: 10px;
`;

Modal.setAppElement('#root'); // Make sure to set the app element for accessibility

const TaskList = () => {
  const { user } = useAuth(); // Get user from AuthContext
  const [tasks, setTasks] = useState([]);
  const [seniorOfficers, setSeniorOfficers] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:5000/tasks');
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    const fetchSeniorOfficers = async () => {
      try {
        const response = await fetch('http://localhost:5000/senior-officers');
        const data = await response.json();
        setSeniorOfficers(data.map(officer => ({ value: officer.name, label: officer.name })));
      } catch (error) {
        console.error('Error fetching senior officers:', error);
      }
    };

    fetchTasks();
    fetchSeniorOfficers();
  }, []);

  const deleteTask = async (id) => {
    try {
      await fetch(`http://localhost:5000/tasks/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const delegateTask = async () => {
    if (!selectedOfficer) return;

    try {
      const response = await fetch(`http://localhost:5000/tasks/${currentTaskId}/delegate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newOfficer: selectedOfficer.value })
      });

      const updatedTask = await response.json();
      setTasks(tasks.map(task => (task.id === currentTaskId ? updatedTask : task)));
      closeModal();
    } catch (error) {
      console.error('Error delegating task:', error);
    }
  };

  const openModal = (taskId) => {
    setCurrentTaskId(taskId);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedOfficer(null);
    setCurrentTaskId(null);
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
            {user && user.role === 'Principal Officer' && task.assignedOfficer.includes(user.username) && (
              <>
                <Button onClick={() => openModal(task.id)}>Delegate</Button>
              </>
            )}
            {user && user.role === 'Deputy Director' && (
              <Button onClick={() => deleteTask(task.id)} delete>Delete</Button>
            )}
          </TaskActions>
        </TaskItem>
      ))}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Delegate Task"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)'
          }
        }}
      >
        <h2>Delegate Task</h2>
        <SelectContainer>
          <label htmlFor="newOfficer">New Officer:</label>
          <Select
            id="newOfficer"
            options={seniorOfficers}
            onChange={setSelectedOfficer}
            placeholder="Select Senior Officer"
          />
        </SelectContainer>
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={closeModal} style={{ marginRight: '10px', backgroundColor: '#e74c3c' }}>Cancel</Button>
          <Button onClick={delegateTask} style={{ backgroundColor: '#3498db' }}>Delegate</Button>
        </div>
      </Modal>
    </TaskListContainer>
  );
};

export default TaskList;
