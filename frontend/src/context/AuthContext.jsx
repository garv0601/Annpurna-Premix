/**
 * ANNPURNA — Auth Context
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getSession,
  onAuthStateChange,
  signIn  as authSignIn,
  signUp  as authSignUp,
  signOut as authSignOut,
  signInWithGoogle   as authGoogle,
  signInWithFacebook as authFacebook,
  updateProfile      as authUpdateProfile,
  uploadProfileImage,
  sendAuthOtp        as authSendAuthOtp,
  verifyAuthOtp      as authVerifyAuthOtp,
} from '../services/auth';
import { credentialsMissing } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};

    const init = async () => {
      if (credentialsMissing) {
        setLoading(false);
        return;
      }

      const { session: existingSession } = await getSession();
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      setLoading(false);

      unsubscribe = onAuthStateChange((_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
      });
    };

    init();
    return () => unsubscribe();
  }, []);

  const signIn = async (email, password) => authSignIn(email, password);
  const signUp = async (email, password, metadata) => authSignUp(email, password, metadata);
  const signOut = async () => {
    const result = await authSignOut();
    if (!result.error) {
      setUser(null);
      setSession(null);
    }
    return result;
  };

  const signInWithGoogle = async (redirectTo) => authGoogle(redirectTo);
  const signInWithFacebook = async (redirectTo) => authFacebook(redirectTo);

  const updateProfile = async (metadata) => {
    const result = await authUpdateProfile(metadata);
    if (!result.error && result.data?.user) {
      setUser(result.data.user);
    }
    return result;
  };

  // OTP / Passwordless actions
  const sendAuthOtp = async (method, identifier, metadata) => authSendAuthOtp(method, identifier, metadata);
  const verifyAuthOtp = async (method, identifier, token) => authVerifyAuthOtp(method, identifier, token);

  const value = {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    credentialsMissing,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithFacebook,
    updateProfile,
    uploadProfileImage,
    sendAuthOtp,
    verifyAuthOtp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

export default AuthContext;
