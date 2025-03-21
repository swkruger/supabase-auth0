"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export default function DebugPage() {
  const { user, isLoading } = useAuth();
  const [supabaseStatus, setSupabaseStatus] = useState<string>("Checking...");
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [errorDetails, setErrorDetails] = useState<string>("");
  
  useEffect(() => {
    const checkSupabase = async () => {
      try {
        // Test simple Supabase connection
        const { data, error } = await supabase.from("users").select("count").limit(1);
        
        if (error) {
          setSupabaseStatus(`Error: ${error.message}`);
          setErrorDetails(JSON.stringify(error, null, 2));
          return;
        }
        
        setSupabaseStatus("Connected successfully!");
        
        // If user is logged in, try to fetch their record
        if (user) {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("auth0_id", user.id)
            .limit(1);
            
          if (userError) {
            setErrorDetails(JSON.stringify(userError, null, 2));
          } else {
            setSupabaseUser(userData);
          }
        }
      } catch (error) {
        setSupabaseStatus(`Exception: ${(error as Error).message}`);
        setErrorDetails(JSON.stringify(error, null, 2));
      }
    };
    
    checkSupabase();
  }, [user]);
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Debug Information</h1>
      
      <div className="space-y-6">
        <div className="p-4 border rounded-md">
          <h2 className="text-xl font-semibold mb-2">Supabase Connection</h2>
          <p className="mb-2">Status: <span className={supabaseStatus.includes("Error") ? "text-red-500" : "text-green-500"}>{supabaseStatus}</span></p>
          <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
        </div>
        
        <div className="p-4 border rounded-md">
          <h2 className="text-xl font-semibold mb-2">Auth0 User</h2>
          {isLoading ? (
            <p>Loading user information...</p>
          ) : user ? (
            <div>
              <p>ID: {user.id}</p>
              <p>Email: {user.email}</p>
              <p>Name: {user.name}</p>
              <p>Roles: {user.roles.join(", ")}</p>
            </div>
          ) : (
            <p>Not logged in</p>
          )}
        </div>
        
        <div className="p-4 border rounded-md">
          <h2 className="text-xl font-semibold mb-2">Supabase User</h2>
          {supabaseUser ? (
            <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-40">
              {JSON.stringify(supabaseUser, null, 2)}
            </pre>
          ) : (
            <p>No Supabase user found</p>
          )}
        </div>
        
        {errorDetails && (
          <div className="p-4 border rounded-md border-red-300">
            <h2 className="text-xl font-semibold mb-2 text-red-500">Error Details</h2>
            <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-60 text-red-500">
              {errorDetails}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 