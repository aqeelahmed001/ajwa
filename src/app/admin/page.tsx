"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminLoginPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, error: authError, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [cookiesEnabled, setCookiesEnabled] = useState<boolean | null>(null)
  const [cookieCheckMessage, setCookieCheckMessage] = useState('')
  
  // Check for error in URL parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const errorParam = searchParams.get('error')
    
    if (errorParam) {
      console.log('Error from URL:', errorParam)
      let errorMessage = 'Authentication failed'
      
      // Map error codes to user-friendly messages
      switch (errorParam) {
        case 'CredentialsSignin':
          errorMessage = 'Invalid email or password'
          break
        case 'SessionRequired':
          errorMessage = 'Please sign in to access this page'
          break
        case 'AccessDenied':
          errorMessage = 'You do not have permission to access this page'
          break
        // Add more error cases as needed
      }
      
      setError(errorMessage)
      
      // Clear the error from the URL to prevent showing it again on refresh
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])
  
  // Check if cookies are enabled
  const checkCookies = useCallback(() => {
    try {
      // Try to set a test cookie
      document.cookie = 'cookietest=1; SameSite=Lax; path=/';
      const cookieEnabled = document.cookie.indexOf('cookietest=') !== -1;
      
      // Clean up the test cookie
      document.cookie = 'cookietest=1; SameSite=Lax; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      
      setCookiesEnabled(cookieEnabled);
      
      if (!cookieEnabled) {
        setCookieCheckMessage('Cookies are disabled in your browser. Please enable cookies to log in.');
      } else {
        // Check for third-party cookie blocking
        const cookies = document.cookie.split(';').map(c => c.trim());
        setCookieCheckMessage(`Available cookies: ${cookies.length > 0 ? cookies.join(', ') : 'None'}`);  
      }
      
      return cookieEnabled;
    } catch (e) {
      console.error('Error checking cookies:', e);
      setCookiesEnabled(false);
      setCookieCheckMessage('Error checking cookie settings: ' + (e instanceof Error ? e.message : String(e)));
      return false;
    }
  }, []);
  
  // Run cookie check on mount
  useEffect(() => {
    checkCookies();
  }, [checkCookies]);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      setIsRedirecting(true)
      router.push('/admin/dashboard')
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    // Check if cookies are enabled before attempting login
    if (!checkCookies()) {
      setError('Cookies must be enabled to log in')
      setIsLoading(false)
      return
    }

    try {
      console.log('Attempting login with credentials:', { email })
      
      const success = await login(email, password)
      
      if (success) {
        console.log('Login successful, redirecting to dashboard')
        // The redirect will happen automatically via the useEffect hook
        // that watches for the user state
        return
      } else {
        // If login returns false, there was an error (handled by the auth context)
        setError(authError || 'Invalid email or password')
        setIsLoading(false)
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setError('Login failed. Please try again.')
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
                    name="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
                <input type="hidden" name="callbackUrl" value="/admin/dashboard" />
                <Button type="submit" className="w-full" disabled={isLoading || isRedirecting}>
                  {isLoading || isRedirecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isRedirecting ? 'Redirecting...' : 'Logging in...'}
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center justify-center text-sm text-slate-500">
            <p>Protected area. Unauthorized access is prohibited.</p>
            <p className="mt-2 text-xs bg-slate-100 p-2 rounded">
              <strong>Test Credentials:</strong> admin@example.com / password
            </p>
            
            {/* Debug section */}
            <div className="mt-4 p-3 bg-yellow-50 rounded text-left w-full">
              <h3 className="font-bold mb-2">Debug Info:</h3>
              <p><strong>Auth Status:</strong> {user ? 'authenticated' : 'unauthenticated'}</p>
              <p><strong>User:</strong> {user ? 'Yes' : 'No'}</p>
              <p><strong>Loading:</strong> {isLoading || authLoading ? 'Yes' : 'No'}</p>
              <p><strong>Redirecting:</strong> {isRedirecting ? 'Yes' : 'No'}</p>
              <p><strong>Has Error:</strong> {error || authError ? 'Yes: ' + (error || authError) : 'No'}</p>
              <p><strong>Cookies Enabled:</strong> {cookiesEnabled === null ? 'Checking...' : cookiesEnabled ? 'Yes' : 'No'}</p>
              <p><strong>Cookie Status:</strong> {cookieCheckMessage}</p>
              <button 
                onClick={checkCookies} 
                className="mt-2 text-xs bg-slate-200 px-2 py-1 rounded"
                type="button"
              >
                Check Cookies Again
              </button>
              {user && (
                <div className="mt-2">
                  <p><strong>User Email:</strong> {user.email}</p>
                  <p><strong>Role:</strong> {user.role || 'N/A'}</p>
                  <p><strong>User ID:</strong> {user.id || 'N/A'}</p>
                </div>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
