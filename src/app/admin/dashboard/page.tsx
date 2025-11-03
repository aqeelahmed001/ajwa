"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Logo from '@/components/Logo'

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-muted-foreground">Total users in the system</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-sm text-muted-foreground">Admin, Editor, Viewer</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1</div>
            <p className="text-sm text-muted-foreground">Recent login</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Ajwa Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <Logo width={200} height={80} />
          </div>
          <p className="text-center">Your authentication is working correctly!</p>
        </CardContent>
      </Card>
    </div>
  )
}
