import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie, getCurrentUser } from '@/lib/jwt';
import { logActivity } from '@/lib/activityLogger';

export async function POST(request: NextRequest) {
  try {
    // Get the current user from the request
    const user = await getCurrentUser(request);
    
    if (user?.id) {
      // Log the logout activity
      try {
        await logActivity(
          user.id,
          'logout',
          'User logged out',
          request as any
        );
      } catch (logError) {
        console.error('Error logging logout activity:', logError);
      }
    }
    
    // Create a response that will clear the auth cookie
    const response = NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );
    
    // Clear the auth cookie
    clearAuthCookie(response);
    
    // Also clear any remaining NextAuth cookies for clean transition
    const cookiesToClear = [
      'next-auth.session-token',
      '__Secure-next-auth.session-token',
      '__Host-next-auth.session-token',
      'next-auth.csrf-token',
      'next-auth.callback-url',
      '__Secure-next-auth.callback-url',
      'next-auth.pkce.code_verifier'
    ];
    
    for (const cookieName of cookiesToClear) {
      response.cookies.delete(cookieName);
    }
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred during logout' },
      { status: 500 }
    );
  }
}
