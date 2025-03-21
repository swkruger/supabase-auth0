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
    
    const { supabaseUser, isAdmin } = authResult;
    
    // Parse request body
    const body = await req.json();
    const { id, completed } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Todo ID is required' },
        { status: 400 }
      );
    }
    
    if (completed === undefined) {
      return NextResponse.json(
        { error: 'Completed status is required' },
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
    
    // Get the todo
    const { data: todoData, error: todoError } = await supabaseAdmin
      .from('todos')
      .select('user_id')
      .eq('id', id)
      .single();
      
    if (todoError) {
      return NextResponse.json(
        { error: 'Todo not found', details: todoError },
        { status: 404 }
      );
    }
    
    // Verify ownership or admin status
    if (!isAdmin && todoData.user_id !== supabaseUser.id) {
      return NextResponse.json(
        { error: 'Unauthorized - you do not have permission to update this todo' },
        { status: 403 }
      );
    }
    
    // Update the todo
    const { data: updatedTodo, error: updateError } = await supabaseAdmin
      .from('todos')
      .update({ 
        completed,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
      
    if (updateError) {
      console.error("Error updating todo in Supabase:", updateError);
      return NextResponse.json(
        { error: 'Failed to update todo', details: updateError },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, todo: updatedTodo[0] });
  } catch (error) {
    console.error('Error updating todo:', error);
    return NextResponse.json(
      { error: 'Server error', details: (error as Error).message },
      { status: 500 }
    );
  }
} 