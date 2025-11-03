"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react'

export default function AdminSetupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [setupData, setSetupData] = useState<any>(null)

  const handleSetup = async () => {
    setIsLoading(true)
    setError('')
    setSuccess('')
    setSetupData(null)

    try {
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Setup failed')
      }

      setSuccess('Setup completed successfully!')
      setSetupData(data)
    } catch (err: any) {
      setError(err.message || 'Failed to complete setup. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md p-4">
        <Card>
          <CardHeader>
            <CardTitle>Admin Setup</CardTitle>
            <CardDescription>
              Initialize the admin user and roles in the database
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="mb-4 bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </Alert>
            )}
            
            {setupData && (
              <div className="mt-4 p-4 bg-slate-50 rounded-md text-sm">
                <h3 className="font-medium mb-2">Setup Results:</h3>
                <pre className="whitespace-pre-wrap overflow-auto max-h-40">
                  {JSON.stringify(setupData, null, 2)}
                </pre>
              </div>
            )}
            
            <p className="text-slate-600 mb-4">
              This will create the initial admin user and roles in the database using the values from your environment variables.
              Only run this once when setting up the application.
            </p>
            
            <div className="flex justify-center">
              <Button 
                onClick={handleSetup} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  'Initialize Admin User'
                )}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => router.push('/admin')}
              disabled={isLoading}
            >
              Back to Login
            </Button>
            
            {success && (
              <Button 
                onClick={() => router.push('/admin')}
              >
                Go to Login
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
