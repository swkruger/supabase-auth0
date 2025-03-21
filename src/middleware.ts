import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

// Use the withMiddlewareAuthRequired function to protect specific routes
export default withMiddlewareAuthRequired();

// Define specific routes to protect, not all routes
export const config = {
  matcher: [
    // Protect authenticated routes
    '/todos/:path*',
    '/dashboard/:path*',
    '/settings/:path*',
    '/admin/:path*',
  ],
};
