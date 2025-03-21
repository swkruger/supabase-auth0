import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';
import { NextResponse } from 'next/server';
import type { NextRequest, NextFetchEvent } from 'next/server';

// Middleware composition to add security headers
const addSecurityHeaders = (request: NextRequest) => {
  const response = NextResponse.next();
  
  // Set security headers
  const headers = response.headers;
  
  // Prevent clickjacking
  headers.set('X-Frame-Options', 'SAMEORIGIN');
  
  // Prevent MIME type sniffing
  headers.set('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  headers.set('X-XSS-Protection', '1; mode=block');
  
  // Control DNS prefetching
  headers.set('X-DNS-Prefetch-Control', 'on');
  
  // Referrer policy
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Control what resources can be loaded
  // Note: CSP headers are also set globally in next.config.js
  
  // Permissions policy to limit features
  headers.set('Permissions-Policy', 
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );
  
  return response;
};

// Create auth middleware wrapper
const getAuthMiddleware = () => {
  return withMiddlewareAuthRequired();
};

// Combine middlewares
export default async function middleware(req: NextRequest, event: NextFetchEvent) {
  // First add security headers to all requests
  const securityResponse = addSecurityHeaders(req);
  
  // Check if request path matches authenticated routes
  const path = req.nextUrl.pathname;
  const isProtectedRoute = [
    '/todos', 
    '/dashboard', 
    '/settings', 
    '/admin'
  ].some(prefix => path.startsWith(prefix));
  
  // Only apply auth middleware to protected routes
  if (isProtectedRoute) {
    try {
      // Get the Auth0 middleware for protected routes
      const authMiddleware = getAuthMiddleware();
      // Execute it with both required parameters
      return authMiddleware(req, event);
    } catch (error) {
      console.error('Auth middleware error:', error);
      
      // Redirect to error page on auth failure
      const errorUrl = new URL('/api/auth/error', req.url);
      errorUrl.searchParams.set('error', 'middleware_error');
      return NextResponse.redirect(errorUrl);
    }
  }
  
  // For non-protected routes, just apply security headers
  return securityResponse;
}

// Define specific routes to protect
export const config = {
  matcher: [
    // Apply to all routes
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
