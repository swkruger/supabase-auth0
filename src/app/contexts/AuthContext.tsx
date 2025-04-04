"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from '@auth0/nextjs-auth0/client';
import { supabase } from "@/lib/supabase";
import { isUserAdmin, hasPermission } from '@/lib/auth-utils';

// User type
export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  roles: string[]; // Add roles
  permissions: string[]; // Add permissions
};

// Authentication context type
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean; // Add admin role check
  hasPermission: (permission: string) => boolean; // Check specific permissions
  logout: () => void;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isAdmin: false,
  hasPermission: () => false,
  logout: () => {},
});

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user: auth0User, isLoading: auth0Loading, error } = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Sync Auth0 user with Supabase via server API to bypass RLS
  const syncUserWithSupabase = async (auth0UserData: any) => {
    try {
      console.log('Syncing user with Supabase via API:', auth0UserData.email);
      
      if (!auth0UserData?.sub) {
        console.error("No auth0_id (sub) found in Auth0 user data");
        return auth0UserData.sub; // Return the auth0 ID as fallback
      }

      // Call our API endpoint that uses the admin client to bypass RLS
      const response = await fetch('/api/auth/sync-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error syncing user with API:', errorData);
        // Even if the sync fails, we can still use the auth0 ID as fallback
        return auth0UserData.sub;
      }
      
      const data = await response.json();
      console.log('User sync successful:', data);
      return data.userId;
    } catch (error) {
      console.error("Error syncing user with API:", error);
      // If anything fails, use the auth0 ID as fallback
      return auth0UserData.sub;
    }
  };

  // Process Auth0 user data
  useEffect(() => {
    const processAuth0User = async () => {
      if (!auth0Loading) {
        if (auth0User) {
          // Get roles and permissions from Auth0 user data
          // Auth0 provides roles and permissions through namespaced claims in the token
          const namespace = 'https://fifolio.app.com'; // Custom namespace for your application
          
          // Debug: Log the Auth0 user object structure in development
          if (process.env.NODE_ENV === 'development') {
            console.log('Auth0 User Object:', JSON.stringify(auth0User, null, 2));
            
            // Check and log all possible role/permission locations to help identify the source
            const possibleRoleLocations = [
              { name: 'namespace/roles', value: auth0User[`${namespace}/roles`] },
              { name: 'https://fifolio.com/roles', value: auth0User['https://fifolio.com/roles'] },
              { name: 'user_metadata.roles', value: (auth0User['https://fifolio.com/user_metadata'] as any)?.roles },
              { name: 'app_metadata.roles', value: (auth0User['https://fifolio.com/app_metadata'] as any)?.roles },
              { name: 'roles', value: auth0User.roles },
              { name: 'https://auth0.com/roles', value: auth0User['https://auth0.com/roles'] },
              { name: 'https://fifolio.auth0.com/roles', value: auth0User['https://fifolio.auth0.com/roles'] },
              { name: 'http://fifolio.com/roles', value: auth0User['http://fifolio.com/roles'] },
            ];
            
            console.log('Role locations found:', possibleRoleLocations.filter(loc => loc.value !== undefined));
            console.log('Permission locations found:', [
              { name: 'namespace/permissions', value: auth0User[`${namespace}/permissions`] },
              { name: 'https://fifolio.com/permissions', value: auth0User['https://fifolio.com/permissions'] },
              { name: 'user_metadata.permissions', value: (auth0User['https://fifolio.com/user_metadata'] as any)?.permissions },
              { name: 'app_metadata.permissions', value: (auth0User['https://fifolio.com/app_metadata'] as any)?.permissions },
              { name: 'permissions', value: auth0User.permissions },
              { name: 'https://auth0.com/permissions', value: auth0User['https://auth0.com/permissions'] },
              { name: 'https://fifolio.auth0.com/permissions', value: auth0User['https://fifolio.auth0.com/permissions'] },
              { name: 'http://fifolio.com/permissions', value: auth0User['http://fifolio.com/permissions'] },
            ].filter(loc => loc.value !== undefined));
          }
          
          // Check different possible locations for roles
          const roles = 
            auth0User[`${namespace}/roles`] || 
            auth0User[`https://fifolio.com/roles`] || // Alternative namespace
            (auth0User[`https://fifolio.com/user_metadata`] as any)?.roles ||
            (auth0User[`https://fifolio.com/app_metadata`] as any)?.roles ||
            auth0User.roles || 
            auth0User['https://auth0.com/roles'] || // Common Auth0 namespace
            auth0User['https://fifolio.auth0.com/roles'] || // Tenant-specific namespace
            auth0User['http://fifolio.com/roles'] || // Alternative non-HTTPS namespace
            ['user']; // Default role
          
          // Check different possible locations for permissions
          let permissions = 
            auth0User[`${namespace}/permissions`] || 
            auth0User[`https://fifolio.com/permissions`] || // Alternative namespace
            (auth0User[`https://fifolio.com/user_metadata`] as any)?.permissions ||
            (auth0User[`https://fifolio.com/app_metadata`] as any)?.permissions ||
            auth0User.permissions || // <-- This is where the permissions are in the token
            auth0User['https://auth0.com/permissions'] || // Common Auth0 namespace
            auth0User['https://fifolio.auth0.com/permissions'] || // Tenant-specific namespace
            auth0User['http://fifolio.com/permissions'] || // Alternative non-HTTPS namespace
            [];
          
          // Add default Auth0 permissions if none were found but we know they exist
          if ((!permissions || permissions.length === 0) && auth0User.email) {
            // These are the typical default permissions in an Auth0 token
            permissions = [
              'read:email',
              'read:profile',
              'read:openid',
              'read:roles',
              'read:user_idp_tokens',
              'read:offline_access'
            ];
          }

          // Add additional debug logging to see raw permissions value
          if (process.env.NODE_ENV === 'development') {
            console.log('Direct permissions value:', auth0User.permissions);
            console.log('Final permissions used:', permissions);
          }

          // Sync with Supabase and get the user ID
          const supabaseUserId = await syncUserWithSupabase(auth0User);
          
          setUser({
            id: supabaseUserId || auth0User.sub || '',
            name: auth0User.name || '',
            email: auth0User.email || '',
            avatar: auth0User.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${auth0User.name?.charAt(0) || 'X'}`,
            roles: Array.isArray(roles) ? roles : ['user'],
            permissions: Array.isArray(permissions) ? permissions : [],
          });
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    };
    
    processAuth0User();
  }, [auth0User, auth0Loading]);

  // Redirect authenticated users from welcome page to todos - with safeguards
  useEffect(() => {
    // Only redirect if:
    // 1. We know the auth state for sure (not loading)
    // 2. User is authenticated
    // 3. We're on the home page
    // 4. We're not in the middle of an Auth0 callback flow
    if (!isLoading && user && pathname === "/" && !window.location.href.includes('/api/auth')) {
      // Add a small delay to avoid conflict with Auth0 routing
      const redirectTimer = setTimeout(() => {
        router.push("/todos");
      }, 100);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [isLoading, user, pathname, router]);

  // Check if user has admin role
  const isAdmin = isUserAdmin(user);

  // Check if user has a specific permission
  const hasPermissionCheck = (permission: string): boolean => {
    return hasPermission(user, permission);
  };

  // Logout function
  const logout = () => {
    // Auth0 logout is handled via a redirect to the logout route
    router.push("/api/auth/logout");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: isLoading || auth0Loading,
        isAuthenticated: !!user,
        isAdmin,
        hasPermission: hasPermissionCheck,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
} 