"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    console.log('Login attempt for:', email);

    try {
      console.log('Sending login request to /api/auth/login');
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include' // Important: include cookies in the request
      });

      console.log('Login response status:', response.status);
      const data = await response.json();
      console.log('Login response data:', data);

      if (!response.ok) {
        console.error('Login failed:', data.error);
        setError(data.error || 'Login failed');
        setIsLoading(false);
        return false;
      }

      console.log('Login successful, user data:', data.user);
      setUser(data.user);
      setIsLoading(false);
      
      // Check if cookies were set
      console.log('Document cookies after login:', document.cookie);
      
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login');
      setIsLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    setIsLoading(true);

    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/admin');
    } catch (err) {
      setError('An error occurred during logout');
    } finally {
      setIsLoading(false);
    }
  };

  // Check authentication status
  const checkAuth = async (): Promise<boolean> => {
    setIsLoading(true);
    console.log('Checking authentication status...');
    console.log('Current cookies:', document.cookie);

    try {
      console.log('Sending request to /api/auth/me');
      const response = await fetch('/api/auth/me', {
        credentials: 'include' // Important: include cookies in the request
      });
      
      console.log('Auth check response status:', response.status);
      
      if (!response.ok) {
        console.log('Auth check failed, not authenticated');
        setUser(null);
        setIsLoading(false);
        return false;
      }

      const data = await response.json();
      console.log('Auth check response data:', data);
      
      if (data.user) {
        console.log('User is authenticated:', data.user);
        setUser(data.user);
        setIsLoading(false);
        return true;
      } else {
        console.log('No user data in response');
        setUser(null);
        setIsLoading(false);
        return false;
      }
    } catch (err) {
      console.error('Auth check error:', err);
      setUser(null);
      setIsLoading(false);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
