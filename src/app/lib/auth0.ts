import { getSession, updateSession, getAccessToken } from '@auth0/nextjs-auth0';
import { initAuth0 } from '@auth0/nextjs-auth0';

// Initialize the Auth0 SDK with proper configuration
export const auth0 = initAuth0({
  secret: process.env.AUTH0_SECRET!,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!,
  routes: {
    callback: '/api/auth/callback',
    login: '/api/auth/login',
    postLogoutRedirect: process.env.AUTH0_POST_LOGOUT_REDIRECT_URI || '/'
  },
  session: {
    rollingDuration: 60 * 60 * 24, // 24 hours
    absoluteDuration: 60 * 60 * 24 * 7, // 7 days
    cookie: {
      domain: process.env.NODE_ENV === 'production' ? 'yourdomain.com' : undefined, // Set your domain in production
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
  },
  authorizationParams: {
    scope: 'openid profile email',
    response_type: 'code',
  },
  // Enable CSRF protection 
  idTokenSigningAlg: 'RS256',
  enableTelemetry: false,
  // Generate a sufficiently random state parameter
  transactionCookie: {
    name: 'auth0.transaction',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  },
});

/**
 * Get user session with error handling
 */
export async function getSessionSafe() {
  try {
    const session = await getSession();
    return { session, error: null };
  } catch (error) {
    console.error('Failed to get session:', error);
    return { session: null, error: 'Failed to authenticate user' };
  }
}

// Export the standalone functions
export { getSession, updateSession, getAccessToken };