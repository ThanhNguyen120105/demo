import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ManagerRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Check if user is authenticated and has MANAGER role
  if (!user || (user.role !== 'MANAGER' && user.role_id !== 4)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ManagerRoute;
