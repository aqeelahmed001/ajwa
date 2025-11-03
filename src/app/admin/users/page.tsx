"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  UserPlus,
  Shield,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  AlertCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import RoleGuard from '@/components/admin/RoleGuard'

// User interface
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  roleId?: string;
  isActive: boolean;
  lastLogin?: string;
  lastLoginIp?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Role interface
interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  isSystem: boolean;
}

// Pagination interface
interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export default function UsersPage() {
  return (
    <RoleGuard requiredPermission="viewUsers">
      <UsersManagement />
    </RoleGuard>
  )
}

function UsersManagement() {
  // State for users and filtering
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [activeFilter, setActiveFilter] = useState<boolean | null>(null)
  
  // Pagination state
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 1
  })
  
  // Loading and error states
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string>('')
  
  // Recently deleted user state
  const [recentlyDeleted, setRecentlyDeleted] = useState<{name: string, timestamp: number} | null>(null)
  
  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [userDialogOpen, setUserDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    roleId: '',
    isActive: true
  })
  
  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Build query parameters
      const params = new URLSearchParams()
      params.append('page', pagination.page.toString())
      params.append('limit', pagination.limit.toString())
      
      if (searchQuery) {
        params.append('search', searchQuery)
      }
      
      if (selectedRole) {
        params.append('role', selectedRole)
      }
      
      if (activeFilter !== null) {
        params.append('isActive', activeFilter.toString())
      }
      
      // Fetch users from API
      const response = await fetch(`/api/admin/users?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      
      const data = await response.json()
      
      if (data.success) {
        setUsers(data.users)
        setPagination(data.pagination)
      } else {
        throw new Error(data.message || 'Failed to fetch users')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      toast.error(err.message || 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }
  
  // Fetch roles
  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/admin/roles')
      
      if (!response.ok) {
        throw new Error('Failed to fetch roles')
      }
      
      const data = await response.json()
      
      if (data.success) {
        setRoles(data.roles)
      } else {
        throw new Error(data.message || 'Failed to fetch roles')
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch roles')
    }
  }
  
  // Initial data fetch
  useEffect(() => {
    fetchUsers()
    fetchRoles()
  }, [])
  
  // Fetch when filters change
  useEffect(() => {
    fetchUsers()
  }, [pagination.page, pagination.limit, searchQuery, selectedRole, activeFilter])
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }
  
  // Handle search
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 })) // Reset to first page
    fetchUsers()
  }
  
  // Handle role filter change
  const handleRoleFilterChange = (role: string) => {
    setSelectedRole(role)
    setPagination(prev => ({ ...prev, page: 1 })) // Reset to first page
  }
  
  // Handle active filter change
  const handleActiveFilterChange = (isActive: boolean | null) => {
    setActiveFilter(isActive)
    setPagination(prev => ({ ...prev, page: 1 })) // Reset to first page
  }
  
  // Reset filters
  const resetFilters = () => {
    setSearchQuery('')
    setSelectedRole('')
    setActiveFilter(null)
    setPagination(prev => ({ ...prev, page: 1 })) // Reset to first page
  }
  
  // Delete user
  const handleDeleteClick = (id: string) => {
    if (!id) {
      console.error('Cannot delete user: No user ID provided');
      toast.error('Cannot delete user: Invalid user ID');
      return;
    }
    
    console.log(`Delete clicked for user ID: ${id}`);
    // Set the user ID to delete and open the confirmation dialog
    setUserToDelete(id);
    setDeleteDialogOpen(true);
  }
  
  const handleDeleteConfirm = async () => {
    // Store the ID locally to ensure it's not lost during state updates
    const idToDelete = userToDelete;
    
    if (!idToDelete) {
      console.error('No user ID to delete');
      toast.error('Cannot delete: Missing user ID');
      return;
    }
    
    console.log(`Confirming deletion of user ID: ${idToDelete}`);
    
    try {
      setLoading(true);
      
      console.log(`Attempting to delete user with ID: ${idToDelete}`);
      
      // Make the delete request
      const response = await fetch(`/api/admin/users/${idToDelete}`, {
        method: 'DELETE',
        // Add credentials to ensure cookies are sent
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`Delete response status: ${response.status}`);
      
      // Parse the response JSON
      let data;
      try {
        data = await response.json();
        console.log('Delete response data:', data);
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        data = { success: false };
      }
      
      if (!response.ok) {
        console.error(`Error ${response.status}: ${response.statusText}`);
        console.error('Error details:', data);
        throw new Error(data?.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      if (data?.success) {
        console.log('User deleted successfully, refreshing user list');
        
        // Show a more detailed success message with the user's name if available
        const userName = data.userName || 'User';
        toast.success(`${userName} was successfully deleted`, {
          duration: 4000,
          description: 'The user has been removed from the system',
          action: {
            label: 'Dismiss',
            onClick: () => console.log('Dismissed delete success message')
          }
        });
        
        // Set recently deleted user state to show notification
        setRecentlyDeleted({
          name: userName,
          timestamp: Date.now()
        });
        
        // Clear the notification after 5 seconds
        setTimeout(() => {
          setRecentlyDeleted(null);
        }, 5000);
        
        await fetchUsers(); // Refresh user list
      } else {
        const errorMsg = data?.message || 'Failed to delete user';
        console.error('Delete operation failed:', errorMsg);
        throw new Error(errorMsg);
      }
    } catch (err: any) {
      console.error('Delete user error:', err);
      toast.error(err.message || 'Failed to delete user');
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  }
  
  // Edit user
  const handleEditClick = (user: User) => {
    setEditingUser(user)
    setFormError('')
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Don't populate password
      role: user.role,
      roleId: user.roleId || '',
      isActive: user.isActive
    })
    setUserDialogOpen(true)
  }
  
  // Create new user
  const handleCreateClick = () => {
    setEditingUser(null)
    setFormError('')
    setFormData({
      name: '',
      email: '',
      password: '',
      role: '',
      roleId: '',
      isActive: true
    })
    setUserDialogOpen(true)
  }
  
  // Handle form input change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }
  
  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setFormError('')
      
      const url = editingUser
        ? `/api/admin/users/${editingUser.id}`
        : '/api/admin/users'
      
      const method = editingUser ? 'PUT' : 'POST'
      
      // Don't send empty password when editing
      const payload: Record<string, any> = editingUser && !formData.password
        ? { ...formData, password: undefined }
        : { ...formData }
      
      // Remove empty roleId to prevent MongoDB ObjectId casting errors
      if (payload.roleId === '') {
        delete payload.roleId;
      }
      
      console.log('Submitting user data:', payload);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      
      const data = await response.json().catch(() => ({ success: false }))
      
      if (!response.ok) {
        // Handle HTTP error status
        const errorMessage = data.message || `Error: ${response.status} ${response.statusText}`;
        console.error('API error:', errorMessage);
        setFormError(errorMessage);
        toast.error(errorMessage);
        return;
      }
      
      if (data.success) {
        toast.success(
          editingUser
            ? 'User updated successfully'
            : 'User created successfully'
        )
        fetchUsers() // Refresh user list
        setUserDialogOpen(false)
      } else {
        const errorMessage = data.message || 'Failed to save user';
        setFormError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to save user';
      console.error('Form submission error:', err);
      setFormError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false)
    }
  }
  
  // Toggle user active status
  const handleToggleActive = async (user: User) => {
    try {
      setLoading(true)
      
      console.log(`Toggling active status for user: ${user.id}, current status: ${user.isActive}`)
      
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !user.isActive,
        }),
      })
      
      const data = await response.json().catch(() => ({ success: false }))
      
      if (!response.ok) {
        console.error('Error toggling user status:', data)
        throw new Error(data.message || `Error ${response.status}: ${response.statusText}`)
      }
      
      if (data.success) {
        toast.success(`User ${user.isActive ? 'deactivated' : 'activated'} successfully`)
        fetchUsers() // Refresh user list
      } else {
        throw new Error(data.message || 'Failed to update user')
      }
    } catch (err: any) {
      console.error('Toggle active error:', err)
      toast.error(err.message || 'Failed to update user status')
    } finally {
      setLoading(false)
    }
  }
  
  // Get role badge variant
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'editor':
        return 'secondary';
      default:
        return 'outline';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        <Button onClick={handleCreateClick}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select 
            value={selectedRole || "all"} 
            onValueChange={(value) => handleRoleFilterChange(value === "all" ? "" : value)}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.name}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={activeFilter === null ? 'all' : activeFilter.toString()} 
            onValueChange={(value) => {
              if (value === 'all') {
                handleActiveFilterChange(null)
              } else {
                handleActiveFilterChange(value === 'true')
              }
            }}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" onClick={resetFilters} title="Reset filters">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      {/* Error state */}
      {error && !loading && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      {/* Recently deleted notification */}
      {recentlyDeleted && (
        <div className="rounded-md bg-green-50 p-4 border border-green-200 mb-4 animate-pulse transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-green-700">
                <strong>{recentlyDeleted.name}</strong> was successfully deleted
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setRecentlyDeleted(null)}
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Dismiss</span>
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {/* Users table */}
      {!loading && !error && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.isActive ? (
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <span>Active</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <XCircle className="h-4 w-4 text-red-500 mr-1" />
                        <span>Inactive</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClick(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleActive(user)}>
                          {user.isActive ? (
                            <>
                              <ToggleLeft className="mr-2 h-4 w-4" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <ToggleRight className="mr-2 h-4 w-4" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600 focus:text-red-600"
                          onClick={() => {
                            // Debug the user object to ensure ID is available
                            console.log('User object for deletion:', user);
                            if (!user || !user.id) {
                              console.error('Cannot delete: Invalid user or missing ID');
                              toast.error('Cannot delete: Invalid user data');
                              return;
                            }
                            handleDeleteClick(user.id);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Pagination */}
      {!loading && !error && pagination.totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}
      
      {/* Delete confirmation dialog */}
      <AlertDialog 
        open={deleteDialogOpen} 
        onOpenChange={(open) => {
          // Only close the dialog, don't reset userToDelete yet
          // This prevents userToDelete from being reset before handleDeleteConfirm is called
          if (!open) {
            setDeleteDialogOpen(false);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user account and remove their access to the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              console.log('Delete operation cancelled');
              // Reset the userToDelete state when cancel is clicked
              setUserToDelete(null);
            }}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                console.log(`Delete confirmation clicked for user ID: ${userToDelete}`);
                handleDeleteConfirm();
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* User form dialog */}
      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Edit User' : 'Create New User'}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? 'Update user details and permissions.'
                : 'Add a new user to the system.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleFormSubmit} className="space-y-4 pt-4">
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{formError}</span>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFormChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">
                {editingUser ? 'New Password (leave blank to keep current)' : 'Password'}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleFormChange}
                required={!editingUser}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                name="role"
                value={formData.role}
                onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, isActive: checked === true }))
                }
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setUserDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
