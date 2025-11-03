"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, BarChart3, ArrowRight, Info } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image'

export default function AnalyticsPage() {
  const [googleAnalyticsUrl, setGoogleAnalyticsUrl] = useState('https://analytics.google.com/analytics/web/')
  
  const handleRedirect = () => {
    window.open(googleAnalyticsUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics</h1>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-500" />
        <AlertTitle className="text-blue-700">Information</AlertTitle>
        <AlertDescription className="text-blue-600">
          Analytics for this website are managed through Google Analytics. 
          Use the button below to access your Google Analytics dashboard.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="instructions">Instructions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Google Analytics Integration
              </CardTitle>
              <CardDescription>
                Access comprehensive analytics data for your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-muted/30">
                <div className="relative h-16 w-64 mb-6">
                  <Image 
                    src="/images/google1.jpg"
                    alt="Google Analytics Logo"
                    fill
                    style={{ objectFit: 'contain' }}
                    onError={() => {
                      // Fallback if image doesn't exist
                      const element = document.getElementById('ga-logo')
                      if (element) {
                        element.innerHTML = 'Google Analytics'
                      }
                    }}
                  />
                  <div id="ga-logo" className="text-xl font-bold text-center"></div>
                </div>
                
                <p className="text-center mb-6 text-muted-foreground">
                  Your website's analytics are managed through Google Analytics, 
                  providing you with detailed insights about your visitors, traffic sources, 
                  user behavior, and more.
                </p>
                
                <Button 
                  size="lg" 
                  className="gap-2"
                  onClick={handleRedirect}
                >
                  Open Google Analytics Dashboard
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Real-time Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      Monitor active users and their actions as they happen
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Audience Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      Understand your visitors' demographics and interests
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      Track page load times and user experience metrics
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={handleRedirect}
              >
                Go to Google Analytics <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="instructions">
          <Card>
            <CardHeader>
              <CardTitle>How to Use Google Analytics</CardTitle>
              <CardDescription>
                Quick guide to accessing and using your analytics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">1. Accessing Your Dashboard</h3>
                <p className="text-sm text-muted-foreground">
                  Click the "Open Google Analytics Dashboard" button and sign in with your Google account 
                  that has access to the analytics property.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">2. Navigating Reports</h3>
                <p className="text-sm text-muted-foreground">
                  Use the left sidebar to navigate between different report types: 
                  Realtime, Audience, Acquisition, Behavior, and Conversions.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">3. Setting Date Ranges</h3>
                <p className="text-sm text-muted-foreground">
                  Use the date selector in the top-right corner to adjust the time period for your reports.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">4. Creating Custom Reports</h3>
                <p className="text-sm text-muted-foreground">
                  Click on "Customization" in the left sidebar to create custom reports, dashboards, and segments.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">5. Setting Up Alerts</h3>
                <p className="text-sm text-muted-foreground">
                  Configure custom alerts to be notified of significant changes in your metrics.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => window.open('https://support.google.com/analytics/answer/1008015', '_blank', 'noopener,noreferrer')}
              >
                View Google Analytics Documentation <ExternalLink className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Settings</CardTitle>
              <CardDescription>
                Configure your Google Analytics integration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="ga-url" className="text-sm font-medium">Google Analytics URL</label>
                <div className="flex gap-2">
                  <input 
                    id="ga-url"
                    type="text" 
                    value={googleAnalyticsUrl}
                    onChange={(e) => setGoogleAnalyticsUrl(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Button variant="outline" onClick={() => setGoogleAnalyticsUrl('https://analytics.google.com/analytics/web/')}>
                    Reset
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Customize the Google Analytics URL if you're using a specific view or account
                </p>
              </div>
              
              <div className="pt-4">
                <h3 className="font-medium mb-2">Need Help Setting Up?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  If you haven't set up Google Analytics for your website yet, follow these steps:
                </p>
                <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
                  <li>Go to <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">analytics.google.com</a> and sign in</li>
                  <li>Click "Admin" in the bottom left corner</li>
                  <li>In the Account column, click "Create Account"</li>
                  <li>Follow the setup steps to create a property for your website</li>
                  <li>Add the tracking code to your website (contact your developer if needed)</li>
                </ol>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
