"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DirectLoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleDirectAccess = () => {
    setIsLoading(true)
    // In development mode, the middleware will allow direct access
    router.push('/admin/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Development Direct Access</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-amber-600 font-bold">
              This is a development-only page that bypasses authentication.
            </p>
            <p>
              Use this page to directly access the admin dashboard during development.
              This page should be removed in production.
            </p>
            <Button 
              onClick={handleDirectAccess} 
              className="w-full bg-amber-500 hover:bg-amber-600"
              disabled={isLoading}
            >
              {isLoading ? 'Accessing...' : 'Access Admin Dashboard'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
