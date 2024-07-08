import React, { useState } from 'react';
import styled from 'styled-components';

const FormContainer = styled.form`
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const UserForm = ({ onSubmit, initialUser = {} }) => {
  const [username, setUsername] = useState(initialUser.username || '');
  const [role, setRole] = useState(initialUser.role || 'officer');

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      id: initialUser.id || null,
      username,
      role,
    };
    onSubmit(user);
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormGroup>
        <Label>Username</Label>
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <Label>Role</Label>
        <Select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="officer">Officer</option>
        </Select>
      </FormGroup>
      <Button type="submit">Save User</Button>
    </FormContainer>
  );
};

export default UserForm;
