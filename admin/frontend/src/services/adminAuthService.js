import { supabase } from '../lib/supabase';

/**
 * ADMIN AUTHENTICATION SERVICE
 * 
 * Handles authentication via Supabase Auth and
 * authorization via public.admin_users table.
 * 
 * Auth flow:
 *   1. supabase.auth.signInWithPassword() — authenticates the user
 *   2. checkAdminStatus()                 — verifies they are an active admin
 *   3. Only then grant access to admin routes
 */

/**
 * Sign in with email + password via Supabase Auth.
 * Does NOT check admin status — call checkAdminStatus() separately.
 */
export async function signInWithCredentials(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Instead of hiding the error, show exactly what Supabase says
    throw new Error(error.message || 'Unable to connect to authentication server.');
  }

  return data; // { user, session }
}

/**
 * Check whether the currently authenticated user is an active admin.
 * Queries public.admin_users for a matching user_id with is_active = true.
 * 
 * This is the AUTHORIZATION check — separate from authentication.
 * The database (RLS) remains the final authority.
 */
export async function checkAdminStatus(userId) {
  const { data, error } = await supabase
    .from('admin_users')
    .select('id, is_active')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return { isAdmin: false, reason: 'not_admin' };
  }

  if (!data.is_active) {
    return { isAdmin: false, reason: 'inactive' };
  }

  return { isAdmin: true, reason: null };
}

/**
 * Full admin sign-in flow:
 * 1. Authenticate with Supabase Auth
 * 2. Verify admin authorization
 * 3. If not authorized, sign out immediately
 */
export async function signInAdmin(email, password) {
  // Step 1: Authenticate
  const { user, session } = await signInWithCredentials(email, password);

  // Step 2: Authorize
  const adminStatus = await checkAdminStatus(user.id);

  if (!adminStatus.isAdmin) {
    // Immediately revoke the session — this user is NOT an admin
    await supabase.auth.signOut();

    if (adminStatus.reason === 'inactive') {
      throw new Error('Your admin account is inactive.');
    }
    throw new Error('You do not have permission to access the admin portal.');
  }

  return { user, session };
}

/**
 * Sign out the current admin session.
 */
export async function signOutAdmin() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Sign out error:', error);
    throw new Error('Failed to sign out. Please try again.');
  }
}

/**
 * Get the current Supabase session (if any).
 */
export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Session retrieval error:', error);
    return null;
  }
  return session;
}

/**
 * Subscribe to auth state changes.
 * Returns the subscription object — caller must call .unsubscribe() on cleanup.
 */
export function onAuthStateChange(callback) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      callback(event, session);
    }
  );
  return subscription;
}
