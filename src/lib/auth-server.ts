// This file is kept for backward compatibility
// Most functionality has been moved to jwt.ts
import { connectToDatabase } from '@/lib/mongodb';

// Define types for auth - kept for backward compatibility
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin?: Date;
}

// Export a dummy authOptions object for backward compatibility
// This is not used anymore but prevents import errors in existing code
export const authOptions = {
  // This is a dummy object that should not be used
  _dummyProp: true
};

// This function is now implemented in jwt.ts
// We're keeping this stub for backward compatibility
export async function getCurrentUserServer(): Promise<AuthUser | null> {
  try {
    // Import the real implementation from jwt.ts
    const { getCurrentUserServer: getUser } = await import('./jwt');
    return await getUser() as unknown as AuthUser | null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}