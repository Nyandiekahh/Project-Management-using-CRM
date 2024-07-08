import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import TaskForm from '../components/TaskForm';
import UserForm from '../components/UserForm';
import tasksData from '../tasks.json'; // Import the JSON file
import usersData from '../users.json'; // Import the JSON file

const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #f1f1f1;
  margin-left: 250px;
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

  img {
    margin-top: 10px;
    max-width: 150px;
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

const generateTaskId = (existingIds) => {
  let newId;
  do {
    newId = Math.floor(100000 + Math.random() * 900000);
  } while (existingIds.includes(newId));
  return newId;
};

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  const officers = [
    { id: 1, name: 'Officer 1' },
    { id: 2, name: 'Officer 2' },
  ];

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || tasksData;
    setTasks(storedTasks);
    const storedUsers = JSON.parse(localStorage.getItem('users')) || usersData;
    setUsers(storedUsers);
  }, []);

  const saveTasksToLocalStorage = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  const saveUsersToLocalStorage = (users) => {
    localStorage.setItem('users', JSON.stringify(users));
  };

  const handleCreateTask = (newTask) => {
    const taskId = generateTaskId(tasks.map(task => task.id));
    const updatedTasks = [...tasks, { ...newTask, id: taskId }];
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleUpdateTask = (updatedTask) => {
    const updatedTasks = tasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const handleCreateUser = (newUser) => {
    const userId = generateTaskId(users.map(user => user.id));
    const updatedUsers = [...users, { ...newUser, id: userId }];
    setUsers(updatedUsers);
    saveUsersToLocalStorage(updatedUsers);
    setShowUserForm(false);
    setEditingUser(null);
  };

  const handleUpdateUser = (updatedUser) => {
    const updatedUsers = users.map(user =>
      user.id === updatedUser.id ? updatedUser : user
    );
    setUsers(updatedUsers);
    saveUsersToLocalStorage(updatedUsers);
    setShowUserForm(false);
    setEditingUser(null);
  };

  const toggleTaskForm = () => {
    setShowTaskForm(!showTaskForm);
    setEditingTask(null);
  };

  const toggleUserForm = () => {
    setShowUserForm(!showUserForm);
    setEditingUser(null);
  };

  return (
    <DashboardContainer>
      <Sidebar onCreateTaskClick={toggleTaskForm} onCreateUserClick={toggleUserForm} />
      <div style={{ flex: 1 }}>
        <TopBar user="Admin" />
        <Content>
          <WelcomeMessage>
            Welcome back, Admin
            <p>We're delighted to have you. Need help on system walk through? Navigate to virtual assistant on the side menu.</p>
          </WelcomeMessage>
          <Button onClick={toggleTaskForm}>
            {showTaskForm ? 'Hide Task Form' : 'Create New Task'}
          </Button>
          <Button onClick={toggleUserForm}>
            {showUserForm ? 'Hide User Form' : 'Create New User'}
          </Button>
          {showTaskForm && (
            <TaskForm
              officers={officers}
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              initialTask={editingTask}
            />
          )}
          {showUserForm && (
            <UserForm
              onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
              initialUser={editingUser || {}}
            />
          )}
          <CurrentTasks>
            <h2>Current Assigned Tasks</h2>
            <TaskList>
              {tasks.length > 0 ? (
                <TaskTable>
                  <thead>
                    <tr>
                      <TaskTableHeader>TASK ID</TaskTableHeader>
                      <TaskTableHeader>TASK NAME</TaskTableHeader>
                      <TaskTableHeader>TASK STATUS</TaskTableHeader>
                      <TaskTableHeader>DEADLINE</TaskTableHeader>
                      <TaskTableHeader>ACTIONS</TaskTableHeader>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map(task => (
                      <TaskRow key={task.id}>
                        <TaskCell>{task.id}</TaskCell>
                        <TaskCell>{task.name}</TaskCell>
                        <StatusCell status={task.status}>{task.status}</StatusCell>
                        <TaskCell>{task.deadline}</TaskCell>
                        <TaskCell>
                          <EditButton onClick={() => handleEditTask(task)}>Edit</EditButton>
                          <DeleteButton onClick={() => handleDeleteTask(task.id)}>Delete</DeleteButton>
                        </TaskCell>
                      </TaskRow>
                    ))}
                  </tbody>
                </TaskTable>
              ) : (
                <NoTasksMessage>
                  Hooray! No pending task.
                  <img src="/path-to-your-image.png" alt="No tasks" />
                </NoTasksMessage>
              )}
            </TaskList>
          </CurrentTasks>
        </Content>
      </div>
    </DashboardContainer>
  );
};

export default AdminDashboard;
