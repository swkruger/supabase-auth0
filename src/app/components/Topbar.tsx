"use client";

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import LoginButton from './LoginButton';

export function Topbar() {
  const { user, isLoading } = useAuth();
  
  return (
    <header className="bg-white border-b h-16 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center">
        <Link href="/" className="text-xl font-bold">
          FiFolio
        </Link>
        {!isLoading && user && (
          <nav className="ml-8 hidden md:flex items-center space-x-6">
            <Link href="/todos" className="text-gray-600 hover:text-black">
              Todos
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-black">
              Dashboard
            </Link>
            <Link href="/settings" className="text-gray-600 hover:text-black">
              Settings
            </Link>
          </nav>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        {!isLoading && user && (
          <div className="flex items-center space-x-2">
            <span className="text-sm hidden sm:inline">{user.name}</span>
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-8 h-8 rounded-full"
            />
          </div>
        )}
        <LoginButton />
      </div>
    </header>
  );
} 