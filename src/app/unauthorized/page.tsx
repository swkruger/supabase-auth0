"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Error types we support (without exposing sensitive details)
type ErrorType = 'auth' | 'permission' | 'session' | 'token' | 'generic';

export default function UnauthorizedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorType, setErrorType] = useState<ErrorType>('generic');
  const [errorId, setErrorId] = useState<string | null>(null);
  
  useEffect(() => {
    // Parse the error type from search params
    const authError = searchParams.get('authError') === 'true';
    const permissionError = searchParams.get('permissionError') === 'true';
    const sessionError = searchParams.get('sessionError') === 'true';
    const tokenError = searchParams.get('tokenError') === 'true';
    
    // Get error ID for support reference (but don't show details to user)
    const errorIdParam = searchParams.get('errorId');
    if (errorIdParam) {
      setErrorId(errorIdParam);
    }
    
    // Determine error type but don't expose sensitive information
    if (authError) {
      setErrorType('auth');
    } else if (sessionError) {
      setErrorType('session');
    } else if (tokenError) {
      setErrorType('token');
    } else if (permissionError) {
      setErrorType('permission');
    } else {
      setErrorType('generic');
    }
    
    // Log for monitoring/debugging
    if (errorIdParam) {
      console.error(`Security error occurred: ${errorType}, ID: ${errorIdParam}`);
    }
  }, [searchParams, errorType]);
  
  // Error messages per type (user-friendly, no sensitive info)
  const getErrorTitle = () => {
    switch (errorType) {
      case 'auth':
        return 'Authentication Error';
      case 'permission':
        return 'Access Denied';
      case 'session':
        return 'Session Expired';
      case 'token':
        return 'Authentication Required';
      default:
        return 'Access Error';
    }
  };
  
  const getErrorDescription = () => {
    switch (errorType) {
      case 'auth':
        return 'There was a problem with your authentication';
      case 'permission':
        return 'You don\'t have permission to access this page';
      case 'session':
        return 'Your session has expired';
      case 'token':
        return 'Please sign in to access this resource';
      default:
        return 'There was a problem accessing this resource';
    }
  };
  
  const getErrorMessage = () => {
    switch (errorType) {
      case 'auth':
        return 'We encountered an issue while trying to authenticate you. Please try again or contact support if the problem persists.';
      case 'permission':
        return 'It looks like you don\'t have the necessary permissions to view this resource. Please contact an administrator if you believe this is a mistake.';
      case 'session':
        return 'Your login session has expired. Please sign in again to continue.';
      case 'token':
        return 'Your authentication token is invalid or has expired. Please sign in again.';
      default:
        return 'We encountered an issue while processing your request. Please try again or contact support if the problem persists.';
    }
  };
  
  const getPrimaryAction = () => {
    switch (errorType) {
      case 'auth':
      case 'session':
      case 'token':
        return {
          label: 'Sign In Again',
          action: () => router.push("/api/auth/login")
        };
      case 'permission':
        return {
          label: 'Go to My Tasks',
          action: () => router.push("/todos")
        };
      default:
        return {
          label: 'Try Again',
          action: () => router.push("/")
        };
    }
  };
  
  const primaryAction = getPrimaryAction();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-20 h-20 mx-auto text-destructive"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          <h1 className="mt-6 text-4xl font-extrabold">
            {getErrorTitle()}
          </h1>
          <p className="mt-2 text-xl">
            {getErrorDescription()}
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <p className="text-lg">
            {getErrorMessage()}
          </p>
          
          {errorId && (
            <p className="text-sm text-gray-600 mt-2">
              Error reference: {errorId}
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button 
              size="lg" 
              className="w-full"
              onClick={primaryAction.action}
            >
              {primaryAction.label}
            </Button>
            <Button 
              variant="outline"
              size="lg" 
              className="w-full"
              onClick={() => router.push("/")}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 