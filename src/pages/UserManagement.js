import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar';
import UserForm from '../components/UserForm';
import usersData from '../users.json'; // Import the JSON file

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

const CurrentUsers = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const UserList = styled.div`
  margin-top: 20px;
`;

const UserTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
`;

const UserTableHeader = styled.th`
  background-color: #34495e;
  color: white;
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
`;

const UserRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const UserCell = styled.td`
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
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

const NoUsersMessage = styled.div`
  text-align: center;
  margin-top: 20px;
  font-size: 18px;
`;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || usersData;
    setUsers(storedUsers);
  }, []);

  const saveUsersToLocalStorage = (users) => {
    localStorage.setItem('users', JSON.stringify(users));
  };

  const handleCreateUser = (newUser) => {
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveUsersToLocalStorage(updatedUsers);
    setShowForm(false);
    setEditingUser(null);
  };

  const handleUpdateUser = (updatedUser) => {
    const updatedUsers = users.map(user =>
      user.id === updatedUser.id ? updatedUser : user
    );
    setUsers(updatedUsers);
    saveUsersToLocalStorage(updatedUsers);
    setShowForm(false);
    setEditingUser(null);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDeleteUser = (userId) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    saveUsersToLocalStorage(updatedUsers);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setEditingUser(null);
  };

  return (
    <div>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Content isSidebarOpen={isSidebarOpen}>
        <WelcomeMessage>
          User Management
          <p>Manage user accounts and permissions.</p>
        </WelcomeMessage>
        <Button onClick={toggleForm}>
          {showForm ? 'Hide Form' : 'Create New User'}
        </Button>
        {showForm && (
          <UserForm
            onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
            initialUser={editingUser}
          />
        )}
        <CurrentUsers>
          <h2>Current Users</h2>
          <UserList>
            {users.length > 0 ? (
              <UserTable>
                <thead>
                  <tr>
                    <UserTableHeader>ID</UserTableHeader>
                    <UserTableHeader>Username</UserTableHeader>
                    <UserTableHeader>Role</UserTableHeader>
                    <UserTableHeader>ACTIONS</UserTableHeader>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <UserRow key={user.id}>
                      <UserCell>{user.id}</UserCell>
                      <UserCell>{user.username}</UserCell>
                      <UserCell>{user.role}</UserCell>
                      <UserCell>
                        <EditButton onClick={() => handleEditUser(user)}>Edit</EditButton>
                        <DeleteButton onClick={() => handleDeleteUser(user.id)}>Delete</DeleteButton>
                      </UserCell>
                    </UserRow>
                  ))}
                </tbody>
              </UserTable>
            ) : (
              <NoUsersMessage>
                No users found.
              </NoUsersMessage>
            )}
          </UserList>
        </CurrentUsers>
      </Content>
    </div>
  );
};

export default UserManagement;
