import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const path = url.pathname;
  const authCookie = request.cookies.get('admin-auth')?.value;
  
  // Protect admin routes
  if (path.startsWith('/admin')) {
    // Allow access to login page
    if (path === '/admin') {
      return NextResponse.next();
    }
    
    // Check authentication for all other admin routes
    if (!authCookie) {
      // If not authenticated, redirect to the admin login page
      return NextResponse.redirect(new URL('/admin', url));
    }
  }
  
  // For API routes that require authentication
  if (path.startsWith('/api/admin')) {
    // If not authenticated, return 401 Unauthorized
    if (!authCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

// Configure the paths that should trigger this middleware
export const config = {
  matcher: [
    // Match all paths
    '/(.*)',
  ],
};
