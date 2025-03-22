"use client";

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { usePathname } from 'next/navigation';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { FileText, LayoutDashboard, Settings, Menu } from "lucide-react";

export function Sidebar() {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const { isOpen, setIsOpen } = useSidebar();
  
  // Don't render sidebar for unauthenticated users or loading state
  if (isLoading || !user) {
    return null;
  }
  
  // Navigation items with Lucide icons
  const navItems = [
    { href: '/todos', label: 'Todos', icon: <FileText className="h-5 w-5" /> },
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: '/settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> }
  ];
  
  const SidebarContent = () => (
    <div className="h-full py-6 pl-4 pr-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">FiFolio</h3>
        <p className="text-sm text-muted-foreground">Manage your tasks</p>
      </div>
      <Separator className="my-4" />
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          
          return (
            <Button
              key={item.href}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 px-3 font-normal",
                isActive && "font-medium"
              )}
              asChild
              onClick={() => setIsOpen(false)}
            >
              <Link href={item.href}>
                {item.icon}
                {item.label}
              </Link>
            </Button>
          );
        })}
      </nav>
    </div>
  );
  
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 border-r bg-background">
        <ScrollArea className="h-full">
          <SidebarContent />
        </ScrollArea>
      </aside>
      
      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="p-0">
          <ScrollArea className="h-full">
            <SidebarContent />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
} 