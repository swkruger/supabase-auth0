import { handleAuth, handleLogin, handleLogout } from '@auth0/nextjs-auth0';

// Generate a cryptographically secure state parameter
const generateState = () => {
  const state = crypto.randomUUID();
  return state;
};

// Export the Auth0 handlers with custom options and better security
export const GET = handleAuth({
  login: handleLogin({
    returnTo: '/todos',
    authorizationParams: {
      scope: 'openid profile email',
      // Add state parameter for CSRF protection
      state: generateState(),
    },
    getLoginState: () => {
      // This object will be stored with the state to help prevent CSRF
      return {
        returnTo: '/todos',
        timestamp: Date.now(),
      };
    },
  }),
  logout: handleLogout({
    returnTo: '/'
  }),
});

export const POST = GET; 