import { createClient } from '@supabase/supabase-js';

// These values come from .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY as string;

// Create a single supabase client for the browser
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create a service role client for admin operations that bypass RLS
// WARNING: This client should ONLY be used in server-side code, never in the browser
export const supabaseAdmin = typeof window === 'undefined' && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// Function to create an authenticated Supabase client with Auth0 token
export const createAuthenticatedSupabaseClient = (auth0Token: string) => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${auth0Token}`,
      },
    },
  });
}; 