"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPinStep, setShowPinStep] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.requiresPin) {
          // Show PIN step
          setSessionId(data.sessionId);
          setShowPinStep(true);
        } else {
          // Direct login success
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          router.push('/dashboard');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch {
      setError('Connection error. Please ensure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/auth/pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId, pin }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        setError(data.message || 'Invalid PIN');
      }
    } catch {
      setError('Connection error. Please ensure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePinSubmit(e as any);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">LS</span>
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Lightspeed Mockapp</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the inventory system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showPinStep ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
              <div className="text-sm text-gray-600 text-center mt-4">
                Demo credentials: admin / password
              </div>
            </form>
          ) : (
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div className="text-center mb-4">
                <div className="text-sm text-gray-600">
                  Additional authorization required
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Please enter your 4-digit PIN
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pin">Employee PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  placeholder="Enter 4-digit PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.slice(0, 4))}
                  onKeyPress={handlePinKeyPress}
                  maxLength={4}
                  className="text-center text-lg tracking-widest"
                  required
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || pin.length !== 4}
              >
                {isLoading ? 'Verifying...' : 'Login'}
              </Button>
              <div className="text-sm text-gray-600 text-center mt-4">
                Demo PIN: 1234
              </div>
              <Button 
                type="button" 
                variant="outline"
                className="w-full" 
                onClick={() => {
                  setShowPinStep(false);
                  setPin('');
                  setError('');
                }}
              >
                Back to Login
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
