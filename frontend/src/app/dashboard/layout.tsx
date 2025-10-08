"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Home, 
  ShoppingCart, 
  Package, 
  Users, 
  FileText, 
  Menu,
  X,
  ChevronsLeft,
  ChevronsRight,
  LogOut
} from "lucide-react";

interface User {
  username: string;
  role: string;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
}

const sidebarItems: SidebarItem[] = [
  { id: 'home', label: 'Home', icon: Home, path: '/dashboard' },
  { id: 'sales', label: 'Sales', icon: ShoppingCart, path: '/dashboard/sales' },
  { id: 'inventory', label: 'Inventory', icon: Package, path: '/dashboard/inventory' },
  { id: 'customers', label: 'Customers', icon: Users, path: '/dashboard/customers' },
  { id: 'reports', label: 'Reports', icon: FileText, path: '/dashboard/reports' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [activeItem, setActiveItem] = useState('inventory'); // Auto-navigate to inventory
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile slide-out
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // desktop collapse to icon rail
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/');
      return;
    }

    setUser(JSON.parse(userData));

    // Restore sidebar collapsed state
    try {
      const stored = localStorage.getItem('sidebarCollapsed');
      if (stored === 'true') setSidebarCollapsed(true);
    } catch {}
    
    // Auto-navigate to inventory as specified
    router.push('/dashboard/inventory');
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleNavigation = (item: SidebarItem) => {
    setActiveItem(item.id);
    router.push(item.path);
    setSidebarOpen(false);
  };

  const toggleCollapse = () => {
    setSidebarCollapsed(c => {
      const next = !c;
      try { localStorage.setItem('sidebarCollapsed', String(next)); } catch {}
      return next;
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gray-50 flex flamingo-bg">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar (desktop collapsible + mobile drawer) */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        transition-all duration-200 ease-in-out
        ${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg border-r border-gray-200 flex flex-col
      `}>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header (logo + collapse toggle) */}
          <div className={`border-b border-gray-200 flex items-center ${sidebarCollapsed ? 'justify-center px-2 py-4' : 'justify-between px-4 py-5'} shrink-0`}>
            <div className={`flex items-center ${sidebarCollapsed ? 'flex-col space-y-1' : 'space-x-3'}`}>
              <div className={`rounded-lg flex items-center justify-center bg-pink-100 ring-1 ring-pink-200 overflow-hidden ${sidebarCollapsed ? 'w-10 h-10' : 'w-10 h-10'}`}>
                <img src="/flamingo.svg" alt="Flamingo+" className="w-8 h-8" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 leading-tight">Flamingo+</h1>
                  <p className="text-[11px] text-pink-600 font-medium">POS System</p>
                </div>
              )}
            </div>
            {/* Collapse / close buttons */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:inline-flex h-8 w-8"
                onClick={toggleCollapse}
                title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {sidebarCollapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className={`flex-1 ${sidebarCollapsed ? 'px-2 py-3 space-y-2' : 'p-4 space-y-1'} overflow-y-auto`}>          
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  className={`
                    w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-3 rounded-lg text-left transition-colors group
                    ${isActive 
                      ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span className="font-medium truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* User info / logout */}
          <div className={`border-t border-gray-200 ${sidebarCollapsed ? 'p-2' : 'p-4'} shrink-0`}>            
            {sidebarCollapsed ? (
              <div className="flex items-center justify-center">
                <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[8rem]">{user.username}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Hamburger always visible (mobile opens drawer, desktop toggles collapse) */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (window.innerWidth < 1024) setSidebarOpen(true); else toggleCollapse();
                }}
                className="h-9 w-9"
                title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h2 className="text-xl font-semibold text-gray-900 capitalize">
                {sidebarItems.find(item => item.id === activeItem)?.label || 'Dashboard'}
              </h2>
            </div>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}