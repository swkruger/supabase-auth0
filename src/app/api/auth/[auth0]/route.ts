import { handleAuth, handleLogin, handleLogout } from '@auth0/nextjs-auth0';

// Export the Auth0 handlers but with custom options to fix the audience issue
export const GET = handleAuth({
  login: handleLogin({
    returnTo: '/todos',
    authorizationParams: {
      // Remove audience to fix the "service not found" error
      scope: 'openid profile email'
    }
  }),
  logout: handleLogout({
    returnTo: '/'
  })
});
export const POST = GET; 