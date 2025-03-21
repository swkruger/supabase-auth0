"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Define types for our dashboard data
interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  recentActivity: Array<{
    id: string;
    title: string;
    completed: boolean;
    created_at: string;
    updated_at: string;
  }>;
}

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Protect this page
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);
  
  // Fetch dashboard stats
  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!isAuthenticated) return;
      
      try {
        setIsLoadingStats(true);
        const response = await fetch('/api/dashboard/stats');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch dashboard stats');
        }
        
        const data = await response.json();
        setStats(data.stats);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError((err as Error).message);
      } finally {
        setIsLoadingStats(false);
      }
    };
    
    fetchDashboardStats();
  }, [isAuthenticated]);
  
  if (isLoading || isLoadingStats) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }
  
  if (error) {
    return (
      <div className="max-w-5xl mx-auto w-full">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
          <p>Error loading dashboard data: {error}</p>
        </div>
      </div>
    );
  }
  
  // Format date for recent activity
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };
  
  return (
    <div className="max-w-5xl mx-auto w-full">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CardDescription>Your task overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalTasks || 0}</div>
            <p className="text-xs text-muted-foreground">
              Your total active tasks
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CardDescription>Tasks finished</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completedTasks || 0}</div>
            <p className="text-xs text-muted-foreground">
              Tasks you've completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CardDescription>Tasks completed vs. total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completionRate || 0}%</div>
            <p className="text-xs text-muted-foreground">
              Your productivity rate
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent task activities</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.recentActivity && stats.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {stats.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${activity.completed ? 'bg-green-500' : 'bg-blue-500'} mr-2`}></div>
                    <div>
                      <p className="text-sm font-medium">
                        {activity.completed ? 'Completed' : 'Added'} "{activity.title}"
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(activity.updated_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent activity</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 