/**
 * ANNPURNA — Authentication Service
 *
 * All Supabase auth calls go through this module.
 */

import supabase, { credentialsMissing } from '../lib/supabase';

const notConfigured = () => ({
  data: null,
  error: {
    message: 'Supabase is not configured. Add your credentials to .env.local and restart the dev server.',
    code: 'not_configured',
  },
});

// ── Passwordless Sign Up / Sign In ───────────────────────────────────────────

/**
 * Send an OTP/Magic Link for Sign Up.
 * Creates the user if they don't exist.
 */
export const sendAuthOtp = async (method, identifier, metadata = {}) => {
  if (credentialsMissing) return notConfigured();

  const options = {
    shouldCreateUser: true,
    data: {
      full_name: metadata.fullName ?? '',
      mobile: metadata.mobile ?? '',
      email: metadata.email ?? '', // Store the other identifier in metadata just in case
    },
  };

  if (method === 'email') {
    return await supabase.auth.signInWithOtp({ email: identifier, options });
  } else {
    // Supabase phone OTP expects E.164 format (e.g. +91...)
    const phone = identifier.startsWith('+') ? identifier : `+91${identifier}`;
    return await supabase.auth.signInWithOtp({ phone, options });
  }
};

/**
 * Verify a phone or email OTP.
 */
export const verifyAuthOtp = async (method, identifier, token) => {
  if (credentialsMissing) return notConfigured();

  if (method === 'email') {
    return await supabase.auth.verifyOtp({ email: identifier, token, type: 'email' });
  } else {
    const phone = identifier.startsWith('+') ? identifier : `+91${identifier}`;
    return await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
  }
};

// ── Legacy Password-based functions (kept for compatibility) ───────────────

export const signUp = async (email, password, metadata = {}) => {
  if (credentialsMissing) return notConfigured();
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: metadata.fullName ?? '',
        mobile: metadata.mobile ?? '',
      },
    },
  });
};

export const signIn = async (email, password) => {
  if (credentialsMissing) return notConfigured();
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  if (credentialsMissing) return notConfigured();
  return await supabase.auth.signOut();
};

// ── OAuth ────────────────────────────────────────────────────────────────────

export const signInWithGoogle = async (redirectTo = window.location.origin) => {
  if (credentialsMissing) return notConfigured();
  return await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } });
};

export const signInWithFacebook = async (redirectTo = window.location.origin) => {
  if (credentialsMissing) return notConfigured();
  return await supabase.auth.signInWithOAuth({ provider: 'facebook', options: { redirectTo } });
};

// ── Session ──────────────────────────────────────────────────────────────────

export const getSession = async () => {
  if (credentialsMissing) return { session: null, error: null };
  const { data, error } = await supabase.auth.getSession();
  return { session: data?.session ?? null, error };
};

export const getCurrentUser = async () => {
  if (credentialsMissing) return { user: null, error: null };
  const { data, error } = await supabase.auth.getUser();
  return { user: data?.user ?? null, error };
};

export const onAuthStateChange = (callback) => {
  if (credentialsMissing) {
    callback('INITIAL_SESSION', null);
    return () => {};
  }
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
  return () => subscription.unsubscribe();
};

export const updateProfile = async (metadata) => {
  if (credentialsMissing) return notConfigured();
  return await supabase.auth.updateUser({ data: metadata });
};

export const uploadProfileImage = async (userId, file) => {
  if (credentialsMissing) return notConfigured();
  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}/profile.${fileExt}`;
  const { data, error } = await supabase.storage
    .from('profile-images')
    .upload(filePath, file, { upsert: true });

  if (error) return { data: null, error };
  const { data: urlData } = supabase.storage.from('profile-images').getPublicUrl(filePath);
  return { data: { publicUrl: urlData.publicUrl + `?t=${Date.now()}` }, error: null };
};
