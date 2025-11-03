// Category service for fetching categories from the API

export interface Category {
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

/**
 * Fetch all categories from the API
 * @param params Optional query parameters
 * @returns Array of categories
 */
export async function fetchCategories(params?: {
  parentId?: string | null;
  isActive?: boolean;
}): Promise<Category[]> {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams();
    if (params?.parentId !== undefined) {
      queryParams.append('parentId', params.parentId === null ? 'null' : params.parentId);
    }
    if (params?.isActive !== undefined) {
      queryParams.append('isActive', params.isActive.toString());
    }

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    // Fetch categories from API
    const response = await fetch(`/api/admin/categories${queryString}`, {
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
      throw new Error('Failed to fetch categories');
    }

    const data = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return []; // Return empty array on error
  }
}

/**
 * Fetch a single category by ID
 * @param id Category ID
 * @returns Category or null if not found
 */
export async function fetchCategoryById(id: string): Promise<Category | null> {
  try {
    const response = await fetch(`/api/admin/categories/${id}`, {
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
      throw new Error('Failed to fetch category');
    }

    const data = await response.json();
    return data.category || null;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

/**
 * Fetch public categories for frontend display
 * Only returns active categories
 * @returns Array of categories
 */
export async function fetchPublicCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`/api/content/categories`, {
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
      throw new Error('Failed to fetch public categories');
    }

    const data = await response.json();
    return data.success && Array.isArray(data.categories) ? data.categories : [];
  } catch (error) {
    console.error('Error fetching public categories:', error);
    return []; // Return empty array on error
  }
}
