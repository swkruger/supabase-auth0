/**
 * Auth0 utility functions for user roles and permissions
 */

/**
 * Check if a user has the admin role
 * @param user Auth0 user object
 * @returns boolean indicating whether user has admin role
 */
export function isUserAdmin(user: any): boolean {
  if (!user) return false;
  
  // Check different possible locations for roles in Auth0 tokens
  return Boolean(
    user.roles?.includes('admin') || 
    user['https://fifolio.app.com/roles']?.includes('admin') ||
    user['https://fifolio.com/roles']?.includes('admin')
  );
}

/**
 * Check if a user has a specific permission
 * @param user Auth0 user object
 * @param permission Permission to check for
 * @returns boolean indicating whether user has the permission
 */
export function hasPermission(user: any, permission: string): boolean {
  if (!user) return false;
  
  // First check if user is admin (admins have all permissions)
  if (isUserAdmin(user)) return true;
  
  // Check direct permissions from Auth0 token in different possible locations
  const userPermissions = 
    user.permissions ||
    user['https://fifolio.app.com/permissions'] ||
    user['https://fifolio.com/permissions'] ||
    [];
    
  return Array.isArray(userPermissions) && userPermissions.includes(permission);
} 