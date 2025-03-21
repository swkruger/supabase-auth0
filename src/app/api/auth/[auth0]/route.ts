import { handleAuth, handleLogin, handleLogout } from '@auth0/nextjs-auth0';

// Export the Auth0 handlers with custom options
export const GET = handleAuth({
  login: handleLogin({
    returnTo: '/todos',
    authorizationParams: {
      scope: 'openid profile email'
    }
  }),
  logout: handleLogout({
    returnTo: '/'
  })
});

export const POST = GET; 