import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-server';
import { logActivity } from '@/lib/activityLogger';

export async function POST(request: Request) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    
    if (session?.user?.id) {
      // Log the logout activity
      try {
        await logActivity(
          session.user.id,
          'logout',
          'User logged out',
          request as any
        );
      } catch (logError) {
        console.error('Error logging logout activity:', logError);
      }
    }
    
    // Create a response that will clear all auth cookies
    const response = NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );
    
    // Clear all NextAuth cookies
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
      { success: false, message: 'An error occurred during logout' },
      { status: 500 }
    );
  }
}
