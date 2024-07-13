import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider'; // Ensure this path is correct
import Login from './components/Login';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import ComplaintsPage from './pages/ComplaintsPage';
import TaskManagementPage from './pages/TaskManagementPage';
import OfficerDashboard from './pages/OfficerDashboard';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin-dashboard"
            element={<ProtectedRoute component={AdminDashboard} role="deputyDirector" />}
          />
          <Route
            path="/user-management"
            element={<ProtectedRoute component={UserManagement} role="deputyDirector" />}
          />
          <Route
            path="/complaints"
            element={<ProtectedRoute component={ComplaintsPage} />}
          />
          <Route
            path="/tasks"
            element={<ProtectedRoute component={TaskManagementPage} />}
          />
          <Route
            path="/officer-dashboard"
            element={<ProtectedRoute component={OfficerDashboard} role="officer" />}
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
