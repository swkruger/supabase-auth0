"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();
  
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
          <h1 className="mt-6 text-4xl font-extrabold">Access Denied</h1>
          <p className="mt-2 text-xl">You don't have permission to access this page</p>
        </div>
        <div className="mt-8 space-y-4">
          <p className="text-lg">
            It looks like you don't have the necessary permissions to view this resource.
            Please contact an administrator if you believe this is a mistake.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button 
              size="lg" 
              className="w-full"
              onClick={() => router.push("/todos")}
            >
              Go to My Tasks
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 