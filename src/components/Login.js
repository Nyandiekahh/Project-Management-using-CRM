// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
    seniorOfficer5: { username: 'seniorOfficer5', password: 'so123', navigateTo: '/senior-officer-dashboard', role: 'seniorOfficer' }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = Object.values(credentials).find(
        user => user.username === username && user.password === password
      );

      if (user) {
        await login(user.username, user.role);
        navigate(user.navigateTo);
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="animated-background">
          <div className="gradient-overlay"></div>
          <div className="content-overlay">
            <h1>Project Management System</h1>
            <p>Streamline your workflow. Enhance productivity.</p>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-container">
          <div className="login-header">
            <div className="logo-container">
              <div className="logo-circle"></div>
              <h2>Login Portal</h2>
            </div>
            {error && (
              <div className="error-alert">
                <AlertCircle />
                <span>{error}</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="modern-form">
            <div className="form-field">
              <div className="input-wrapper">
                <User className="field-icon" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Username"
                />
                <div className="input-focus-effect"></div>
              </div>
            </div>

            <div className="form-field">
              <div className="input-wrapper">
                <Lock className="field-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
                <div className="input-focus-effect"></div>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Remember me
              </label>
              <button type="button" className="forgot-link">
                Forgot password?
              </button>
            </div>

            <button 
              type="submit" 
              className={`submit-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              <span className="btn-text">{isLoading ? 'Signing in...' : 'Sign in'}</span>
              <span className="btn-loader"></span>
            </button>
          </form>

          <div className="support-section">
            <p>Need help? <button className="support-btn">Contact IT Support</button></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;