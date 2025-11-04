"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
// We'll use a simpler approach without the drag-and-drop library
// This will make the code more reliable and easier to maintain
import { Plus, Trash2, Pencil, Image as ImageIcon, GripVertical, Loader2, AlertCircle } from 'lucide-react'
import Image from 'next/image'

interface Brand {
  id: string;
  name: string;
  logo: string;
  order: number;
  isActive: boolean;
}

export default function BrandsManagementPage() {
  const { toast } = useToast()
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editBrand, setEditBrand] = useState<Brand | null>(null)
  const [deleteBrand, setDeleteBrand] = useState<Brand | null>(null)
  const [newBrandName, setNewBrandName] = useState('')
  const [newBrandLogo, setNewBrandLogo] = useState<File | null>(null)
  const [newBrandActive, setNewBrandActive] = useState(true)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  
  // Fetch brands
  useEffect(() => {
    async function fetchBrands() {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/brands')
        if (response.ok) {
          const data = await response.json()
          setBrands(data)
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch brands"
          })
        }
      } catch (error) {
        console.error('Error fetching brands:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch brands"
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchBrands()
  }, [toast])
  
  // Handle logo change
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Preview the image
    const reader = new FileReader()
    reader.onload = () => {
      setLogoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
    
    setNewBrandLogo(file)
  }
  
  // Handle add brand
  const handleAddBrand = async () => {
    if (!newBrandName.trim() || !newBrandLogo) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Name and logo are required"
      })
      return
    }
    
    try {
      setSaving(true)
      
      const formData = new FormData()
      formData.append('name', newBrandName)
      formData.append('logo', newBrandLogo)
      formData.append('isActive', newBrandActive.toString())
      
      const response = await fetch('/api/admin/brands', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        const newBrand = await response.json()
        setBrands([...brands, newBrand])
        
        // Reset form
        setNewBrandName('')
        setNewBrandLogo(null)
        setLogoPreview(null)
        setNewBrandActive(true)
        setDialogOpen(false)
        
        toast({
          title: "Success",
          description: "Brand added successfully"
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to add brand')
      }
    } catch (error: any) {
      console.error('Error adding brand:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add brand"
      })
    } finally {
      setSaving(false)
    }
  }
  
  // Handle edit brand
  const handleEditBrand = async () => {
    if (!editBrand || !editBrand.name.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Name is required"
      })
      return
    }
    
    try {
      setSaving(true)
      
      const formData = new FormData()
      formData.append('name', editBrand.name)
      formData.append('isActive', editBrand.isActive.toString())
      formData.append('order', editBrand.order.toString())
      
      if (newBrandLogo) {
        formData.append('logo', newBrandLogo)
      }
      
      const response = await fetch(`/api/admin/brands/${editBrand.id}`, {
        method: 'PUT',
        body: formData
      })
      
      if (response.ok) {
        const updatedBrand = await response.json()
        setBrands(brands.map(b => b.id === updatedBrand.id ? updatedBrand : b))
        
        // Reset form
        setEditBrand(null)
        setNewBrandLogo(null)
        setLogoPreview(null)
        setDialogOpen(false)
        
        toast({
          title: "Success",
          description: "Brand updated successfully"
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update brand')
      }
    } catch (error: any) {
      console.error('Error updating brand:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update brand"
      })
    } finally {
      setSaving(false)
    }
  }
  
  // Handle delete brand
  const handleDeleteBrand = async () => {
    if (!deleteBrand) return
    
    try {
      setSaving(true)
      
      const response = await fetch(`/api/admin/brands/${deleteBrand.id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setBrands(brands.filter(b => b.id !== deleteBrand.id))
        
        // Reset form
        setDeleteBrand(null)
        setDeleteDialogOpen(false)
        
        toast({
          title: "Success",
          description: "Brand deleted successfully"
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete brand')
      }
    } catch (error: any) {
      console.error('Error deleting brand:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete brand"
      })
    } finally {
      setSaving(false)
    }
  }
  
  // Move brand up in order
  const moveBrandUp = async (index: number) => {
    if (index <= 0) return; // Already at the top
    
    const items = Array.from(brands);
    // Swap with the item above
    [items[index], items[index - 1]] = [items[index - 1], items[index]];
    
    // Update local state
    setBrands(items);
    
    // Update order in database
    await updateBrandOrder(items);
  };
  
  // Move brand down in order
  const moveBrandDown = async (index: number) => {
    if (index >= brands.length - 1) return; // Already at the bottom
    
    const items = Array.from(brands);
    // Swap with the item below
    [items[index], items[index + 1]] = [items[index + 1], items[index]];
    
    // Update local state
    setBrands(items);
    
    // Update order in database
    await updateBrandOrder(items);
  };
  
  // Update brand order in database
  const updateBrandOrder = async (items: Brand[]) => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/brands/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          brandIds: items.map(item => item.id)
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to reorder brands');
      }
    } catch (error: any) {
      console.error('Error reordering brands:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to reorder brands"
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Open edit dialog
  const openEditDialog = (brand: Brand) => {
    setEditBrand(brand)
    setLogoPreview(brand.logo)
    setNewBrandLogo(null)
    setDialogOpen(true)
  }
  
  // Open add dialog
  const openAddDialog = () => {
    setEditBrand(null)
    setNewBrandName('')
    setNewBrandLogo(null)
    setLogoPreview(null)
    setNewBrandActive(true)
    setDialogOpen(true)
  }
  
  // Open delete dialog
  const openDeleteDialog = (brand: Brand) => {
    setDeleteBrand(brand)
    setDeleteDialogOpen(true)
  }
  
  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Brand Management</h1>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Brand
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Brands</CardTitle>
          <CardDescription>
            Manage the brands displayed in the brands section. Drag to reorder.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : brands.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No brands found</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Add a brand to get started
              </p>
              <Button onClick={openAddDialog} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Add Brand
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {brands.map((brand, index) => (
                <div
                  key={brand.id}
                  className={`flex items-center justify-between p-3 rounded-md border ${!brand.isActive ? 'bg-muted/50' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        disabled={index === 0 || saving}
                        onClick={() => moveBrandUp(index)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up">
                          <path d="m18 15-6-6-6 6"/>
                        </svg>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        disabled={index === brands.length - 1 || saving}
                        onClick={() => moveBrandDown(index)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </Button>
                    </div>
                    <div className="h-12 w-12 relative rounded-md overflow-hidden border bg-white">
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                    <div>
                      <p className="font-medium">{brand.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {brand.isActive ? 'Active' : 'Inactive'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Order: {brand.order}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditDialog(brand)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => openDeleteDialog(brand)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add/Edit Brand Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editBrand ? 'Edit Brand' : 'Add Brand'}</DialogTitle>
            <DialogDescription>
              {editBrand ? 'Update the brand details' : 'Add a new brand to the website'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Brand Name</Label>
              <Input
                id="name"
                value={editBrand ? editBrand.name : newBrandName}
                onChange={(e) => {
                  if (editBrand) {
                    setEditBrand({ ...editBrand, name: e.target.value })
                  } else {
                    setNewBrandName(e.target.value)
                  }
                }}
                placeholder="Enter brand name"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="logo">Brand Logo</Label>
              <div className="flex flex-col items-center gap-4">
                {logoPreview && (
                  <div className="h-24 w-24 relative rounded-md overflow-hidden border bg-white">
                    <Image
                      src={logoPreview}
                      alt="Logo Preview"
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  <Label
                    htmlFor="logo"
                    className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-md border hover:bg-muted transition-colors"
                  >
                    <ImageIcon className="h-4 w-4" />
                    {logoPreview ? 'Change Logo' : 'Upload Logo'}
                  </Label>
                  {logoPreview && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setLogoPreview(null)
                        setNewBrandLogo(null)
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Label htmlFor="active">Active</Label>
              <Switch
                id="active"
                checked={editBrand ? editBrand.isActive : newBrandActive}
                onCheckedChange={(checked) => {
                  if (editBrand) {
                    setEditBrand({ ...editBrand, isActive: checked })
                  } else {
                    setNewBrandActive(checked)
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={editBrand ? handleEditBrand : handleAddBrand}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editBrand ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>{editBrand ? 'Update Brand' : 'Add Brand'}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Brand Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the brand
              {deleteBrand && <strong> "{deleteBrand.name}"</strong>}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBrand}
              disabled={saving}
              className="bg-red-500 hover:bg-red-600"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>Delete</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
