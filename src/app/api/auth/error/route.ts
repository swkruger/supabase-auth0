import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Auth0 error handling route
 * This route handles authentication errors without exposing sensitive details to users
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  
  // Generate a unique error ID for logging but don't expose error details
  const errorId = crypto.randomBytes(4).toString('hex');
  
  // Log the full error for monitoring/debugging
  console.error('Auth0 error:', {
    errorId,
    error,
    errorDescription,
    timestamp: new Date().toISOString(),
    url: req.url
  });
  
  // Map Auth0 errors to our simplified error types without exposing details
  let errorType = 'authError=true';
  if (error === 'unauthorized') {
    errorType = 'permissionError=true';
  } else if (error?.includes('token')) {
    errorType = 'tokenError=true';
  } else if (error?.includes('session')) {
    errorType = 'sessionError=true';
  }
  
  // Redirect to unauthorized page with the error type
  const redirectUrl = new URL('/unauthorized', req.url);
  redirectUrl.search = `${errorType}&errorId=${errorId}`;
  
  return NextResponse.redirect(redirectUrl);
}

export const POST = GET; 