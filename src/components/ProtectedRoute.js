import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider'; // Ensure this path is correct

const ProtectedRoute = ({ component: Component, role, ...rest }) => {
  const { user } = useAuth();

  return user ? (
    !role || user.role === role ? (
      <Component {...rest} />
    ) : (
      <Navigate to="/login" replace />
    )
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;
