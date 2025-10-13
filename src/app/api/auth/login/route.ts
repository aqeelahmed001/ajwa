import { NextRequest, NextResponse } from 'next/server';

// In a real application, you would:
// 1. Store user credentials securely (hashed passwords in a database)
// 2. Use a proper authentication library like NextAuth.js
// 3. Implement JWT or session-based authentication

// This is a simplified example for demonstration
const ADMIN_EMAIL = 'admin@ajwatrading.com';
const ADMIN_PASSWORD = 'admin123'; // In production, never hardcode passwords

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

    // Simple authentication check
    // In production, use proper authentication with password hashing
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Create a simple session cookie
      // In production, use a proper JWT or session management
      const response = NextResponse.json(
        { success: true, message: 'Login successful' },
        { status: 200 }
      );

      // Set a simple auth cookie
      // In production, use secure, httpOnly cookies with proper expiration
      response.cookies.set('admin-auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });

      return response;
    }

    // Authentication failed
    return NextResponse.json(
      { success: false, message: 'Invalid email or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
