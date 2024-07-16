import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar';
import Clock from '../components/Clock';

const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #f1f1f1;
  margin-left: ${props => (props.isSidebarOpen ? '250px' : '60px')};
  transition: margin-left 0.3s;
`;

const WelcomeMessage = styled.div`
  font-size: 24px;
  margin-bottom: 20px;
`;

const CurrentTasks = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TaskList = styled.div`
  margin-top: 20px;
`;

const TaskTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
`;

const TaskTableHeader = styled.th`
  background-color: #34495e;
  color: white;
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
`;

const TaskRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
  cursor: pointer; /* Make the row clickable */
`;

const TaskCell = styled.td`
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
`;

const StatusCell = styled(TaskCell)`
  background-color: ${(props) => {
    switch (props.status) {
      case 'Not Done':
        return '#e74c3c'; // Red for Not Done
      case 'Pending':
        return '#f39c12'; // Orange for Pending
      case 'Completed':
        return '#2ecc71'; // Green for Completed
      case 'Assigned':
        return '#3498db'; // Blue for Assigned
      default:
        return 'transparent';
    }
  }};
  color: white;
`;

const NoTasksMessage = styled.div`
  text-align: center;
  margin-top: 20px;
  font-size: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    margin-top: 20px;
    width: 80%;
    max-width: 400px;
  }
`;

const DelegateButton = styled.button`
  padding: 5px 10px;
  background-color: #f39c12;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;

  &:hover {
    background-color: #e67e22;
  }

  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
`;

const ModalHeader = styled.div`
  font-size: 18px;
  margin-bottom: 20px;
`;

const ModalBody = styled.div`
  margin-bottom: 20px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  background-color: ${(props) => (props.cancel ? '#e74c3c' : '#3498db')};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;

  &:hover {
    background-color: ${(props) => (props.cancel ? '#c0392b' : '#2980b9')};
  }
`;

const PrincipalOfficerDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToDelegate, setTaskToDelegate] = useState(null);
  const [newOfficer, setNewOfficer] = useState('');
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    fetch('http://localhost:5000/tasks')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched tasks:', data); // Debugging line
        setTasks(data);
      })
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  const handleTaskClick = (task) => {
    navigate(`/tasks/${task.id}`);
  };

  const handleOpenModal = (task) => {
    setTaskToDelegate(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTaskToDelegate(null);
    setNewOfficer('');
  };

  const handleDelegateTask = () => {
    fetch(`http://localhost:5000/tasks/${taskToDelegate.id}/delegate`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newOfficer }),
    })
      .then(response => response.json())
      .then(updatedTask => {
        setTasks(prevTasks => prevTasks.map(t => t.id === updatedTask.id ? updatedTask : t));
        handleCloseModal();
      })
      .catch(error => console.error('Error delegating task:', error));
  };

  const formatUsername = (username) => {
    return username
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([0-9])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };

  const isUserAssigned = (assignedOfficer) => {
    const assignedOfficers = assignedOfficer.split(', ');
    return assignedOfficers.includes(formatUsername(user.username));
  };

  return (
    <DashboardContainer>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Content isSidebarOpen={isSidebarOpen}>
        <Clock />  {/* Add the Clock component here */}
        <WelcomeMessage>
          Welcome back, {user ? formatUsername(user.username) : 'Principal Officer'}
        </WelcomeMessage>
        <CurrentTasks>
          <h2>Tasks List</h2>
          <TaskList>
            {tasks.length > 0 ? (
              <TaskTable>
                <thead>
                  <tr>
                    <TaskTableHeader>S/No</TaskTableHeader>
                    <TaskTableHeader>TASK ID</TaskTableHeader>
                    <TaskTableHeader>TASK NAME</TaskTableHeader>
                    <TaskTableHeader>TASK STATUS</TaskTableHeader>
                    <TaskTableHeader>DEADLINE</TaskTableHeader>
                    <TaskTableHeader>ASSIGNED TO</TaskTableHeader>
                    <TaskTableHeader>ACTIONS</TaskTableHeader>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task, index) => (
                    <TaskRow key={task.id} onClick={() => handleTaskClick(task)}>
                      <TaskCell>{index + 1}</TaskCell> {/* S/No */}
                      <TaskCell>{task.id}</TaskCell> {/* TASK ID */}
                      <TaskCell>{task.name}</TaskCell>
                      <StatusCell status={task.status}>{task.status}</StatusCell>
                      <TaskCell>{task.deadline}</TaskCell>
                      <TaskCell>{task.collaborators && task.collaborators.length > 0 ? task.collaborators.join(', ') : task.assignedOfficer}</TaskCell>
                      <TaskCell>
                        <DelegateButton
                          onClick={(e) => { e.stopPropagation(); handleOpenModal(task); }}
                          disabled={!isUserAssigned(task.assignedOfficer)}
                        >
                          Delegate
                        </DelegateButton>
                      </TaskCell>
                    </TaskRow>
                  ))}
                </tbody>
              </TaskTable>
            ) : (
              <NoTasksMessage>
                Hooray! No pending task.
                <img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbTFiNzVicXh1dHp2aWd3YnE4amZjcnIzdWl2NnBmY3h4engyOTN6ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26ufnwz3wDUli7GU0/giphy.webp" alt="No tasks" />
              </NoTasksMessage>
            )}
          </TaskList>
        </CurrentTasks>
        {isModalOpen && (
          <ModalOverlay>
            <ModalContent>
              <ModalHeader>Delegate Task</ModalHeader>
              <ModalBody>
                <label htmlFor="newOfficer">New Officer:</label>
                <input
                  type="text"
                  id="newOfficer"
                  value={newOfficer}
                  onChange={(e) => setNewOfficer(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <ModalButton cancel onClick={handleCloseModal}>Cancel</ModalButton>
                <ModalButton onClick={handleDelegateTask}>Delegate</ModalButton>
              </ModalFooter>
            </ModalContent>
          </ModalOverlay>
        )}
      </Content>
    </DashboardContainer>
  );
};

export default PrincipalOfficerDashboard;
