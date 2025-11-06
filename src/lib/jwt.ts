import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export interface UserJwtPayload {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
}

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-production';

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.warn('WARNING: JWT_SECRET is not set in production environment');
}

// Token expiration time (24 hours in seconds)
const TOKEN_EXPIRATION = 24 * 60 * 60;

/**
 * Create a JWT token for a user
 */
export async function createToken(payload: UserJwtPayload): Promise<string> {
  // Ensure all required fields are present and of the correct type
  const validatedPayload = {
    // Include standard JWT claims
    sub: String(payload.id), // subject = user ID
    // Custom claims
    id: String(payload.id),
    email: String(payload.email),
    name: String(payload.name || 'User'),
    role: String(payload.role || 'user'),
    isActive: Boolean(payload.isActive)
  };
  
  console.log('Creating token with payload:', validatedPayload);
  
  try {
    const token = await new SignJWT(validatedPayload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(Math.floor(Date.now() / 1000) + TOKEN_EXPIRATION)
      .sign(new TextEncoder().encode(JWT_SECRET));
    
    console.log('Token created successfully');
    return token;
  } catch (error) {
    console.error('Error creating token:', error);
    throw error;
  }
}

/**
 * Verify a JWT token and return the payload
 */
export async function verifyToken(token: string): Promise<UserJwtPayload | null> {
  try {
    console.log('Verifying token...');
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    
    console.log('Token verified successfully, raw payload:', payload);
    
    // Validate that the payload has the required fields
    if (!payload || typeof payload !== 'object') {
      console.error('Invalid payload structure:', payload);
      return null;
    }
    
    // Extract the fields we need for UserJwtPayload
    // Try to get the ID from either custom claim or standard sub claim
    const id = typeof payload.id === 'string' ? payload.id : 
              typeof payload.sub === 'string' ? payload.sub : '';
    
    const userPayload: UserJwtPayload = {
      id,
      email: typeof payload.email === 'string' ? payload.email : '',
      name: typeof payload.name === 'string' ? payload.name : 'User',
      role: typeof payload.role === 'string' ? payload.role : 'user',
      isActive: payload.isActive === true
    };
    
    // Check if we have the minimum required fields
    if (!userPayload.id || !userPayload.email) {
      console.error('Missing required fields in payload:', { id: userPayload.id, email: userPayload.email });
      console.error('Original payload:', payload);
      return null;
    }
    
    console.log('Converted payload to UserJwtPayload:', userPayload);
    return userPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Set the auth token as a cookie
 */
export function setAuthCookie(response: NextResponse, token: string): void {
  console.log('Setting auth-token cookie with token:', token.substring(0, 10) + '...');
  console.log('Cookie options:', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: TOKEN_EXPIRATION
  });
  
  try {
    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: TOKEN_EXPIRATION
    });
    console.log('Auth cookie set successfully');
  } catch (error) {
    console.error('Error setting auth cookie:', error);
  }
}

/**
 * Clear the auth token cookie
 */
export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set({
    name: 'auth-token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  });
}

/**
 * Get the current user from the request
 */
export async function getCurrentUser(request: NextRequest): Promise<UserJwtPayload | null> {
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    return null;
  }
  
  return await verifyToken(token);
}

/**
 * Get the current user from server components
 */
export async function getCurrentUserServer(): Promise<UserJwtPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('auth-token')?.value;
  
  if (!token) {
    return null;
  }
  
  return await verifyToken(token);
}
