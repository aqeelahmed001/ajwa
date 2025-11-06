import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/jwt';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const path = url.pathname;
  
  // Check for auth token
  const authToken = request.cookies.get('auth-token')?.value;
  
  // Log cookie information for debugging
  console.log('Auth token:', authToken ? 'Found' : 'Not found');
  
  // In development mode, also log all cookies
  if (process.env.NODE_ENV === 'development') {
    console.log('All cookies:', request.cookies.getAll().map(c => c.name));
  }
  
  // Block access to setup page - it's not needed
  if (path === '/admin/setup') {
    return NextResponse.redirect(new URL('/admin', url));
  }
  
  // Protect admin routes
  if (path.startsWith('/admin')) {
    // Always allow access to login page, auth API routes, and static assets without authentication
    if (path === '/admin' || 
        path.includes('/_next/') || 
        path.includes('/favicon.ico') || 
        path.includes('/api/auth/')) {
      return NextResponse.next();
    }
    
    // For dashboard and all other admin routes, check for auth token
    if (!authToken) {
      console.log('No auth token found, checking for development bypass');
      
      // In development, check if we should bypass auth for testing
      if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
        console.log('Auth bypass enabled in development mode');
        return NextResponse.next();
      }
      
      console.log('Redirecting to login page');
      return NextResponse.redirect(new URL('/admin', url));
    }
    
    // Verify the token
    try {
      const user = await verifyToken(authToken);
      if (user === null) {
        console.log('Invalid auth token, redirecting to login');
        return NextResponse.redirect(new URL('/admin', url));
      }
      
      // If token is valid, allow access
      console.log('Valid auth token, allowing access for user:', user.email);
      return NextResponse.next();
    } catch (error) {
      console.error('Error verifying token:', error);
      return NextResponse.redirect(new URL('/admin', url));
    }
  }
  
  // Block access to setup API - it's not needed
  if (path === '/api/admin/setup') {
    return NextResponse.json({ error: 'Setup endpoint is disabled' }, { status: 404 });
  }
  
  // For API routes that require authentication
  if (path.startsWith('/api/admin')) {
    // Allow access to auth-related API routes
    if (path.startsWith('/api/auth/')) {
      return NextResponse.next();
    }
    
    // Allow public access to content API for read operations
    if (path.startsWith('/api/admin/content') && request.method === 'GET') {
      return NextResponse.next();
    }
    
    // For other admin APIs, check auth token
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Verify the token
    try {
      const user = await verifyToken(authToken);
      if (user === null) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
      
      // If token is valid, allow access
      return NextResponse.next();
    } catch (error) {
      console.error('Error verifying token for API access:', error);
      return NextResponse.json({ error: 'Authentication error' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

// Configure the paths that should trigger this middleware
export const config = {
  matcher: [
    // Match admin routes
    '/admin/:path*',
    // Match admin API routes
    '/api/admin/:path*',
    // Exclude Next.js static files and API auth routes
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
