import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../services/store';

interface RoleRouteProps {
  allowedRoles: Array<'student' | 'teacher'>;
  children: React.ReactNode;
}

const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRoles, children }) => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
};

export default RoleRoute;
