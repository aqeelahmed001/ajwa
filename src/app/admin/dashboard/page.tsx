"use client"

import { Suspense } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DashboardProvider } from '@/components/admin/dashboard/DashboardProvider'
import { Skeleton } from '@/components/ui/skeleton'
import Logo from '@/components/Logo'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useAuth } from '@/lib/auth-context'

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AdminDashboardPage() {
  // Add user information for debugging
  const { user, isLoading } = useAuth()
  
  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Image 
            src="/images/logo.jpg"
            alt="Ajwa Logo"
            width={160}
            height={100}
            className="rounded-lg"
            style={{ background: 'none' }}
          />
        </div>
      </div>
      
      {/* Debug information */}
      {/* <Card className="mb-4 bg-yellow-50">
        <CardHeader>
          <h2 className="text-lg font-semibold">Debug Information</h2>
        </CardHeader>
        <CardContent>
          <p><strong>Auth Status:</strong> {isLoading ? 'loading' : user ? 'authenticated' : 'unauthenticated'}</p>
          <p><strong>User:</strong> {user?.email || 'Not logged in'}</p>
          <p><strong>Role:</strong> {user?.role || 'None'}</p>
        </CardContent>
      </Card> */}
      
      <Suspense fallback={<LoadingState />}>
        <DashboardProvider />
      </Suspense>
    </div>
  )
}
