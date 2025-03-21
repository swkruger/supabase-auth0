"use client";

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  
  // Don't render sidebar for unauthenticated users or loading state
  if (isLoading || !user) {
    return null;
  }
  
  // Navigation items
  const navItems = [
    { href: '/todos', label: 'Todos', icon: '📝' },
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/settings', label: 'Settings', icon: '⚙️' }
  ];
  
  return (
    <aside className="w-64 bg-gray-50 border-r hidden md:block">
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center rounded-md p-2 text-sm ${
                    isActive 
                      ? 'bg-gray-200 text-black font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
} 