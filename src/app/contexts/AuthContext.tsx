"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

// Mock user type
export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

// Authentication context type
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
};

// Mock user data
const MOCK_USER: User = {
  id: "user-1",
  name: "John Doe",
  email: "john@example.com",
  avatar: "https://api.dicebear.com/7.x/initials/svg?seed=JD",
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check if user is authenticated
  useEffect(() => {
    // Simulate loading auth state
    const timer = setTimeout(() => {
      // Get auth from localStorage (for mock purposes)
      const storedUser = localStorage.getItem("mockUser");
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      
      setIsLoading(false);
    }, 1000); // 1 second delay to simulate auth loading
    
    return () => clearTimeout(timer);
  }, []);

  // Redirect authenticated users from welcome page to todos
  useEffect(() => {
    if (!isLoading && user && pathname === "/") {
      router.push("/todos");
    }
  }, [isLoading, user, pathname, router]);

  // Login function
  const login = () => {
    setUser(MOCK_USER);
    localStorage.setItem("mockUser", JSON.stringify(MOCK_USER));
    router.push("/todos");
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("mockUser");
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
} 