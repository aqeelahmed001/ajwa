import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    console.log('/api/auth/me endpoint called');
    
    // Log all cookies for debugging
    console.log('Cookies in request:', request.cookies.getAll().map(c => c.name));
    console.log('Auth token cookie:', request.cookies.get('auth-token'));
    
    // Get the current user from the request
    const user = await getCurrentUser(request);
    console.log('User from getCurrentUser:', user);
    
    if (!user) {
      console.log('No user found, returning 401');
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    console.log('User authenticated, returning user data');
    return NextResponse.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error getting current user:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while getting user data' },
      { status: 500 }
    );
  }
}
