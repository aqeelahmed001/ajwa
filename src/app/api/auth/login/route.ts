import { NextRequest, NextResponse } from 'next/server';
import { signIn } from 'next-auth/react';

// This route is kept for backwards compatibility
// It redirects to the NextAuth.js signin endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Simple validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Instead of custom auth, redirect to use NextAuth
    // This is a server-side API route, so we can't directly use signIn
    // Instead, we'll return a response instructing the client to redirect
    return NextResponse.json({
      success: true,
      message: 'Please use NextAuth.js endpoint',
      redirect: '/api/auth/signin',
      credentials: { email, password }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
