"use client"

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { 
  Bell, 
  User,
  ExternalLink,
  Menu
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface AdminHeaderProps {
  toggleSidebar?: () => void;
}

export default function AdminHeader({ toggleSidebar }: AdminHeaderProps) {
  const router = useRouter()
  const { data: session } = useSession()
  
  const handleLogout = async () => {
    try {
      // First, call our custom logout API to clear cookies and log activity
      await fetch('/api/auth/logout', {
        method: 'POST',
      })
      
      // Then use NextAuth's signOut to clear the session
      await signOut({ redirect: false })
      
      // Redirect to login page
      router.push('/admin')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 dark:bg-slate-950 dark:border-slate-800">
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden" 
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>
      
      <div className="flex-1" />
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          asChild
        >
          <Link href="/" target="_blank">
            <ExternalLink className="h-5 w-5" />
            <span className="sr-only">View website</span>
          </Link>
        </Button>
        
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full relative overflow-hidden">
              {session?.user?.image ? (
                <img 
                  src={session.user.image} 
                  alt={session.user.name || 'User'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-5 w-5" />
              )}
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {session?.user?.name || 'My Account'}
              {session?.user?.email && (
                <p className="text-xs text-muted-foreground mt-1">{session.user.email}</p>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/settings">Profile Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500" onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
