import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { supabaseAdmin } from './supabase';
import { isUserAdmin } from './auth-utils';

/**
 * Retrieves the authenticated user from Auth0 and Supabase for API routes
 * @returns Object containing Auth0 user, Supabase user data, and isAdmin flag
 */
export async function getAuthenticatedUser() {
  // Get the Auth0 session
  const session = await getSession();
  
  if (!session?.user) {
    return {
      error: NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    };
  }
  
  if (!supabaseAdmin) {
    console.error('Supabase admin client not initialized');
    return {
      error: NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    };
  }
  
  // Get user from Supabase by auth0_id
  const { data: userData, error: userError } = await supabaseAdmin
    .from('users')
    .select('id, email')
    .eq('auth0_id', session.user.sub)
    .single();
    
  if (userError) {
    console.error("Error fetching user from Supabase:", userError);
    return {
      error: NextResponse.json(
        { error: 'User not found', details: userError },
        { status: 404 }
      )
    };
  }
  
  // Check if user is admin
  const isAdmin = isUserAdmin(session.user);
  
  return {
    auth0User: session.user,
    supabaseUser: userData,
    isAdmin
  };
} 