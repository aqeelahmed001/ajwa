"use client"

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

// Define permissions mapping
const PERMISSIONS_MAP = {
  // Dashboard
  viewDashboard: ['admin', 'editor', 'viewer'],
  
  // Content management
  viewContent: ['admin', 'editor', 'viewer'],
  createContent: ['admin', 'editor'],
  editContent: ['admin', 'editor'],
  deleteContent: ['admin'],
  publishContent: ['admin', 'editor'],
  
  // User management
  viewUsers: ['admin'],
  createUsers: ['admin'],
  editUsers: ['admin'],
  deleteUsers: ['admin'],
  
  // Settings
  viewSettings: ['admin'],
  editSettings: ['admin'],
};

// Loading state component
const LoadingState = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
      <p className="mt-4 text-slate-600">Checking permissions...</p>
    </div>
  </div>
)

// Access denied component
const AccessDeniedComponent = () => {
  const router = useRouter()
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="max-w-md p-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-slate-600 mb-6">
          You don't have permission to access this page.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300 transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={() => router.push('/admin')}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  )
}

// Main RoleGuard component
export default function RoleGuard({ 
  children, 
  requiredPermission,
  fallback = <AccessDeniedComponent />
}: {
  children: React.ReactNode
  requiredPermission: string
  fallback?: React.ReactNode
}) {
  const router = useRouter()
  const { data: session, status } = useSession()
  
  // Function to check if user has permission
  const checkPermission = (user: any, permission: string): boolean => {
    if (!user || !user.role) return false;
    
    // If permission doesn't exist in map, deny access
    if (!PERMISSIONS_MAP[permission as keyof typeof PERMISSIONS_MAP]) {
      console.warn(`Permission '${permission}' not found in permissions map`);
      return false;
    }
    
    // Check if user's role is allowed for this permission
    return PERMISSIONS_MAP[permission as keyof typeof PERMISSIONS_MAP].includes(user.role);
  };
  
  // Check if user is authenticated and has required permission
  const isAuthenticated = status === 'authenticated' && session?.user;
  console.log('RoleGuard - Authentication status:', status);
  console.log('RoleGuard - Session:', session);
  console.log('RoleGuard - isAuthenticated:', isAuthenticated);
  
  // For dashboard access, be more lenient with permissions
  let hasAccess = false;
  if (isAuthenticated) {
    if (requiredPermission === 'viewDashboard') {
      // For dashboard, allow any authenticated user with any role
      hasAccess = true;
      console.log('RoleGuard - Allowing dashboard access to authenticated user');
    } else {
      // For other permissions, check normally
      hasAccess = checkPermission(session?.user, requiredPermission);
    }
  }
  
  console.log('RoleGuard - requiredPermission:', requiredPermission);
  console.log('RoleGuard - hasAccess:', hasAccess);
  
  // Debug session user role
  if (session?.user) {
    console.log('RoleGuard - User role:', session.user.role);
  }
  
  useEffect(() => {
    // If not authenticated and not loading, redirect to login
    if (status === 'unauthenticated') {
      console.log('RoleGuard - User is unauthenticated, redirecting to login');
      // Use replace instead of push to prevent back navigation to protected page
      router.replace('/admin');
    }
  }, [status, router]);
  
  // Don't redirect while loading
  if (status === 'loading') {
    console.log('RoleGuard - Session is loading, showing loading state');
    return <LoadingState />;
  }
  
  // Show access denied if not authorized
  if (!hasAccess) {
    return fallback;
  }
  
  // User is authorized, show content
  return <>{children}</>;
}
