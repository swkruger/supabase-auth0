import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getAuthenticatedUser } from '@/lib/api-utils';

export async function GET(req: NextRequest) {
  try {
    const authResult = await getAuthenticatedUser();
    
    // If there's an error response, return it immediately
    if (authResult.error) {
      return authResult.error;
    }
    
    const { supabaseUser, isAdmin } = authResult;
    
    // Verify supabaseAdmin is initialized
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }
    
    // Build query
    let query = supabaseAdmin
      .from('todos')
      .select('*')
      .eq('is_deleted', false);
    
    // If not admin, only fetch the user's todos
    if (!isAdmin) {
      query = query.eq('user_id', supabaseUser.id);
    }
    
    // Execute query
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching todos:", error);
      return NextResponse.json(
        { error: 'Failed to fetch todos', details: error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ todos: data || [] });
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json(
      { error: 'Server error', details: (error as Error).message },
      { status: 500 }
    );
  }
} 