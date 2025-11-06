import { NextResponse } from 'next/server';
import { getCsrfToken } from 'next-auth/react';

// This endpoint provides a CSRF token for client-side operations
export async function GET() {
  try {
    // Get the CSRF token
    const csrfToken = await getCsrfToken();
    
    return NextResponse.json({ csrfToken });
  } catch (error) {
    console.error('Error getting CSRF token:', error);
    return NextResponse.json({ error: 'Failed to get CSRF token' }, { status: 500 });
  }
}
