"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  Plus, 
  X, 
  Upload,
  Trash2,
  AlertCircle,
  Check,
  Info,
  Star,
  StarOff,
  ImagePlus,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { createMachineryItem, updateMachineryItem, fetchMachineryItemById } from '@/services/machineryService'
import { slugify } from '@/lib/slugify'

export default function MachineryItemForm({ params }: { params: { id: string } }) {
  const router = useRouter()
  const isNewItem = params.id === 'new'
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('basic')
  const [previewSlug, setPreviewSlug] = useState('')
  const [previewCategorySlug, setPreviewCategorySlug] = useState('')
  // Define a proper type for the form data
  interface FormDataType {
    id?: string;
    name: string;
    category: string;
    subcategory: string | '';
    manufacturer: string;
    modelNumber: string;
    year: number;
    hours: number;
    price: number;
    priceJPY: string | '';
    images: string[];
    location: string;
    condition: string;
    weight: string | '';
    featured: boolean;
    availability: string;
    description: string;
    specifications: Record<string, string>;
    tags: string[];
    // Add any other optional fields that might come from the API
    [key: string]: any;
  }

  const defaultFormData: FormDataType = {
    name: '',
    category: '',
    subcategory: '',
    manufacturer: '',
    modelNumber: '',
    year: new Date().getFullYear(),
    hours: 0,
    price: 0,
    priceJPY: '',
    images: [],
    location: '',
    condition: '',
    weight: '',
    featured: false,
    availability: 'In Stock',
    description: '',
    specifications: {},
    tags: []
  };

  // Initialize with defaultFormData to avoid undefined errors during loading
  const [formData, setFormData] = useState<FormDataType>(defaultFormData)
  
  // State for custom field options
  const [categories, setCategories] = useState<string[]>([])
  const [subcategories, setSubcategories] = useState<string[]>([])
  const [conditions, setConditions] = useState<string[]>([])
  const [availabilityOptions, setAvailabilityOptions] = useState<string[]>([])
  
  // State for loading options
  const [loadingOptions, setLoadingOptions] = useState<{
    categories: boolean;
    subcategories: boolean;
    conditions: boolean;
    availability: boolean;
  }>({ 
    categories: true, 
    subcategories: true, 
    conditions: true, 
    availability: true 
  })
  
  // State for new custom field inputs
  const [newCategory, setNewCategory] = useState('')
  const [newSubcategory, setNewSubcategory] = useState('')
  const [newCondition, setNewCondition] = useState('')
  const [newAvailability, setNewAvailability] = useState('')
  const [newSpecKey, setNewSpecKey] = useState('')
  const [newSpecValue, setNewSpecValue] = useState('')
  
  // Import the machinery options service
  const { 
    fetchMachineryOptions, 
    createMachineryOption 
  } = require('@/services/machineryOptionsService') as {
    fetchMachineryOptions: (type?: string) => Promise<Array<{value: string}>>,
    createMachineryOption: (option: {type: string, value: string}) => Promise<any>
  }
  
  // Load options from the API
  useEffect(() => {
    const loadOptions = async () => {
      try {
        // Load categories
        setLoadingOptions(prev => ({ ...prev, categories: true }))
        const categoryOptions = await fetchMachineryOptions('category')
        if (categoryOptions.length > 0) {
          setCategories(categoryOptions.map(option => option.value))
        } else {
          // Default categories if none exist
          setCategories(['Excavator', 'Bulldozer', 'Wheel Loader', 'Forklift', 'Crane', 'Truck'])
        }
        setLoadingOptions(prev => ({ ...prev, categories: false }))
        
        // Load subcategories
        setLoadingOptions(prev => ({ ...prev, subcategories: true }))
        const subcategoryOptions = await fetchMachineryOptions('subcategory')
        if (subcategoryOptions.length > 0) {
          setSubcategories(subcategoryOptions.map(option => option.value))
        } else {
          // Default subcategories if none exist
          setSubcategories(['Hydraulic', 'Mini', 'Crawler', 'Wheeled'])
        }
        setLoadingOptions(prev => ({ ...prev, subcategories: false }))
        
        // Load conditions
        setLoadingOptions(prev => ({ ...prev, conditions: true }))
        const conditionOptions = await fetchMachineryOptions('condition')
        if (conditionOptions.length > 0) {
          setConditions(conditionOptions.map(option => option.value))
        } else {
          // Default conditions if none exist
          setConditions(['New', 'Used - Like New', 'Used - Excellent', 'Used - Good', 'Used - Fair'])
        }
        setLoadingOptions(prev => ({ ...prev, conditions: false }))
        
        // Load availability options
        setLoadingOptions(prev => ({ ...prev, availability: true }))
        const availabilityOpts = await fetchMachineryOptions('availability')
        if (availabilityOpts.length > 0) {
          setAvailabilityOptions(availabilityOpts.map(option => option.value))
        } else {
          // Default availability options if none exist
          setAvailabilityOptions(['In Stock', 'On Order', 'Sold', 'Reserved'])
        }
        setLoadingOptions(prev => ({ ...prev, availability: false }))
      } catch (error) {
        console.error('Error loading machinery options:', error)
        // Set default values if API fails
        setCategories(['Excavator', 'Bulldozer', 'Wheel Loader', 'Forklift', 'Crane', 'Truck'])
        setSubcategories(['Hydraulic', 'Mini', 'Crawler', 'Wheeled'])
        setConditions(['New', 'Used - Like New', 'Used - Excellent', 'Used - Good', 'Used - Fair'])
        setAvailabilityOptions(['In Stock', 'On Order', 'Sold', 'Reserved'])
        
        // Reset loading states
        setLoadingOptions({
          categories: false,
          subcategories: false,
          conditions: false,
          availability: false
        })
      }
    }
    
    loadOptions()
  }, [])

  // Fetch existing item data if editing
  useEffect(() => {
    if (!isNewItem) {
      const fetchItemData = async () => {
        try {
          setIsLoading(true)
          setError(null)
          const item = await fetchMachineryItemById(params.id)
          // Convert the API response to match our FormDataType
          const formattedItem: FormDataType = {
            ...defaultFormData, // Start with default values
            ...item, // Override with API data
            // Ensure required fields have fallbacks
            subcategory: item.subcategory || '',
            priceJPY: item.priceJPY || '',
            weight: item.weight || '',
            images: item.images || [],
            tags: item.tags || [],
            specifications: item.specifications || {}
          }
          setFormData(formattedItem)
        } catch (err) {
          console.error('Error fetching machinery item:', err)
          setError('Failed to load machinery item data. Please try again.')
        } finally {
          setIsLoading(false)
        }
      }
      
      fetchItemData()
    }
  }, [isNewItem, params.id])
  
  // Update slug previews when name or category changes
  useEffect(() => {
    if (formData.name) {
      setPreviewSlug(slugify(formData.name))
    }
    if (formData.category) {
      setPreviewCategorySlug(slugify(formData.category))
    }
  }, [formData.name, formData.category])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear any error when user starts typing
    if (error) setError(null)
  }
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }))
  }
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear any error when user makes a selection
    if (error) setError(null)
  }
  
  const handleSpecificationChange = (key: string, value: string) => {
    setFormData(prev => {
      // Create a new specifications object with the updated value
      const updatedSpecifications = { ...prev.specifications, [key]: value };
      
      // Return the updated form data
      return {
        ...prev,
        specifications: updatedSpecifications
      };
    });
  }
  
  // Add a new category
  const addCategory = async () => {
    if (newCategory && !categories.includes(newCategory)) {
      try {
        // Add loading state
        setLoadingOptions(prev => ({ ...prev, categories: true }))
        
        // Save to API
        await createMachineryOption({
          type: 'category',
          value: newCategory
        })
        
        // Update local state
        setCategories([...categories, newCategory])
        setFormData(prev => ({ ...prev, category: newCategory }))
        setNewCategory('')
      } catch (error) {
        console.error('Error adding category:', error)
      } finally {
        setLoadingOptions(prev => ({ ...prev, categories: false }))
      }
    }
  }

  // Add a new subcategory
  const addSubcategory = async () => {
    if (newSubcategory && !subcategories.includes(newSubcategory)) {
      try {
        // Add loading state
        setLoadingOptions(prev => ({ ...prev, subcategories: true }))
        
        // Save to API
        await createMachineryOption({
          type: 'subcategory',
          value: newSubcategory
        })
        
        // Update local state
        setSubcategories([...subcategories, newSubcategory])
        setFormData(prev => ({ ...prev, subcategory: newSubcategory }))
        setNewSubcategory('')
      } catch (error) {
        console.error('Error adding subcategory:', error)
      } finally {
        setLoadingOptions(prev => ({ ...prev, subcategories: false }))
      }
    }
  }

  // Add a new condition
  const addCondition = async () => {
    if (newCondition && !conditions.includes(newCondition)) {
      try {
        // Add loading state
        setLoadingOptions(prev => ({ ...prev, conditions: true }))
        
        // Save to API
        await createMachineryOption({
          type: 'condition',
          value: newCondition
        })
        
        // Update local state
        setConditions([...conditions, newCondition])
        setFormData(prev => ({ ...prev, condition: newCondition }))
        setNewCondition('')
      } catch (error) {
        console.error('Error adding condition:', error)
      } finally {
        setLoadingOptions(prev => ({ ...prev, conditions: false }))
      }
    }
  }

  // Add a new availability option
  const addAvailability = async () => {
    if (newAvailability && !availabilityOptions.includes(newAvailability)) {
      try {
        // Add loading state
        setLoadingOptions(prev => ({ ...prev, availability: true }))
        
        // Save to API
        await createMachineryOption({
          type: 'availability',
          value: newAvailability
        })
        
        // Update local state
        setAvailabilityOptions([...availabilityOptions, newAvailability])
        setFormData(prev => ({ ...prev, availability: newAvailability }))
        setNewAvailability('')
      } catch (error) {
        console.error('Error adding availability option:', error)
      } finally {
        setLoadingOptions(prev => ({ ...prev, availability: false }))
      }
    }
  }

  // Add a new specification
  const addSpecification = () => {
    if (newSpecKey && newSpecValue) {
      setFormData(prev => {
        const updatedSpecifications = { ...prev.specifications, [newSpecKey]: newSpecValue }
        return { ...prev, specifications: updatedSpecifications }
      })
      setNewSpecKey('')
      setNewSpecValue('')
    }
  }

  // Remove a specification
  const removeSpecification = (key: string) => {
    setFormData(prev => {
      const updatedSpecifications = { ...prev.specifications }
      delete updatedSpecifications[key]
      return { ...prev, specifications: updatedSpecifications }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      // Validate required fields
      if (!formData.name || !formData.category || !formData.manufacturer || !formData.modelNumber) {
        setError('Please fill in all required fields')
        setIsLoading(false)
        return
      }
      
      // No need to save options here as they're already saved to the database when added
      
      // Prepare data for submission - make images optional
      const submissionData = {
        ...formData,
        // If images is empty array, don't include it
        images: formData.images && formData.images.length > 0 ? formData.images : undefined
      }
      
      // Submit to API
      if (isNewItem) {
        await createMachineryItem(submissionData)
      } else {
        await updateMachineryItem(params.id, submissionData)
      }
      
      // Redirect on success
      router.push('/admin/content/machinery-management')
    } catch (error: any) {
      console.error('Error saving machinery item:', error)
      setError(error.message || 'Failed to save machinery item. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Show loading state when initially loading data
  if (isLoading && !isNewItem) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Loading machinery item data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {isNewItem ? 'Add New Machinery Item' : 'Edit Machinery Item'}
          </h1>
        </div>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Item
            </>
          )}
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">
            <div className="flex items-center gap-2">
              Basic Information
              {(!formData.name || !formData.category || !formData.manufacturer || !formData.modelNumber) && (
                <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center rounded-full">!</Badge>
              )}
            </div>
          </TabsTrigger>
          <TabsTrigger value="details">Details & Specifications</TabsTrigger>
          <TabsTrigger value="media">Images & Media</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Machinery Name <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="e.g., Komatsu PC200-8 Hydraulic Excavator"
                  className={!formData.name ? "border-red-300" : ""}
                  required
                />
                {formData.name && (
                  <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    URL Slug: <code className="bg-slate-100 px-1 py-0.5 rounded">{previewSlug}</code>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => handleSelectChange('category', value)}
                      disabled={loadingOptions.categories}
                    >
                      <SelectTrigger className={`flex-1 ${!formData.category ? "border-red-300" : ""}`}>
                        {loadingOptions.categories ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Loading...</span>
                          </div>
                        ) : (
                          <SelectValue placeholder="Select category" />
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.category && (
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      URL Path: <code className="bg-slate-100 px-1 py-0.5 rounded">{previewCategorySlug}</code>
                    </div>
                  )}
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Add new category"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      disabled={loadingOptions.categories}
                    />
                    <Button 
                      type="button" 
                      size="sm" 
                      onClick={addCategory}
                      disabled={!newCategory || loadingOptions.categories}
                    >
                      {loadingOptions.categories ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <div className="flex gap-2">
                    <Select 
                      value={formData.subcategory} 
                      onValueChange={(value) => handleSelectChange('subcategory', value)}
                      disabled={loadingOptions.subcategories}
                    >
                      <SelectTrigger className="flex-1">
                        {loadingOptions.subcategories ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Loading...</span>
                          </div>
                        ) : (
                          <SelectValue placeholder="Select subcategory" />
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        {subcategories.map((subcategory) => (
                          <SelectItem key={subcategory} value={subcategory}>{subcategory}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.subcategory && (
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      Selected: <span className="font-medium">{formData.subcategory}</span>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Optional: Specify a subcategory for more precise classification
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Add new subcategory"
                      value={newSubcategory}
                      onChange={(e) => setNewSubcategory(e.target.value)}
                      disabled={loadingOptions.subcategories}
                    />
                    <Button 
                      type="button" 
                      size="sm" 
                      onClick={addSubcategory}
                      disabled={!newSubcategory || loadingOptions.subcategories}
                      title="Add new subcategory"
                    >
                      {loadingOptions.subcategories ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">
                    Manufacturer <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="manufacturer" 
                    name="manufacturer" 
                    value={formData.manufacturer} 
                    onChange={handleInputChange} 
                    placeholder="e.g., Komatsu"
                    className={!formData.manufacturer ? "border-red-300" : ""}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="modelNumber">
                    Model Number <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="modelNumber" 
                    name="modelNumber" 
                    value={formData.modelNumber} 
                    onChange={handleInputChange} 
                    placeholder="e.g., PC200-8"
                    className={!formData.modelNumber ? "border-red-300" : ""}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">
                    Year <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="year" 
                    name="year" 
                    type="number" 
                    value={formData.year} 
                    onChange={handleInputChange} 
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Year of manufacture
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hours">
                    Hours <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="hours" 
                    name="hours" 
                    type="number" 
                    value={formData.hours} 
                    onChange={handleInputChange} 
                    min="0"
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Operating hours (0 for new machinery)
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">
                    Price (USD) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                    <Input 
                      id="price" 
                      name="price" 
                      type="number" 
                      value={formData.price} 
                      onChange={handleInputChange} 
                      className="pl-6 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      min="0"
                      step="100"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Price in USD (without commas or currency symbol)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priceJPY">Price (JPY)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-500">¥</span>
                    <Input 
                      id="priceJPY" 
                      name="priceJPY" 
                      value={formData.priceJPY} 
                      onChange={handleInputChange} 
                      className="pl-6"
                      placeholder="e.g., 8,250,000"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Optional: Price in Japanese Yen
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="location" 
                    name="location" 
                    value={formData.location} 
                    onChange={handleInputChange} 
                    placeholder="e.g., Osaka, Japan"
                    className={!formData.location ? "border-red-300" : ""}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Current location of the machinery
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight</Label>
                  <Input 
                    id="weight" 
                    name="weight" 
                    value={formData.weight} 
                    onChange={handleInputChange} 
                    placeholder="e.g., 20 tons"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Optional: Weight of the machinery
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="condition">
                  Condition <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <Select 
                    value={formData.condition} 
                    onValueChange={(value) => handleSelectChange('condition', value)}
                    disabled={loadingOptions.conditions}
                  >
                    <SelectTrigger className={`flex-1 ${!formData.condition ? "border-red-300" : ""}`}>
                      {loadingOptions.conditions ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Loading...</span>
                        </div>
                      ) : (
                        <SelectValue placeholder="Select condition" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((condition) => (
                        <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Current condition of the machinery
                </p>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Add new condition"
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    disabled={loadingOptions.conditions}
                  />
                  <Button 
                    type="button" 
                    size="sm" 
                    onClick={addCondition}
                    disabled={!newCondition || loadingOptions.conditions}
                  >
                    {loadingOptions.conditions ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="availability">
                  Availability <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <Select 
                    value={formData.availability} 
                    onValueChange={(value) => handleSelectChange('availability', value)}
                    disabled={loadingOptions.availability}
                  >
                    <SelectTrigger className={`flex-1 ${!formData.availability ? "border-red-300" : ""}`}>
                      {loadingOptions.availability ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Loading...</span>
                        </div>
                      ) : (
                        <SelectValue placeholder="Select availability" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {availabilityOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${option === 'In Stock' ? 'bg-green-500' : option === 'Sold' ? 'bg-red-500' : 'bg-amber-500'}`} />
                            {option}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Current availability status
                </p>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Add new availability option"
                    value={newAvailability}
                    onChange={(e) => setNewAvailability(e.target.value)}
                    disabled={loadingOptions.availability}
                  />
                  <Button 
                    type="button" 
                    size="sm" 
                    onClick={addAvailability}
                    disabled={!newAvailability || loadingOptions.availability}
                  >
                    {loadingOptions.availability ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <Card className="border-dashed">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {formData.featured ? (
                        <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                      ) : (
                        <StarOff className="h-5 w-5 text-slate-400" />
                      )}
                      <div>
                        <Label htmlFor="featured" className="cursor-pointer font-medium">
                          Featured Item
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Featured items appear at the top of listings and on the homepage
                        </p>
                      </div>
                    </div>
                    <Switch 
                      id="featured" 
                      checked={formData.featured} 
                      onCheckedChange={(checked) => handleSwitchChange('featured', checked)} 
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="details" className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                placeholder="Detailed description of the machinery item"
                className={`min-h-32 ${!formData.description ? "border-red-300" : ""}`}
                required
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground mt-1">
                  Detailed description of the machinery's features and condition
                </p>
                <p className="text-xs text-muted-foreground">
                  {formData.description?.length || 0} characters
                </p>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Specifications</h3>
                <p className="text-xs text-muted-foreground">
                  {Object.keys(formData.specifications || {}).length} specifications
                </p>
              </div>
              
              <Card className="border-dashed">
                <CardContent className="p-6 space-y-4">
                  {!formData.specifications || Object.keys(formData.specifications).length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      No specifications added yet. Add technical details below.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Display existing specifications */}
                      {Object.entries(formData.specifications || {}).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2 bg-slate-50 p-3 rounded-md">
                          <div className="flex-1 grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <Label htmlFor={`spec-${key}-key`} className="text-xs text-muted-foreground">
                                Specification
                              </Label>
                              <Input 
                                id={`spec-${key}-key`}
                                value={key}
                                disabled
                                className="bg-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor={`spec-${key}-value`} className="text-xs text-muted-foreground">
                                Value
                              </Label>
                              <Input 
                                id={`spec-${key}-value`}
                                value={value as string}
                                onChange={(e) => handleSpecificationChange(key, e.target.value)}
                                className="bg-white"
                              />
                            </div>
                          </div>
                          <Button 
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-6"
                            onClick={() => removeSpecification(key)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Add new specification */}
                  <div className="pt-4">
                    <Label className="font-medium mb-2 block">Add New Specification</Label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <div>
                          <Input 
                            id="new-spec-key"
                            placeholder="e.g., Engine, Power, etc."
                            value={newSpecKey}
                            onChange={(e) => setNewSpecKey(e.target.value)}
                          />
                        </div>
                        <div>
                          <Input 
                            id="new-spec-value"
                            placeholder="e.g., Komatsu SAA6D107E-1, 155 HP, etc."
                            value={newSpecValue}
                            onChange={(e) => setNewSpecValue(e.target.value)}
                          />
                        </div>
                      </div>
                      <Button 
                        type="button"
                        size="sm"
                        onClick={addSpecification}
                        disabled={!newSpecKey || !newSpecValue}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Separator className="my-6" />
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <span className="text-xs text-muted-foreground">
                  {formData.tags.length} tags
                </span>
              </div>
              <Input 
                id="tags" 
                name="tags" 
                value={formData.tags.join(', ')} 
                onChange={(e) => {
                  const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                  setFormData(prev => {
                    return {
                      ...prev,
                      tags: tagsArray
                    };
                  });
                }} 
                placeholder="e.g., hydraulic, medium, tracked, construction"
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="px-2 py-1">
                    {tag}
                  </Badge>
                ))}
                {formData.tags.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Add tags to help buyers find this machinery item
                  </p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="media" className="space-y-4 pt-4">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Machinery Images</h3>
              <p className="text-xs text-muted-foreground">
                {formData.images?.length || 0} images
              </p>
            </div>
            
            <Alert className="mb-4 bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">Images are optional</AlertTitle>
              <AlertDescription className="text-blue-700">
                You can add machinery images later. The form can be submitted without images.
                Good quality images help sell machinery faster.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(formData.images || []).map((image, index) => (
                <Card key={index} className="overflow-hidden border-slate-200 hover:border-slate-300 transition-colors">
                  <div className="relative aspect-square">
                    <img 
                      src={image} 
                      alt={`Machinery image ${index + 1}`} 
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-0 left-0 bg-black/50 text-white px-2 py-1 text-xs">
                      {index === 0 ? 'Primary' : `Image ${index + 1}`}
                    </div>
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white text-red-500 hover:text-red-700"
                      onClick={() => {
                        const currentImages = formData.images || [];
                        const newImages = [...currentImages];
                        newImages.splice(index, 1);
                        setFormData(prev => {
                          return {
                            ...prev,
                            images: newImages
                          };
                        });
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardFooter className="p-3 flex justify-between items-center bg-slate-50">
                    <p className="text-xs text-muted-foreground">{image.split('/').pop()?.substring(0, 20) || `Image ${index + 1}`}</p>
                    {index !== 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          const newImages = [...formData.images];
                          const temp = newImages[0];
                          newImages[0] = newImages[index];
                          newImages[index] = temp;
                          setFormData(prev => ({ ...prev, images: newImages }));
                        }}
                        title="Make primary image"
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
              
              <Card className="flex flex-col items-center justify-center aspect-square border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer">
                <CardContent className="flex flex-col items-center justify-center h-full py-6">
                  <div className="rounded-full bg-slate-100 p-4 mb-4">
                    <ImagePlus className="h-6 w-6 text-slate-500" />
                  </div>
                  <p className="text-sm font-medium mb-1">Add Images</p>
                  <p className="text-xs text-muted-foreground text-center">
                    Drag & drop or click to upload
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="pt-4 bg-slate-50 p-4 rounded-md">
              <h4 className="font-medium mb-2 text-sm">Image Guidelines</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                <li>Recommended image size: 1200x800 pixels</li>
                <li>Maximum file size: 5MB per image</li>
                <li>Supported formats: JPG, PNG, WebP</li>
                <li>Include multiple angles of the machinery</li>
                <li>Ensure good lighting and clear visibility of important features</li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
