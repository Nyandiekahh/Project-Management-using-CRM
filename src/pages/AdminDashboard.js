import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar';
import TaskForm from '../components/TaskForm';
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

const Button = styled.button`
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;

  &:hover {
    background-color: #2980b9;
  }
`;

const EditButton = styled.button`
  padding: 5px 10px;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;

  &:hover {
    background-color: #27ae60;
  }
`;

const DeleteButton = styled.button`
  padding: 5px 10px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #c0392b;
  }
`;

const AdminDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
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

  const handleCreateTask = (task) => {
    const formData = new FormData();
    formData.append('name', task.name);
    formData.append('description', task.description);
    formData.append('deadline', task.deadline);
    formData.append('assignedOfficer', task.assignedOfficer);
    if (task.document) {
      formData.append('document', task.document);
    }

    if (task.id) {
      // If task ID exists, update the existing task
      fetch(`http://localhost:5000/tasks/${task.id}`, {
        method: 'PUT',
        body: formData
      })
        .then(response => response.json())
        .then(updatedTask => {
          setTasks(prevTasks => prevTasks.map(t => t.id === updatedTask.id ? updatedTask : t));
        })
        .catch(error => console.error('Error updating task:', error));
    } else {
      // If no task ID, create a new task
      fetch('http://localhost:5000/tasks', {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          setTasks(prevTasks => [...prevTasks, data]);
        })
        .catch(error => console.error('Error creating task:', error));
    }

    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleDeleteTask = (taskId) => {
    fetch(`http://localhost:5000/tasks/${taskId}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(() => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      })
      .catch(error => console.error('Error deleting task:', error));
  };

  const toggleTaskForm = () => {
    setShowTaskForm(!showTaskForm);
    setEditingTask(null);
  };

  const handleTaskClick = (task) => {
    navigate(`/tasks/${task.id}`);
  };

  return (
    <DashboardContainer>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Content isSidebarOpen={isSidebarOpen}>
        <Clock />  {/* Add the Clock component here */}
        <WelcomeMessage>
          Welcome back, {user ? user.username : 'Admin'}
          <p>We're delighted to have you. Need help on system walk through? Navigate to virtual assistant on the side menu.</p>
        </WelcomeMessage>
        <Button onClick={toggleTaskForm}>
          {showTaskForm ? 'Hide Task Form' : 'Create New Task'}
        </Button>
        {showTaskForm && (
          <TaskForm
            officers={[
              { id: 1, name: 'Principal Officer 1' },
              { id: 2, name: 'Principal Officer 2' },
              { id: 3, name: 'Principal Officer 3' },
              { id: 4, name: 'Principal Officer 4' },
              { id: 5, name: 'Principal Officer 5' },
              { id: 6, name: 'Senior Officer 1' },
              { id: 7, name: 'Senior Officer 2' },
              { id: 8, name: 'Senior Officer 3' },
              { id: 9, name: 'Senior Officer 4' },
              { id: 10, name: 'Senior Officer 5' },
            ]}
            onSubmit={handleCreateTask}
            initialTask={editingTask}
          />
        )}
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
                        <EditButton onClick={(e) => { e.stopPropagation(); handleEditTask(task); }}>Edit</EditButton>
                        <DeleteButton onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }}>Delete</DeleteButton>
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
      </Content>
    </DashboardContainer>
  );
};

export default AdminDashboard;
