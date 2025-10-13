"use client"

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

export default function AdminLayoutShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen((open) => !open)
  }

  // For the login page (/admin) we render the page content without the admin shell
  if (pathname === '/admin') {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
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
