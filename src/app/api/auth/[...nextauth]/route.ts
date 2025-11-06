import { NextRequest, NextResponse } from "next/server";

// This route is kept for backward compatibility
// It redirects to our new auth endpoints

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const callbackUrl = url.searchParams.get('callbackUrl') || '/admin';
  
  // Redirect to admin login page
  return NextResponse.redirect(new URL(callbackUrl, request.url));
}

export async function POST(request: NextRequest) {
  // For POST requests, redirect to our new login endpoint
  return NextResponse.redirect(new URL('/api/auth/login', request.url));
}
