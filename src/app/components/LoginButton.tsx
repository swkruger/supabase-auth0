"use client";

import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

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
      <Button disabled variant="outline" size="sm">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading
      </Button>
    );
  }
  
  // Show a generic error message instead of exposing error details
  if (error) {
    return (
      <Button 
        onClick={() => router.refresh()}
        variant="destructive"
        size="sm"
      >
        Try Again
      </Button>
    );
  }
  
  if (user) {
    return (
      <Button 
        asChild
        variant="destructive"
        size="sm"
      >
        <a href="/api/auth/logout">Logout</a>
      </Button>
    );
  }
  
  return (
    <Button 
      asChild
      variant="default"
      size="sm"
    >
      <a href="/api/auth/login">Login</a>
    </Button>
  );
} 