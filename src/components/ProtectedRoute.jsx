import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAdminToken } from '../lib/adminAuth';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  if (!getAdminToken()) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
