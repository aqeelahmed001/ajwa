"use client"

import React, { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

export default function AdminLayoutShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Check authentication status
  useEffect(() => {
    // Skip auth check for login page
    if (pathname === '/admin' || pathname === '/admin/setup') {
      return
    }

    // If not authenticated and not loading, redirect to login
    if (!isLoading && !user) {
      console.log('No user found in AdminLayoutShell, redirecting to login')
      // Use router for a smoother redirect
      router.push('/admin')
    }
  }, [pathname, user, isLoading, router])

  const toggleSidebar = () => {
    setSidebarOpen((open) => !open)
  }

  // For the login page (/admin) and setup page (/admin/setup) we render the page content without the admin shell
  if (pathname === '/admin' || pathname === '/admin/setup') {
    return <>{children}</>
  }
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  // If not authenticated, don't render anything (will redirect in useEffect)
  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-[#F9F5F0] dark:bg-[#2A1506]">
      <div className={`fixed inset-y-0 z-50 md:relative md:flex ${sidebarOpen ? 'flex' : 'hidden'}`}>
        <AdminSidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
