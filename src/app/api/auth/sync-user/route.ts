import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    // Get the Auth0 session
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const auth0User = session.user;
    
    if (!auth0User.sub || !auth0User.email) {
      return NextResponse.json(
        { error: 'Invalid user data' },
        { status: 400 }
      );
    }
    
    if (!supabaseAdmin) {
      console.error('Supabase admin client not initialized');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }
    
    // Check if user exists in Supabase by auth0_id
    const { data: existingUsers, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('auth0_id', auth0User.sub)
      .limit(1);
      
    if (fetchError) {
      console.error("Error fetching user from Supabase:", fetchError);
      return NextResponse.json(
        { error: 'Database error', details: fetchError },
        { status: 500 }
      );
    }
    
    let userId;
    
    if (existingUsers && existingUsers.length > 0) {
      // User exists
      userId = existingUsers[0].id;
      
      // Update email if it changed
      if (existingUsers[0].email !== auth0User.email) {
        const { error: updateError } = await supabaseAdmin
          .from('users')
          .update({ email: auth0User.email })
          .eq('id', userId);
          
        if (updateError) {
          console.error("Error updating user email in Supabase:", updateError);
          return NextResponse.json(
            { error: 'Database update error', details: updateError },
            { status: 500 }
          );
        }
      }
    } else {
      // User doesn't exist, create new user with upsert pattern
      console.log("User doesn't exist, creating new user with upsert pattern");
      const { data: newUser, error: insertError } = await supabaseAdmin
        .from('users')
        .upsert([
          { 
            email: auth0User.email,
            auth0_id: auth0User.sub
          }
        ], { 
          onConflict: 'auth0_id',  // Handle conflicts on auth0_id
          ignoreDuplicates: false  // Update the record if there's a conflict
        })
        .select();
        
      if (insertError) {
        // Check if this is a duplicate key violation (user already exists)
        if (insertError.code === '23505' && insertError.message.includes('users_auth0_id_key')) {
          console.log("User already exists with this auth0_id, fetching existing user");
          // Fetch the existing user by auth0_id
          const { data: existingUserRetry, error: retryError } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('auth0_id', auth0User.sub)
            .limit(1);
            
          if (retryError) {
            console.error("Error fetching existing user:", retryError);
            return NextResponse.json(
              { error: 'Failed to fetch existing user', details: retryError },
              { status: 500 }
            );
          }
          
          if (existingUserRetry && existingUserRetry.length > 0) {
            userId = existingUserRetry[0].id;
            console.log("Retrieved existing user:", userId);
            return NextResponse.json({ success: true, userId });
          }
        }
        
        // For other types of errors, return as normal
        console.error("Error creating user in Supabase:", insertError);
        return NextResponse.json(
          { error: 'Database insert error', details: insertError },
          { status: 500 }
        );
      }
      
      if (newUser && newUser.length > 0) {
        userId = newUser[0].id;
      } else {
        return NextResponse.json(
          { error: 'User created but no data returned' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json({ success: true, userId });
  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.json(
      { error: 'Server error', details: (error as Error).message },
      { status: 500 }
    );
  }
} 