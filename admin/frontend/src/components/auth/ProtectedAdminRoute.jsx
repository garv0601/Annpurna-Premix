import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

/**
 * PROTECTED ADMIN ROUTE WRAPPER
 * 
 * Wraps all authenticated admin content.
 * 
 * Behavior:
 *   loading        → show loading spinner (no flash of content)
 *   unauthenticated → redirect to /admin/login
 *   authenticated   → render children
 */
export default function ProtectedAdminRoute({ children }) {
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="admin-auth-loading" id="admin-auth-loading">
        <div className="admin-auth-loading-inner">
          <div className="admin-auth-spinner" />
          <p>Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
