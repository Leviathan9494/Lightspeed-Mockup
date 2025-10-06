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
  X
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        transition-transform duration-200 ease-in-out
        w-64 bg-white shadow-lg border-r border-gray-200
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">LS</span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">Lightspeed</h1>
                  <p className="text-xs text-gray-500">POS System</p>
                </div>
              </div>
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
          <nav className="flex-1 p-4 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors
                    ${isActive 
                      ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{user.username}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
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