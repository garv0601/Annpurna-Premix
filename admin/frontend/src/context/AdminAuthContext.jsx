import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  signInAdmin,
  signOutAdmin,
  getCurrentSession,
  checkAdminStatus,
  onAuthStateChange,
} from '../services/adminAuthService';

/**
 * ADMIN AUTH CONTEXT
 * 
 * Provides authentication & authorization state to the entire admin app.
 * 
 * States:
 *   loading  = true  → session/admin check in progress (show loading UI)
 *   user     = null  → not authenticated → redirect to login
 *   user     = {...} → authenticated AND authorized admin → allow access
 */

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);       // Supabase auth user
  const [session, setSession] = useState(null);  // Supabase session
  const [loading, setLoading] = useState(true);  // Initial session resolution
  const [error, setError] = useState(null);      // Auth error for login page

  /**
   * Initialize: check for existing session on mount.
   * If a valid session exists, verify admin status before granting access.
   */
  const initializeAuth = useCallback(async () => {
    try {
      setLoading(true);
      const currentSession = await getCurrentSession();

      if (currentSession?.user) {
        // Session exists — verify this user is still an active admin
        const adminStatus = await checkAdminStatus(currentSession.user.id);

        if (adminStatus.isAdmin) {
          setUser(currentSession.user);
          setSession(currentSession);
        } else {
          // Session exists but user is not/no-longer an admin
          await signOutAdmin();
          setUser(null);
          setSession(null);
        }
      } else {
        setUser(null);
        setSession(null);
      }
    } catch (err) {
      console.error('Auth initialization error:', err);
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // 10-minute inactivity auto-logout
  useEffect(() => {
    let inactivityTimer;

    const resetTimer = () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      // 10 minutes = 10 * 60 * 1000 ms
      inactivityTimer = setTimeout(() => {
        if (user) {
          console.log('User inactive for 10 minutes, logging out automatically.');
          logout();
        }
      }, 600000);
    };

    const handleActivity = () => {
      if (user) {
        resetTimer();
      }
    };

    if (user) {
      resetTimer();
      window.addEventListener('mousemove', handleActivity);
      window.addEventListener('keydown', handleActivity);
      window.addEventListener('click', handleActivity);
      window.addEventListener('scroll', handleActivity);
    }

    return () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [user]);

  useEffect(() => {
    initializeAuth();

    // Subscribe to auth state changes (token refresh, sign out from another tab, etc.)
    const subscription = onAuthStateChange((event, newSession) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
      }
      // For TOKEN_REFRESHED, we keep the existing verified admin state.
      // We do NOT re-verify on every token refresh to avoid unnecessary DB calls.
      if (event === 'TOKEN_REFRESHED' && newSession) {
        setSession(newSession);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initializeAuth]);

  /**
   * Login handler — called from the login page.
   */
  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const { user: authUser, session: authSession } = await signInAdmin(email, password);
      setUser(authUser);
      setSession(authSession);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  /**
   * Logout handler — called from the sidebar.
   */
  const logout = useCallback(async () => {
    try {
      await signOutAdmin();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setSession(null);
    }
  }, []);

  const value = {
    user,
    session,
    loading,
    error,
    setError,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

/**
 * Hook to access admin auth context.
 */
export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
