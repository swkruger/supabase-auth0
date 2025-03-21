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
    const { id } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Todo ID is required' },
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
        { error: 'Unauthorized - you do not have permission to delete this todo' },
        { status: 403 }
      );
    }
    
    // Soft delete the todo
    const { data: deletedTodo, error: deleteError } = await supabaseAdmin
      .from('todos')
      .update({ 
        is_deleted: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
      
    if (deleteError) {
      console.error("Error deleting todo in Supabase:", deleteError);
      return NextResponse.json(
        { error: 'Failed to delete todo', details: deleteError },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, todo: deletedTodo[0] });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return NextResponse.json(
      { error: 'Server error', details: (error as Error).message },
      { status: 500 }
    );
  }
} 