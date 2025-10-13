"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  MoreHorizontal,
  Loader2,
  Filter,
  Eye,
  RefreshCw,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
// AlertDialog components removed since we're using a custom dialog
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

interface MachineryItem {
  id: string;
  slug?: string;
  categorySlug?: string;
  name: string;
  category: string;
  manufacturer: string;
  modelNumber: string;
  year: number;
  price: number;
  hours: number;
  images?: string[];
  featured: boolean;
  availability: string;
  condition?: string;
  location?: string;
  updatedAt?: string;
  createdAt?: string;
}

export default function MachineryManagementPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [machineryItems, setMachineryItems] = useState<MachineryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all')
  const [featuredFilter, setFeaturedFilter] = useState<string>('all')
  const [sortField, setSortField] = useState<string>('updatedAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  
  // Extract unique categories and availability options for filters
  const categories = ['all', ...Array.from(new Set(machineryItems.map(item => item.category)))]
  const availabilityOptions = ['all', ...Array.from(new Set(machineryItems.map(item => item.availability)))]
  
  // Debug: Log dialog state changes
  useEffect(() => {
    console.log(`Delete dialog state changed: ${deleteDialogOpen}`)
  }, [deleteDialogOpen])
  
  // Fetch machinery items from API
  useEffect(() => {
    const fetchMachineryItems = async () => {
      try {
        setLoading(true)
        setError(null)
        setSuccessMessage(null)
        
        const response = await fetch('/api/admin/machinery')
        
        if (!response.ok) {
          throw new Error('Failed to fetch machinery items')
        }
        
        const data = await response.json()
        
        if (data.items && Array.isArray(data.items)) {
          setMachineryItems(data.items)
        } else {
          throw new Error('Invalid response format')
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching machinery items')
        console.error('Error fetching machinery items:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchMachineryItems()
  }, [refreshTrigger])
  
  // Filter machinery items based on search query and filters
  const filteredItems = machineryItems
    .filter(item => 
      (searchQuery === '' || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.modelNumber.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter(item => categoryFilter === 'all' || item.category === categoryFilter)
    .filter(item => availabilityFilter === 'all' || item.availability === availabilityFilter)
    .filter(item => featuredFilter === 'all' || 
      (featuredFilter === 'featured' && item.featured) || 
      (featuredFilter === 'standard' && !item.featured)
    )
    .sort((a, b) => {
      let valueA: any = a[sortField as keyof MachineryItem];
      let valueB: any = b[sortField as keyof MachineryItem];
      
      // Handle string comparison
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      }
      
      // Handle number comparison
      if (valueA === undefined) valueA = 0;
      if (valueB === undefined) valueB = 0;
      
      return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    });
  
  // Confirm deletion dialog
  const confirmDelete = (id: string) => {
    console.log(`Confirming delete for item ID: ${id}`)
    setItemToDelete(id)
    setDeleteDialogOpen(true)
    console.log(`Dialog state after setting: ${deleteDialogOpen}`)
  }
  
  // Handle delete item
  const handleDeleteItem = async () => {
    if (!itemToDelete) {
      console.error('No item to delete')
      return
    }
    
    try {
      setLoading(true)
      console.log(`Deleting machinery item with ID: ${itemToDelete}`)
      
      // Make sure we're using the correct API endpoint
      // MongoDB might be using _id internally but our API expects id in the URL
      const deleteUrl = `/api/admin/machinery/${itemToDelete}`
      console.log(`Delete URL: ${deleteUrl}`)
      
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        // No need for a request body for DELETE
      })
      
      console.log(`Delete response status: ${response.status}`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Delete error response:', errorData)
        throw new Error(errorData.error || 'Failed to delete item')
      }
      
      const result = await response.json()
      console.log('Delete success response:', result)
      
      // Remove the deleted item from the state
      // Check both id and _id to be safe
      setMachineryItems(prev => prev.filter(item => {
        // Handle both possible ID formats
        const itemId = item.id || (item as any)._id;
        return itemId !== itemToDelete;
      }))
      
      setSuccessMessage('Machinery item deleted successfully')
      
      // Clear message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      setError(`Error: ${err.message || 'Failed to delete item'}`)
      console.error('Error deleting item:', err)
    } finally {
      setLoading(false)
      setItemToDelete(null)
      setDeleteDialogOpen(false)
    }
  }
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>Loading machinery items...</p>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-500">
        <AlertCircle className="h-8 w-8 mb-4" />
        <p className="text-lg font-medium mb-2">Error</p>
        <p className="mb-4">{error}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => setRefreshTrigger(prev => prev + 1)}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Delete confirmation dialog - using Dialog instead of AlertDialog for better control */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-[400px] max-w-[90vw] shadow-xl">
            <h2 className="text-xl font-semibold mb-2">Delete Machinery Item</h2>
            <p className="text-gray-500 mb-4">
              This action cannot be undone. This will permanently delete the machinery item
              and remove it from our servers.
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  console.log('Cancel clicked');
                  setDeleteDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={() => {
                  console.log('Delete button clicked');
                  handleDeleteItem();
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Machinery Items</h1>
          <p className="text-muted-foreground">
            Manage your machinery inventory listings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setRefreshTrigger(prev => prev + 1)}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button asChild>
            <Link href="/admin/content/machinery/new">
              <Plus className="mr-2 h-4 w-4" />
              Add New Item
            </Link>
          </Button>
        </div>
      </div>
      
      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <AlertTitle className="text-green-800">Success</AlertTitle>
          <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search machinery items..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by availability" />
              </SelectTrigger>
              <SelectContent>
                {availabilityOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option === 'all' ? 'All Availability' : option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="featured">Featured Only</SelectItem>
                <SelectItem value="standard">Standard Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{filteredItems.length}</span> of <span className="font-medium">{machineryItems.length}</span> items
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    {sortField === 'name' ? 'Name' : 
                     sortField === 'price' ? 'Price' : 
                     sortField === 'year' ? 'Year' : 
                     sortField === 'updatedAt' ? 'Last Updated' : 
                     'Sort'}
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => { setSortField('name'); setSortDirection('asc'); }}>Name (A-Z)</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setSortField('name'); setSortDirection('desc'); }}>Name (Z-A)</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setSortField('price'); setSortDirection('asc'); }}>Price (Low to High)</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setSortField('price'); setSortDirection('desc'); }}>Price (High to Low)</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setSortField('year'); setSortDirection('desc'); }}>Year (Newest)</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setSortField('year'); setSortDirection('asc'); }}>Year (Oldest)</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setSortField('updatedAt'); setSortDirection('desc'); }}>Recently Updated</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="h-12 px-4 text-left align-middle font-medium">
                  <div className="flex items-center gap-1">
                    Name
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium">Image</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Category</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Manufacturer</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Year</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Price</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-slate-50">
                    <td className="p-4 align-middle font-medium">
                      <div className="max-w-[200px] truncate">{item.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{item.modelNumber}</div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="relative h-12 w-16 rounded overflow-hidden bg-slate-100">
                        {item.images && item.images.length > 0 ? (
                          <img 
                            src={item.images[0]} 
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full w-full text-slate-400 text-xs">No image</div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 align-middle">{item.category}</td>
                    <td className="p-4 align-middle">{item.manufacturer}</td>
                    <td className="p-4 align-middle">{item.year}</td>
                    <td className="p-4 align-middle font-medium">${item.price.toLocaleString()}</td>
                    <td className="p-4 align-middle">
                      <div className="flex flex-col gap-2">
                        <Badge variant={item.featured ? "default" : "outline"}>
                          {item.featured ? 'Featured' : 'Standard'}
                        </Badge>
                        <Badge variant="secondary">{item.availability}</Badge>
                      </div>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/en/machinery/${item.categorySlug || 'machinery'}/${item.slug || item.id}`} target="_blank">
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View on site</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <Link href={`/admin/content/machinery/${item.id}`} passHref>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </Link>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Use _id if id is not available
                            const itemId = item.id || (item as any)._id;
                            console.log(`Delete button clicked for item:`, item);
                            console.log(`Using ID for deletion: ${itemId}`);
                            setItemToDelete(itemId);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p className="text-muted-foreground">No machinery items found.</p>
                      {searchQuery || categoryFilter !== 'all' || availabilityFilter !== 'all' || featuredFilter !== 'all' ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setSearchQuery('')
                            setCategoryFilter('all')
                            setAvailabilityFilter('all')
                            setFeaturedFilter('all')
                          }}
                        >
                          Clear filters
                        </Button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {filteredItems.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" disabled>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <Button variant="outline" size="sm" className="font-medium">
              Page 1 of 1
            </Button>
            <Button variant="outline" size="icon" disabled>
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
