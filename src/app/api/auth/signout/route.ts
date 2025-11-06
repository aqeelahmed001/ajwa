import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/jwt';

// This endpoint redirects to our new logout endpoint
export async function POST(request: NextRequest) {
  try {
    // Redirect to the new logout endpoint
    return NextResponse.redirect(new URL('/api/auth/logout', request.url));
  } catch (error) {
    console.error('Signout error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred during signout' },
      { status: 500 }
    );
  }
}
