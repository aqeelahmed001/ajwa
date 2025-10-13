import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

/**
 * Helper function to check if the current user is authenticated as an admin
 * @returns An unauthorized response or null if authenticated
 */
export async function checkAdminAuth() {
  const session = await getServerSession(authOptions);
  
  // Check if the user is authenticated and has admin role
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  return null; // Auth check passed
}
