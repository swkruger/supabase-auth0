"use client";

import { useUser } from '@auth0/nextjs-auth0/client';

export default function LoginButton() {
  const { user, error, isLoading } = useUser();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  if (user) {
    return (
      <a 
        href="/api/auth/logout"
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
      >
        Logout
      </a>
    );
  }
  
  return (
    <a 
      href="/api/auth/login"
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
    >
      Login
    </a>
  );
} 