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
  },
  authorizationParams: {
    scope: 'openid profile email',
  },
});

// Export the standalone functions
export { getSession, updateSession, getAccessToken };