"use client"

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
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
  const { user, logout } = useAuth()
  
  const handleLogout = async () => {
    try {
      // Use our auth context's logout function
      await logout()
      
      // Redirect is handled by the auth context
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
              {/* Always show the user icon since we don't have image in our JWT payload */}
              <User className="h-5 w-5" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {user?.name || 'My Account'}
              {user?.email && (
                <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
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
