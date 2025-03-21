"use client";

import { useAuth } from "@/app/contexts/AuthContext";

export default function UserPermissionsDisplay() {
  const { user } = useAuth();
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium mb-2">User Authorization</h3>
      
      <div className="mb-4">
        <h4 className="font-medium">Roles:</h4>
        {user.roles && user.roles.length > 0 ? (
          <ul className="list-disc pl-5">
            {user.roles.map((role, index) => (
              <li key={index} className="text-sm">{role}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 italic">No roles assigned</p>
        )}
      </div>
      
      <div>
        <h4 className="font-medium">Permissions:</h4>
        {user.permissions && user.permissions.length > 0 ? (
          <ul className="list-disc pl-5">
            {user.permissions.map((permission, index) => (
              <li key={index} className="text-sm">{permission}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 italic">No permissions assigned</p>
        )}
      </div>
    </div>
  );
} 