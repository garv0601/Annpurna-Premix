import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Supabase client for admin frontend.
 * Uses the anon key (public) — row-level-security enforced on the DB side.
 * Never expose the service-role key in frontend code.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
