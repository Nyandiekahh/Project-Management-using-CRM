import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-management" element={<UserManagement />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
};

export default App;
