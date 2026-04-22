import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../services/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
