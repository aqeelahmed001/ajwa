import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const path = url.pathname;
  // Check for any NextAuth.js cookie that indicates authentication
  const nextAuthCookieNames = [
    'next-auth.session-token',
    '__Secure-next-auth.session-token',
    '__Host-next-auth.session-token',
    'next-auth.callback-url',
    'next-auth.csrf-token',
    '__Secure-next-auth.callback-url',
    'next-auth.pkce.code_verifier'
  ];
  
  // Check if any NextAuth cookie exists
  let authCookie = false;
  for (const cookieName of nextAuthCookieNames) {
    if (request.cookies.has(cookieName)) {
      authCookie = true;
      console.log(`Found NextAuth cookie: ${cookieName}`);
      break;
    }
  }
  
  // Block access to setup page - it's not needed
  if (path === '/admin/setup') {
    return NextResponse.redirect(new URL('/admin', url));
  }
  
  // Protect admin routes
  if (path.startsWith('/admin')) {
    // Allow access to login page without authentication
    if (path === '/admin') {
      return NextResponse.next();
    }
    
    // Check authentication for all other admin routes
    console.log('Middleware - Checking auth for path:', path);
    console.log('Middleware - Auth cookie exists:', authCookie);
  
    // For dashboard and all other admin routes, check for auth cookie
    if (!authCookie) {
      console.log('Middleware - No auth cookie, redirecting to login');
      // If not authenticated, redirect to the admin login page
      return NextResponse.redirect(new URL('/admin', url));
    }
    
    // If authenticated, allow access to admin routes
    console.log(`Middleware - Auth cookie found, allowing access to: ${path}`);
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
      console.log('Middleware - Allowing public access to content API:', path);
      return NextResponse.next();
    }
    
    // For other admin APIs, check auth cookie
    if (!authCookie) {
      console.log('Middleware - No auth cookie for API route:', path);
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
