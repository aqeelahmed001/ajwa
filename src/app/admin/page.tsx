"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'
import { signIn, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Loader2 } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'loading') {
      // Session is still loading, wait
      console.log('Session is loading...')
      return
    }
    
    if (session && status === 'authenticated') {
      console.log('Session detected, redirecting to dashboard')
      console.log('Session data:', session)
      
      // Redirect to dashboard
      router.replace('/admin/dashboard')
    }
  }, [session, status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      console.log('Attempting login with:', email)
      
      // Use NextAuth.js signIn method
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      console.log('SignIn result:', result)

      if (result?.error) {
        console.error('Login error:', result.error)
        throw new Error(result.error || 'Authentication failed')
      }

      // If login successful, redirect to dashboard
      if (result?.ok) {
        console.log('Login successful, redirecting to dashboard')
        
        // Redirect to dashboard - router.replace prevents going back to login page
        router.replace('/admin/dashboard')
      } else {
        console.error('Login failed but no error was returned')
        throw new Error('Authentication failed')
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Failed to login. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md p-4">
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <Logo width={150} height={60} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Portal</h1>
          <p className="text-slate-600">Login to manage your website content</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-slate-500">
            Protected area. Unauthorized access is prohibited.
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
