"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const { user, isAuthenticated, isLoading, logout, isAdmin, hasPermission } = useAuth();
  const router = useRouter();
  
  // Protect this page
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);
  
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!isAuthenticated || !user) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="max-w-3xl mx-auto w-full">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input id="name" defaultValue={user.name} readOnly />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input id="email" defaultValue={user.email} readOnly />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Save Changes</Button>
        </CardFooter>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  Delete your account and all your data
                </p>
              </div>
              <Button variant="destructive">Delete Account</Button>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Log out</p>
                <p className="text-sm text-muted-foreground">
                  Log out from all devices
                </p>
              </div>
              <Button onClick={logout} variant="outline">Log out</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Permissions</CardTitle>
          <CardDescription>Your user roles and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Admin Status</h3>
              {isAdmin ? (
                <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-3 py-1 rounded-full text-sm">
                  Admin
                </div>
              ) : (
                <div className="bg-muted px-3 py-1 rounded-full text-sm">
                  Regular User
                </div>
              )}
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium mb-2">Roles</h3>
              <div className="flex flex-wrap gap-2">
                {user.roles && user.roles.length > 0 ? (
                  user.roles.map((role, index) => (
                    <div key={index} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                      {role}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No roles assigned</p>
                )}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium mb-2">Permissions</h3>
              <div className="flex flex-wrap gap-2">
                {user.permissions && user.permissions.length > 0 ? (
                  user.permissions.map((permission, index) => (
                    <div key={index} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                      {permission}
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col space-y-2 w-full">
                    <p className="text-sm text-muted-foreground">Your token includes these default Auth0 permissions:</p>
                    <div className="flex flex-wrap gap-2">
                      <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">read:email</div>
                      <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">read:profile</div>
                      <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">read:openid</div>
                      <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">read:roles</div>
                      <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">read:user_idp_tokens</div>
                      <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">read:offline_access</div>
                    </div>
                    <div className="mt-4 p-3 border rounded-md bg-muted/20">
                      <h4 className="text-sm font-medium mb-1">What these permissions do:</h4>
                      <ul className="text-xs space-y-1 list-disc pl-4">
                        <li><span className="font-medium">read:email</span> - Access your email address</li>
                        <li><span className="font-medium">read:profile</span> - Read your user profile information</li>
                        <li><span className="font-medium">read:openid</span> - Standard OpenID Connect permission</li>
                        <li><span className="font-medium">read:roles</span> - Access your assigned roles</li>
                        <li><span className="font-medium">read:user_idp_tokens</span> - Read identity provider access tokens</li>
                        <li><span className="font-medium">read:offline_access</span> - Get refresh tokens for longer sessions</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium mb-2">Todo App Permissions</h3>
              <p className="text-sm text-muted-foreground mb-2">
                These permissions are derived from your roles
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">read:todos</span>
                  {hasPermission('read:todos') ? (
                    <div className="h-4 w-4 rounded-full bg-green-500"></div>
                  ) : (
                    <div className="h-4 w-4 rounded-full bg-red-500"></div>
                  )}
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">create:todos</span>
                  {hasPermission('create:todos') ? (
                    <div className="h-4 w-4 rounded-full bg-green-500"></div>
                  ) : (
                    <div className="h-4 w-4 rounded-full bg-red-500"></div>
                  )}
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">update:todos</span>
                  {hasPermission('update:todos') ? (
                    <div className="h-4 w-4 rounded-full bg-green-500"></div>
                  ) : (
                    <div className="h-4 w-4 rounded-full bg-red-500"></div>
                  )}
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">delete:todos</span>
                  {hasPermission('delete:todos') ? (
                    <div className="h-4 w-4 rounded-full bg-green-500"></div>
                  ) : (
                    <div className="h-4 w-4 rounded-full bg-red-500"></div>
                  )}
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium mb-2">Permission Checks</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Permissions status according to the application's hasPermission function
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">read:todos</span>
                  {hasPermission('read:todos') ? (
                    <div className="h-4 w-4 rounded-full bg-green-500"></div>
                  ) : (
                    <div className="h-4 w-4 rounded-full bg-red-500"></div>
                  )}
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">create:todos</span>
                  {hasPermission('create:todos') ? (
                    <div className="h-4 w-4 rounded-full bg-green-500"></div>
                  ) : (
                    <div className="h-4 w-4 rounded-full bg-red-500"></div>
                  )}
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">update:todos</span>
                  {hasPermission('update:todos') ? (
                    <div className="h-4 w-4 rounded-full bg-green-500"></div>
                  ) : (
                    <div className="h-4 w-4 rounded-full bg-red-500"></div>
                  )}
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">delete:todos</span>
                  {hasPermission('delete:todos') ? (
                    <div className="h-4 w-4 rounded-full bg-green-500"></div>
                  ) : (
                    <div className="h-4 w-4 rounded-full bg-red-500"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Notification settings are not available in the demo version.
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 