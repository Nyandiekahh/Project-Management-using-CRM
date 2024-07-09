import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import ComplaintsPage from './pages/ComplaintsPage';
import TaskManagementPage from './pages/TaskManagementPage';
import OfficerDashboard from './pages/OfficerDashboard';
// Add other imports as needed

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/complaints" element={<ComplaintsPage />} />
        <Route path="/tasks" element={<TaskManagementPage />} />
        {/* Add other routes here */}
        <Route path="/officer-dashboard" element={<OfficerDashboard />} />
        {/* Add routes for FAQs and Reports if they are separate components/pages */}
      </Routes>
    </Router>
  );
};

export default App;
