import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getAuthenticatedUser } from '@/lib/api-utils';

export async function POST(req: NextRequest) {
  try {
    const authResult = await getAuthenticatedUser();
    
    // If there's an error response, return it immediately
    if (authResult.error) {
      return authResult.error;
    }
    
    const { auth0User, supabaseUser, isAdmin } = authResult;
    
    // Parse request body
    const body = await req.json();
    const { title, userId: requestedUserId } = body;
    
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    
    // Verify supabaseAdmin is initialized
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }
    
    // Determine the target user_id
    // If an admin requests a different userId, use that, otherwise use the current user's id
    const targetUserId = requestedUserId && isAdmin ? requestedUserId : supabaseUser.id;
    
    // Add the todo
    const { data: newTodo, error: insertError } = await supabaseAdmin
      .from('todos')
      .insert([
        {
          user_id: targetUserId,
          title,
          completed: false,
        }
      ])
      .select();
      
    if (insertError) {
      console.error("Error creating todo in Supabase:", insertError);
      return NextResponse.json(
        { error: 'Failed to create todo', details: insertError },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, todo: newTodo[0] });
  } catch (error) {
    console.error('Error adding todo:', error);
    return NextResponse.json(
      { error: 'Server error', details: (error as Error).message },
      { status: 500 }
    );
  }
} 