"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from '@auth0/nextjs-auth0/client';

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

  // Process Auth0 user data
  useEffect(() => {
    if (!auth0Loading) {
      if (auth0User) {
        // In a real app, roles and permissions would come from Auth0 user metadata
        // For now, we'll simulate by setting mock data or using Auth0 data if available
        const roles = auth0User.roles || ['user']; // Default to 'user' role
        const permissions = auth0User.permissions || [];

        setUser({
          id: auth0User.sub || '',
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
  const isAdmin = user?.roles.includes('admin') || false;

  // Check if user has a specific permission
  const hasPermission = (permission: string): boolean => {
    return user?.permissions.includes(permission) || false;
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
        hasPermission,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
} 