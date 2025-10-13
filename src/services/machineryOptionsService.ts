export interface MachineryOption {
  _id?: string;
  id?: string;
  type: 'category' | 'subcategory' | 'condition' | 'availability';
  value: string;
  count: number;
  createdAt?: string;
  updatedAt?: string;
}

// Fetch all options or filter by type
export async function fetchMachineryOptions(type?: string): Promise<MachineryOption[]> {
  try {
    const queryParams = type ? `?type=${type}` : '';
    const response = await fetch(`/api/admin/machinery-options${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch machinery options');
    }

    const data = await response.json();
    return data.success && Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error('Error fetching machinery options:', error);
    return []; // Return empty array on error
  }
}

// Create a new option
export async function createMachineryOption(option: { type: string; value: string }): Promise<MachineryOption | null> {
  try {
    const response = await fetch('/api/admin/machinery-options', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(option),
    });

    if (!response.ok) {
      const errorData = await response.json();
      // If it's a duplicate, the API will return the existing option
      if (response.status === 409 && errorData.data) {
        return errorData.data;
      }
      throw new Error(errorData.message || 'Failed to create machinery option');
    }

    const data = await response.json();
    return data.success && data.data ? data.data : null;
  } catch (error) {
    console.error('Error creating machinery option:', error);
    throw error;
  }
}

// Update an option
export async function updateMachineryOption(id: string, value: string): Promise<MachineryOption | null> {
  try {
    const response = await fetch(`/api/admin/machinery-options/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value }),
    });

    if (!response.ok) {
      throw new Error('Failed to update machinery option');
    }

    const data = await response.json();
    return data.success && data.data ? data.data : null;
  } catch (error) {
    console.error('Error updating machinery option:', error);
    throw error;
  }
}

// Delete an option
export async function deleteMachineryOption(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/admin/machinery-options/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete machinery option');
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error deleting machinery option:', error);
    throw error;
  }
}
