import { MachineryItem } from '@/models/MachineryItem';

// Fetch all machinery items
export async function fetchMachineryItems(
  category?: string,
  featured?: boolean
): Promise<MachineryItem[]> {
  const queryParams = new URLSearchParams();
  if (category) queryParams.append('category', category);
  if (featured) queryParams.append('featured', 'true');
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  
  const response = await fetch(`/api/admin/machinery${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch machinery items');
  }
  
  const data = await response.json();
  return data.items;
}

// Fetch a single machinery item by ID
export async function fetchMachineryItemById(id: string): Promise<MachineryItem> {
  try {
    console.log(`Fetching machinery item with ID: ${id}`);
    
    const response = await fetch(`/api/admin/machinery/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    console.log(`Fetch response status: ${response.status}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error response:', errorData);
      throw new Error(errorData.error || 'Failed to fetch machinery item');
    }
    
    const data = await response.json();
    console.log('Machinery item fetched successfully');
    
    // Ensure the item has all required fields with defaults
    const item = data.item || {};
    
    // Add default values for any missing fields
    return {
      id: item.id || item._id || '',
      slug: item.slug || '',
      categorySlug: item.categorySlug || '',
      name: item.name || '',
      category: item.category || '',
      subcategory: item.subcategory || '',
      manufacturer: item.manufacturer || '',
      modelNumber: item.modelNumber || '',
      year: item.year || 0,
      hours: item.hours || 0,
      price: item.price || 0,
      priceFormatted: item.priceFormatted || '',
      priceJPY: item.priceJPY || '',
      images: item.images || [],
      location: item.location || '',
      condition: item.condition || '',
      weight: item.weight || '',
      featured: item.featured || false,
      availability: item.availability || 'In Stock',
      description: item.description || '',
      specifications: item.specifications || {},
      tags: item.tags || [],
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  } catch (error) {
    console.error('Error in fetchMachineryItemById:', error);
    throw error;
  }
}

// Create a new machinery item
export async function createMachineryItem(item: Partial<MachineryItem>): Promise<MachineryItem> {
  const response = await fetch('/api/admin/machinery', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create machinery item');
  }
  
  const data = await response.json();
  return data.item;
}

// Update an existing machinery item
export async function updateMachineryItem(
  id: string,
  item: Partial<MachineryItem>
): Promise<MachineryItem> {
  const response = await fetch(`/api/admin/machinery/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update machinery item');
  }
  
  const data = await response.json();
  return data.item;
}

// Delete a machinery item
export async function deleteMachineryItem(id: string): Promise<void> {
  const response = await fetch(`/api/admin/machinery/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete machinery item');
  }
}

// Fetch unique categories
export async function fetchCategories(): Promise<string[]> {
  const items = await fetchMachineryItems();
  const categorySet = new Set(items.map(item => item.category));
  return Array.from(categorySet);
}

// Fetch unique subcategories for a given category
export async function fetchSubcategories(category: string): Promise<string[]> {
  const items = await fetchMachineryItems(category);
  const subcategorySet = new Set<string>();
  
  // Filter out undefined values and add valid subcategories to the set
  items.forEach(item => {
    if (item.subcategory) {
      subcategorySet.add(item.subcategory);
    }
  });
  
  return Array.from(subcategorySet);
}

// Fetch unique conditions
export async function fetchConditions(): Promise<string[]> {
  const items = await fetchMachineryItems();
  const conditionSet = new Set(items.map(item => item.condition));
  return Array.from(conditionSet);
}

// Fetch unique availability options
export async function fetchAvailabilityOptions(): Promise<string[]> {
  const items = await fetchMachineryItems();
  const availabilitySet = new Set(items.map(item => item.availability));
  return Array.from(availabilitySet);
}
