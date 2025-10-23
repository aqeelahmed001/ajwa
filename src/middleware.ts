import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  const path = url.pathname;
  
  // Check if we're on the admin subdomain
  const isAdminSubdomain = hostname.startsWith('admin.');
  
  // Handle admin subdomain routing
  if (isAdminSubdomain) {
    // If the path already starts with /admin, we need to avoid duplication
    if (path.startsWith('/admin/')) {
      // Path already has /admin/, so we need to strip it to avoid duplication
      const strippedPath = path.replace(/^\/admin/, '');
      const newUrl = new URL(`/admin${strippedPath}`, url);
      return NextResponse.rewrite(newUrl);
    } else if (path === '/admin') {
      // Handle the root admin path
      const newUrl = new URL('/admin', url);
      return NextResponse.rewrite(newUrl);
    } else {
      // Normal case - rewrite to /admin path
      const newUrl = new URL(`/admin${path}`, url);
      return NextResponse.rewrite(newUrl);
    }
  }
  
  // For the main domain, protect admin routes
  if (path.startsWith('/admin')) {
    // In production, redirect admin paths on main domain to the admin subdomain
    if (process.env.NODE_ENV === 'production' && !isAdminSubdomain) {
      // Strip /admin prefix to avoid duplication
      const strippedPath = path.replace(/^\/admin/, '');
      const adminUrl = new URL(strippedPath, url);
      adminUrl.host = `admin.${hostname}`;
      return NextResponse.redirect(adminUrl);
    }
    
    // For development or the login page, check authentication
    if (path !== '/admin') {
      const authCookie = request.cookies.get('admin-auth')?.value;
      
      // If not authenticated, redirect to the admin login page
      if (!authCookie) {
        return NextResponse.redirect(new URL('/admin', url));
      }
    }
  }
  
  // For API routes that require authentication
  if (path.startsWith('/api/admin')) {
    const authCookie = request.cookies.get('admin-auth')?.value;
    
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
