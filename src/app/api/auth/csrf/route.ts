import { NextResponse } from 'next/server';
import crypto from 'crypto';

// This endpoint provides a CSRF token for client-side operations
export async function GET() {
  try {
    // Generate a random CSRF token
    const csrfToken = crypto.randomBytes(32).toString('hex');
    
    // Return the token in the response
    return NextResponse.json({ csrfToken });
  } catch (error) {
    console.error('Error generating CSRF token:', error);
    return NextResponse.json({ error: 'Failed to generate CSRF token' }, { status: 500 });
  }
}
