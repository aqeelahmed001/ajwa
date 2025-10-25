"use client"

import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  Loader2,
  RefreshCw,
  AlertCircle,
  Image as ImageIcon,
  Eye,
  FolderTree
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import ImageUploader from '@/components/ui/ImageUploader'
import CloudinaryImage from '@/components/ui/CloudinaryImage'

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CategoryManagementPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [parentFilter, setParentFilter] = useState<string>('all')
  const [sortField, setSortField] = useState<string>('order')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    parentId: '',
    order: 0,
    isActive: true
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Delete dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  
  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)
        setSuccessMessage(null)
        
        const response = await fetch('/api/admin/categories')
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }
        
        const data = await response.json()
        
        if (data.categories && Array.isArray(data.categories)) {
          setCategories(data.categories)
        } else {
          throw new Error('Invalid response format')
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching categories')
        console.error('Error fetching categories:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchCategories()
  }, [refreshTrigger])
  
  // Get parent categories for dropdown
  const parentCategories = [
    { id: '', name: 'None (Top Level)' },
    ...categories.filter(cat => !cat.parentId)
  ]
  
  // Filter categories based on search query and filters
  const filteredCategories = categories
    .filter(category => 
      (searchQuery === '' || 
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase())))
    )
    .filter(category => activeFilter === 'all' || 
      (activeFilter === 'active' && category.isActive) || 
      (activeFilter === 'inactive' && !category.isActive)
    )
    .filter(category => parentFilter === 'all' || 
      (parentFilter === 'parent' && !category.parentId) || 
      (parentFilter === 'child' && category.parentId) ||
      (category.parentId === parentFilter)
    )
    .sort((a, b) => {
      let valueA: any = a[sortField as keyof Category];
      let valueB: any = b[sortField as keyof Category];
      
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
  
  // Open create dialog
  const openCreateDialog = () => {
    setFormData({
      name: '',
      description: '',
      image: '',
      parentId: '',
      order: categories.length,
      isActive: true
    })
    setFormErrors({})
    setDialogMode('create')
    setDialogOpen(true)
  }
  
  // Open edit dialog
  const openEditDialog = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description || '',
      image: category.image || '',
      parentId: category.parentId || '',
      order: category.order,
      isActive: category.isActive
    })
    setFormErrors({})
    setCurrentCategory(category)
    setDialogMode('edit')
    setDialogOpen(true)
  }
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }
  
  // Handle switch change
  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isActive: checked }))
  }
  
  // Handle select change
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, parentId: value }))
  }
  
  // Handle image upload
  const handleImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, image: url }))
  }
  
  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      errors.name = 'Category name is required'
    }
    
    // Check if order is a number
    if (isNaN(Number(formData.order))) {
      errors.order = 'Order must be a number'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }
  
  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    try {
      setIsSubmitting(true)
      
      const url = dialogMode === 'create' 
        ? '/api/admin/categories' 
        : `/api/admin/categories/${currentCategory?.id}`
      
      const method = dialogMode === 'create' ? 'POST' : 'PUT'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save category')
      }
      
      const result = await response.json()
      
      // Update categories list
      setRefreshTrigger(prev => prev + 1)
      
      // Show success message
      setSuccessMessage(
        dialogMode === 'create' 
          ? 'Category created successfully' 
          : 'Category updated successfully'
      )
      
      // Close dialog
      setDialogOpen(false)
      
      // Clear message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      setError(`Error: ${err.message || 'Failed to save category'}`)
      console.error('Error saving category:', err)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Confirm deletion dialog
  const confirmDelete = (id: string) => {
    setItemToDelete(id)
    setDeleteDialogOpen(true)
  }
  
  // Handle delete category
  const handleDeleteCategory = async () => {
    if (!itemToDelete) {
      return
    }
    
    try {
      setLoading(true)
      
      const response = await fetch(`/api/admin/categories/${itemToDelete}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete category')
      }
      
      // Update categories list
      setRefreshTrigger(prev => prev + 1)
      
      // Show success message
      setSuccessMessage('Category deleted successfully')
      
      // Clear message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      setError(`Error: ${err.message || 'Failed to delete category'}`)
      console.error('Error deleting category:', err)
    } finally {
      setLoading(false)
      setItemToDelete(null)
      setDeleteDialogOpen(false)
    }
  }
  
  // Get parent category name
  const getParentCategoryName = (parentId: string | null | undefined) => {
    if (!parentId) return 'None'
    const parent = categories.find(cat => cat.id === parentId)
    return parent ? parent.name : 'Unknown'
  }
  
  if (loading && categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>Loading categories...</p>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Delete confirmation dialog */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-[400px] max-w-[90vw] shadow-xl">
            <h2 className="text-xl font-semibold mb-2">Delete Category</h2>
            <p className="text-gray-500 mb-4">
              This action cannot be undone. This will permanently delete the category
              and remove it from our servers.
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={handleDeleteCategory}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Category Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{dialogMode === 'create' ? 'Create New Category' : 'Edit Category'}</DialogTitle>
            <DialogDescription>
              {dialogMode === 'create' 
                ? 'Add a new category to organize machinery items.' 
                : 'Update the category details.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name <span className="text-red-500">*</span></Label>
                <Input 
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter category name"
                  className={formErrors.name ? "border-red-500" : ""}
                />
                {formErrors.name && (
                  <p className="text-sm text-red-500">{formErrors.name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter category description"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Parent Category</Label>
                <Select 
                  value={formData.parentId} 
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None (Top Level)</SelectItem>
                    {categories
                      .filter(cat => !cat.parentId && (!currentCategory || cat.id !== currentCategory.id))
                      .map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="order">Display Order</Label>
                  <Input 
                    id="order"
                    name="order"
                    type="number"
                    value={formData.order}
                    onChange={handleInputChange}
                    className={formErrors.order ? "border-red-500" : ""}
                  />
                  {formErrors.order && (
                    <p className="text-sm text-red-500">{formErrors.order}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch 
                      checked={formData.isActive}
                      onCheckedChange={handleSwitchChange}
                    />
                    <span>{formData.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Category Image</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <ImageUploader 
                      onUpload={handleImageUpload}
                      folder="ajwa/categories"
                      buttonText="Upload Category Image"
                    />
                  </div>
                  
                  {formData.image && (
                    <div className="border rounded-md p-2">
                      <div className="aspect-video relative overflow-hidden rounded-md">
                        <CloudinaryImage
                          src={formData.image}
                          alt="Category Preview"
                          width={300}
                          height={200}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  dialogMode === 'create' ? 'Create Category' : 'Update Category'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Manage categories for machinery items
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
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Category
          </Button>
        </div>
      </div>
      
      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <AlertTitle className="text-green-800">Success</AlertTitle>
          <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Error</AlertTitle>
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={activeFilter} onValueChange={setActiveFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={parentFilter} onValueChange={setParentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by parent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="parent">Top Level Only</SelectItem>
                <SelectItem value="child">Subcategories Only</SelectItem>
                {categories
                  .filter(cat => !cat.parentId)
                  .map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      Children of: {category.name}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{filteredCategories.length}</span> of <span className="font-medium">{categories.length}</span> categories
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
                <th className="h-12 px-4 text-left align-middle font-medium">Parent</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Order</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="border-b hover:bg-slate-50">
                    <td className="p-4 align-middle font-medium">
                      <div className="max-w-[200px]">
                        <div className="font-medium">{category.name}</div>
                        {category.description && (
                          <div className="text-xs text-muted-foreground mt-1 truncate">
                            {category.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="relative h-12 w-16 rounded overflow-hidden bg-slate-100">
                        {category.image ? (
                          <CloudinaryImage 
                            src={category.image} 
                            alt={category.name}
                            width={64}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full w-full text-slate-400 text-xs">
                            <ImageIcon className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      {category.parentId ? (
                        <Badge variant="outline">
                          {getParentCategoryName(category.parentId)}
                        </Badge>
                      ) : (
                        <Badge>Top Level</Badge>
                      )}
                    </td>
                    <td className="p-4 align-middle">{category.order}</td>
                    <td className="p-4 align-middle">
                      <Badge variant={category.isActive ? "default" : "secondary"}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex items-center"
                          onClick={() => openEditDialog(category)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => confirmDelete(category.id)}
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
                  <td colSpan={6} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FolderTree className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No categories found.</p>
                      {searchQuery || activeFilter !== 'all' || parentFilter !== 'all' ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setSearchQuery('')
                            setActiveFilter('all')
                            setParentFilter('all')
                          }}
                        >
                          Clear filters
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={openCreateDialog}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Create your first category
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
