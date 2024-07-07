import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, component: Component, role }) => {
  console.log('ProtectedRoute - User:', user);
  console.log('ProtectedRoute - Role:', role);

  if (!user) {
    console.log('No user, redirecting to login');
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    console.log('User role does not match, redirecting to home');
    return <Navigate to="/" />;
  }

  console.log('Rendering component:', Component);
  return <Component />;
};

export default ProtectedRoute;
