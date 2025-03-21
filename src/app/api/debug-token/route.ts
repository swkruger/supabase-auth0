import { getAccessToken } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

// Simple function to decode JWT without validation
function decodeJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error decoding JWT:', e);
    return { error: 'Failed to decode token' };
  }
}

export async function GET() {
  try {
    // Get the access token
    const accessToken = await getAccessToken();
    
    let decodedToken = null;
    if (accessToken?.accessToken) {
      decodedToken = decodeJwt(accessToken.accessToken);
      
      // Check for permissions and roles
      console.log('Token permissions:', decodedToken?.permissions);
      console.log('Token permissions type:', typeof decodedToken?.permissions);
      console.log('Token permissions is array:', Array.isArray(decodedToken?.permissions));
      console.log('Token roles:', decodedToken?.['https://fifolio.app.com/roles']);
      
      // Add specific permission checks
      const specificPermissions = ['read:todos', 'create:todos', 'update:todos', 'delete:todos'];
      specificPermissions.forEach(perm => {
        console.log(`Has permission ${perm}:`, 
          Array.isArray(decodedToken?.permissions) && decodedToken?.permissions.includes(perm));
      });
    }
    
    // Log the complete token for debugging
    console.log('Access Token Object:', JSON.stringify(accessToken, null, 2));
    
    // Only in development, return the token details
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({ 
        message: 'Access token logged to console',
        tokenInfo: accessToken,
        decodedToken
      });
    }
    
    // In production, just confirm it was logged
    return NextResponse.json({ message: 'Access token logged to console' });
  } catch (error) {
    console.error('Failed to get access token:', error);
    return NextResponse.json(
      { error: 'Failed to get access token' },
      { status: 500 }
    );
  }
} 