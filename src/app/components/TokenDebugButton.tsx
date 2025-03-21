"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";

export default function TokenDebugButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const debugToken = async () => {
    try {
      setLoading(true);
      setResult(null);
      
      const response = await fetch('/api/debug-token');
      const data = await response.json();
      
      setResult(data);
      console.log('Response from debug endpoint:', data);
    } catch (error) {
      console.error('Error debugging token:', error);
      setResult({ error: 'Failed to debug token' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button 
        onClick={debugToken} 
        disabled={loading}
        variant="outline"
      >
        {loading ? "Loading..." : "Debug Access Token"}
      </Button>
      
      {result && (
        <div className="p-4 mt-4 bg-gray-100 rounded-md overflow-auto max-h-[400px]">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
} 