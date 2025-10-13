"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserRole } from '@/models/User'
import { PERMISSIONS, hasPermission, getCurrentUserClient } from '@/lib/auth'

interface RoleGuardProps {
  children: React.ReactNode
  requiredPermission: keyof typeof PERMISSIONS
  fallback?: React.ReactNode
}

export default function RoleGuard({ 
  children, 
  requiredPermission,
  fallback = <AccessDenied />
}: RoleGuardProps) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)
  
  useEffect(() => {
    async function checkAuth() {
      try {
        const currentUser = await getCurrentUserClient()
        setUser(currentUser)

        const canAccess = hasPermission(currentUser, requiredPermission)
        setHasAccess(canAccess)
        
        if (!currentUser) {
          router.push('/admin')
        }
      } catch (error) {
        console.error('Authentication error:', error)
        router.push('/admin')
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [requiredPermission, router])
  
  if (loading) {
    return <LoadingState />
  }
  
  if (!hasAccess) {
    return fallback
  }
  
  return <>{children}</>
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-slate-600">Checking permissions...</p>
      </div>
    </div>
  )
}

function AccessDenied() {
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
            onClick={() => router.push('/admin/dashboard')}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
