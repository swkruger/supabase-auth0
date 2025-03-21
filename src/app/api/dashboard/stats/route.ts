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
    
    // Get total tasks
    let totalTasksQuery = supabaseAdmin
      .from('todos')
      .select('*', { count: 'exact' })
      .eq('is_deleted', false);
      
    // Get completed tasks
    let completedTasksQuery = supabaseAdmin
      .from('todos')
      .select('*', { count: 'exact' })
      .eq('is_deleted', false)
      .eq('completed', true);
      
    // Get recent activity
    let recentActivityQuery = supabaseAdmin
      .from('todos')
      .select('*')
      .eq('is_deleted', false)
      .order('updated_at', { ascending: false })
      .limit(5);
    
    // If not admin, only fetch the user's data
    if (!isAdmin) {
      totalTasksQuery = totalTasksQuery.eq('user_id', supabaseUser.id);
      completedTasksQuery = completedTasksQuery.eq('user_id', supabaseUser.id);
      recentActivityQuery = recentActivityQuery.eq('user_id', supabaseUser.id);
    }
    
    // Execute queries
    const [totalTasksResult, completedTasksResult, recentActivityResult] = await Promise.all([
      totalTasksQuery,
      completedTasksQuery,
      recentActivityQuery
    ]);
    
    if (totalTasksResult.error || completedTasksResult.error || recentActivityResult.error) {
      console.error("Error fetching stats:", 
        totalTasksResult.error || completedTasksResult.error || recentActivityResult.error);
      return NextResponse.json(
        { error: 'Failed to fetch dashboard stats' },
        { status: 500 }
      );
    }
    
    const totalTasks = totalTasksResult.count || 0;
    const completedTasks = completedTasksResult.count || 0;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    return NextResponse.json({
      stats: {
        totalTasks,
        completedTasks,
        completionRate,
        recentActivity: recentActivityResult.data || []
      }
    });
    
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Server error', details: (error as Error).message },
      { status: 500 }
    );
  }
} 