interface PublicMachineryItem {
  id: string
  slug: string
  categorySlug: string
  name: string
  category: string
  subcategory?: string
  manufacturer: string
  modelNumber: string
  year: number
  hours: number
  price: number
  priceFormatted?: string
  priceJPY?: string
  images: string[]
  location: string
  condition: string
  weight?: string
  featured: boolean
  availability: string
  description: string
  specifications: Record<string, string>
  tags?: string[]
}

// Fetch all machinery items for public display
export async function fetchPublicMachineryItems(
  category?: string,
  featured?: boolean
): Promise<PublicMachineryItem[]> {
  const queryParams = new URLSearchParams();
  if (category) queryParams.append('category', category);
  if (featured) queryParams.append('featured', 'true');
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  
  try {
    const response = await fetch(`/api/content/machinery${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
      cache: 'no-store',
      next: { revalidate: 0 },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch machinery items');
    }
    
    const data = await response.json();
    return data.success && Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error('Error fetching public machinery items:', error);
    return []; // Return empty array on error
  }
}

// Fetch a single machinery item by ID for public display
export async function fetchPublicMachineryItemById(id: string): Promise<PublicMachineryItem | null> {
  try {
    const response = await fetch(`/api/content/machinery/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
      cache: 'no-store',
      next: { revalidate: 0 },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch machinery item');
    }
    
    const data = await response.json();
    return data.success && data.data ? data.data : null;
  } catch (error) {
    console.error('Error fetching public machinery item:', error);
    return null; // Return null on error
  }
}

// Fetch unique categories
export async function fetchPublicCategories(): Promise<string[]> {
  try {
    const items = await fetchPublicMachineryItems();
    const categorySet = new Set(items.map(item => item.category));
    return Array.from(categorySet);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Fetch unique manufacturers
export async function fetchPublicManufacturers(): Promise<string[]> {
  try {
    const items = await fetchPublicMachineryItems();
    const manufacturerSet = new Set(items.map(item => item.manufacturer));
    return Array.from(manufacturerSet);
  } catch (error) {
    console.error('Error fetching manufacturers:', error);
    return [];
  }
}

// Fetch unique years
export async function fetchPublicYears(): Promise<number[]> {
  try {
    const items = await fetchPublicMachineryItems();
    const yearSet = new Set(items.map(item => item.year));
    return Array.from(yearSet).sort((a, b) => b - a); // Sort years in descending order
  } catch (error) {
    console.error('Error fetching years:', error);
    return [];
  }
}

// Fetch unique conditions
export async function fetchPublicConditions(): Promise<string[]> {
  try {
    const items = await fetchPublicMachineryItems();
    const conditionSet = new Set(items.map(item => item.condition));
    return Array.from(conditionSet);
  } catch (error) {
    console.error('Error fetching conditions:', error);
    return [];
  }
}
