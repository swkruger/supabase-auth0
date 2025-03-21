"use client";

import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginButton() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  
  // Handle authentication errors properly
  useEffect(() => {
    if (error) {
      // Log the error for debugging but don't show to users
      console.error('Authentication error:', error);
      
      // Could redirect to error page for serious errors
      // router.push('/unauthorized?authError=true');
    }
  }, [error, router]);
  
  if (isLoading) {
    return (
      <button 
        disabled
        className="bg-gray-400 text-white px-4 py-2 rounded text-sm cursor-not-allowed"
      >
        <span className="inline-block animate-pulse">Loading...</span>
      </button>
    );
  }
  
  // Show a generic error message instead of exposing error details
  if (error) {
    return (
      <button 
        onClick={() => router.refresh()}
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded text-sm"
      >
        Try Again
      </button>
    );
  }
  
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