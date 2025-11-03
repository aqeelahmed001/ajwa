"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  Users, 
  Settings, 
  LogOut,
  ChevronRight,
  PanelLeft,
  Truck,
  MessageSquare,
  BarChart3,
  HelpCircle,
  Bell,
  User,
  ChevronDown,
  FolderTree
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface SidebarItemProps {
  href: string
  icon: React.ReactNode
  label: string
  isActive: boolean
  badge?: string | number
  badgeColor?: 'default' | 'secondary' | 'destructive'
}

const SidebarItem = ({ 
  href, 
  icon, 
  label, 
  isActive, 
  badge, 
  badgeColor = 'default' 
}: SidebarItemProps) => {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all relative",
              isActive 
                ? "bg-primary/10 text-primary before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-8 before:w-1 before:bg-primary before:rounded-r" 
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"
            )}
          >
            <span className={cn(
              "p-1 rounded-md",
              isActive ? "bg-primary/10 text-primary" : "text-slate-500"
            )}>
              {icon}
            </span>
            <span>{label}</span>
            {badge && (
              <Badge 
                variant={badgeColor}
                className={cn(
                  "ml-auto",
                  badgeColor === 'destructive' ? "bg-red-500" : ""
                )}
              >
                {badge}
              </Badge>
            )}
            {isActive && <ChevronRight className="ml-auto h-4 w-4 text-primary" />}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-slate-900 text-white">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface SidebarGroupProps {
  title: string
  children: React.ReactNode
}

const SidebarGroup = ({ title, children }: SidebarGroupProps) => {
  const [isOpen, setIsOpen] = useState(true)
  
  return (
    <div className="mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider"
      >
        {title}
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen ? "transform rotate-180" : "")} />
      </button>
      <div className={cn("mt-1 space-y-1", !isOpen && "hidden")}>
        {children}
      </div>
    </div>
  )
}

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const [collapsed, setCollapsed] = useState(false)
  
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
    <div className={cn(
      "flex h-full flex-col border-r bg-white dark:bg-slate-950 dark:border-slate-800 transition-all duration-300",
      collapsed ? "w-20" : "w-72"
    )}>
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className={cn("flex items-center gap-2", collapsed && "justify-center w-full")}>
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/20">
            <Truck className="h-5 w-5 text-primary" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-lg font-bold">Ajwa Admin</h2>
              <p className="text-xs text-slate-500">Content Management</p>
            </div>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="rounded-full p-1 h-8 w-8"
          onClick={() => setCollapsed(!collapsed)}
        >
          <PanelLeft className={cn("h-4 w-4 transition-transform", collapsed && "transform rotate-180")} />
        </Button>
      </div>
      
      {/* User Profile */}
      <div className={cn(
        "border-b p-4 flex items-center gap-3",
        collapsed ? "justify-center" : "justify-between"
      )}>
        <div className="flex items-center gap-3">
          <Link href="/admin/settings" className="hover:opacity-80 transition-opacity">
            <Avatar>
              <AvatarImage src={session?.user?.image || undefined} />
              <AvatarFallback>
                {session?.user?.name
                  ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
                  : 'U'}
              </AvatarFallback>
            </Avatar>
          </Link>
          {!collapsed && (
            <div>
              <p className="text-sm font-medium">{session?.user?.name || 'User'}</p>
              <p className="text-xs text-slate-500">{session?.user?.email || ''}</p>
            </div>
          )}
        </div>
        {!collapsed && (
          <div className="flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                    <Bell className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Notifications</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" asChild>
                    <Link href="/admin/settings">
                      <User className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Profile</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        <SidebarGroup title={collapsed ? "" : "GENERAL"}>
          <SidebarItem 
            href="/admin/dashboard" 
            icon={<LayoutDashboard className="h-5 w-5" />} 
            label="Dashboard" 
            isActive={pathname === '/admin/dashboard'} 
          />
          <SidebarItem 
            href="/admin/analytics" 
            icon={<BarChart3 className="h-5 w-5" />} 
            label="Analytics" 
            isActive={pathname.startsWith('/admin/analytics')} 
            badge="New"
            badgeColor="secondary"
          />
        </SidebarGroup>
        
        <SidebarGroup title={collapsed ? "" : "CONTENT"}>
          <SidebarItem 
            href="/admin/content/pages" 
            icon={<FileText className="h-5 w-5" />} 
            label="Page Content" 
            isActive={pathname.startsWith('/admin/content/pages')} 
          />
          <SidebarItem 
            href="/admin/content/category-management" 
            icon={<FolderTree className="h-5 w-5" />} 
            label="Categories" 
            isActive={pathname.startsWith('/admin/content/category-management')} 
          />
          <SidebarItem 
            href="/admin/content/machinery-management" 
            icon={<Truck className="h-5 w-5" />} 
            label="Machinery Items" 
            isActive={pathname.startsWith('/admin/content/machinery-management') || pathname.startsWith('/admin/content/machinery')} 
            badge={3}
          />
        </SidebarGroup>
        
        <SidebarGroup title={collapsed ? "" : "ADMINISTRATION"}>
          <SidebarItem 
            href="/admin/users" 
            icon={<Users className="h-5 w-5" />} 
            label="User Management" 
            isActive={pathname.startsWith('/admin/users')} 
          />
          <SidebarItem 
            href="/admin/messages" 
            icon={<MessageSquare className="h-5 w-5" />} 
            label="Messages" 
            isActive={pathname.startsWith('/admin/messages')} 
            badge={5}
            badgeColor="destructive"
          />
          <SidebarItem 
            href="/admin/settings" 
            icon={<Settings className="h-5 w-5" />} 
            label="Settings" 
            isActive={pathname.startsWith('/admin/settings')} 
          />
        </SidebarGroup>
      </nav>
      
      {/* Footer */}
      <div className="border-t p-4">
        <div className="flex flex-col gap-2">
          <SidebarItem 
            href="/admin/help" 
            icon={<HelpCircle className="h-5 w-5" />} 
            label="Help & Support" 
            isActive={pathname.startsWith('/admin/help')} 
          />
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
          >
            <span className="p-1 rounded-md text-red-500">
              <LogOut className="h-5 w-5" />
            </span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </div>
  )
}
