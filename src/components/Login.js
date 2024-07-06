import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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
  const [userType, setUserType] = useState('admin');
  const [workId, setWorkId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (userType === 'admin' && workId === 'admin' && password === 'admin123') {
      navigate('/admin-dashboard');
    } else if (userType === 'officer' && workId === 'officer' && password === 'officer123') {
      navigate('/officer-dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <LoginContainer>
      <h2>Login</h2>
      <Form onSubmit={handleLogin}>
        <select value={userType} onChange={(e) => setUserType(e.target.value)} style={{ marginBottom: '20px', padding: '12px', fontSize: '18px', borderRadius: '5px' }}>
          <option value="admin">Admin</option>
          <option value="officer">Officer</option>
        </select>
        <Input
          type="text"
          placeholder="Work ID"
          value={workId}
          onChange={(e) => setWorkId(e.target.value)}
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
