// src/components/Login.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 20px;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  font-size: 18px;
`;

const Input = styled.input`
  margin-bottom: 20px;
  padding: 12px;
  font-size: 18px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 12px;
  font-size: 18px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const PasswordContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ToggleButton = styled.button`
  margin-left: 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #007bff;
  &:hover {
    color: #0056b3;
  }
`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const credentials = {
    deputyDirector: { username: 'deputyDirector', password: 'dd123', navigateTo: '/admin-dashboard', role: 'deputyDirector' },
    principalOfficer1: { username: 'principalOfficer1', password: 'po123', navigateTo: '/principal-officer-dashboard', role: 'principalOfficer' },
    principalOfficer2: { username: 'principalOfficer2', password: 'po123', navigateTo: '/principal-officer-dashboard', role: 'principalOfficer' },
    principalOfficer3: { username: 'principalOfficer3', password: 'po123', navigateTo: '/principal-officer-dashboard', role: 'principalOfficer' },
    principalOfficer4: { username: 'principalOfficer4', password: 'po123', navigateTo: '/principal-officer-dashboard', role: 'principalOfficer' },
    principalOfficer5: { username: 'principalOfficer5', password: 'po123', navigateTo: '/principal-officer-dashboard', role: 'principalOfficer' },
    seniorOfficer1: { username: 'seniorOfficer1', password: 'so123', navigateTo: '/senior-officer-dashboard', role: 'seniorOfficer' },
    seniorOfficer2: { username: 'seniorOfficer2', password: 'so123', navigateTo: '/senior-officer-dashboard', role: 'seniorOfficer' },
    seniorOfficer3: { username: 'seniorOfficer3', password: 'so123', navigateTo: '/senior-officer-dashboard', role: 'seniorOfficer' },
    seniorOfficer4: { username: 'seniorOfficer4', password: 'so123', navigateTo: '/senior-officer-dashboard', role: 'seniorOfficer' },
    seniorOfficer5: { username: 'seniorOfficer5', password: 'so123', navigateTo: '/senior-officer-dashboard', role: 'seniorOfficer' },
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = Object.values(credentials).find(user => user.username === username && user.password === password);

    if (user) {
      login(user.username, user.role);
      navigate(user.navigateTo);
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <LoginContainer>
      <h2>Login</h2>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <PasswordContainer>
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <ToggleButton type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? 'Hide' : 'Show'}
          </ToggleButton>
        </PasswordContainer>
        <Button type="submit">Login</Button>
      </Form>
    </LoginContainer>
  );
};

export default Login;
