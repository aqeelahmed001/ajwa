import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { NextAuthOptions, getServerSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import { UserRole } from './auth' // Import from client-side auth

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: UserRole
      isActive: boolean
    }
  }
}

export type AuthenticatedUser = {
  id: string
  name: string
  email: string
  role: UserRole
  isActive: boolean
}

// NextAuth options for API routes
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        try {
          // Connect to the database
          try {
            const mongoose = require('mongoose');
            if (mongoose.connection.readyState !== 1) {
              const { connectToDatabase } = require('@/lib/mongodb');
              await connectToDatabase();
              console.log('Database connection established');
            }
          } catch (dbError) {
            console.error('Database connection error:', dbError);
            // No fallback - we need the database to authenticate
            throw dbError;
          }
          
          // Import User model
          const { default: User } = require('@/models/User');
          
          // Find user by email
          const user = await User.findOne({ email: credentials?.email });
          
          // If user doesn't exist, return null
          if (!user) {
            console.log('User not found:', credentials?.email);
            return null;
          }
          
          // If user is not active, return null
          if (!user.isActive) {
            console.log('User account is not active:', credentials?.email);
            return null;
          }
          
          console.log('User found in database:', user.email);
          
          // Verify password
          console.log('Verifying password for user:', credentials?.email);
          try {
            const isValid = await user.comparePassword(credentials?.password || '');
            console.log('Password verification result:', isValid ? 'Valid' : 'Invalid');
            if (!isValid) {
              console.log('Invalid password for user:', credentials?.email);
              return null;
            }
          } catch (pwError) {
            console.error('Error verifying password:', pwError);
            return null;
          }
          
          console.log('Authentication successful for:', credentials?.email);
          
          // Update last login time and IP
          try {
            // Get IP address from request headers if available
            const ipAddress = req?.headers?.['x-forwarded-for'] || 
                             req?.headers?.['x-real-ip'] || 
                             'unknown';
            
            // Update user's last login information
            user.lastLogin = new Date();
            user.lastLoginIp = Array.isArray(ipAddress) ? ipAddress[0] : ipAddress;
            await user.save();
            
            // Log the login activity
            const { logActivity } = require('@/lib/activityLogger');
            await logActivity(
              user._id.toString(),
              'login',
              `User logged in from IP: ${user.lastLoginIp}`,
              req
            );
            
            console.log(`Updated last login for ${user.email} to ${user.lastLogin}`);
          } catch (updateError) {
            console.error('Error updating last login:', updateError);
            // Continue even if update fails
          }
          
          // Return user data for session
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log('JWT callback - initial token:', token);
      console.log('JWT callback - user:', user);
      
      // Add role to JWT token
      if (user) {
        token.role = user.role;
        token.isActive = user.isActive;
        console.log('JWT callback - added user data to token');
      }
      
      console.log('JWT callback - final token:', token);
      return token;
    },
    async session({ session, token }) {
      console.log('Session callback - token:', token);
      console.log('Session callback - initial session:', session);
      
      // Add user data to session
      if (session.user) {
        // Add user ID from token
        (session.user as any).id = token.sub;
        
        // Add role and active status
        (session.user as any).role = token.role;
        (session.user as any).isActive = token.isActive;
        
        console.log('Session callback - added user ID:', token.sub);
        console.log('Session callback - added role:', token.role);
      }
      
      console.log('Session callback - final session:', session);
      return session;
    }
  },
  pages: {
    signIn: '/admin',
    error: '/admin',
  },
  secret: process.env.NEXTAUTH_SECRET || 'development-secret',
}

export async function getCurrentUserServer(request?: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    // Get session from NextAuth
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return null;
    }
    
    // Return user from session
    return {
      id: session.user.id,
      name: session.user.name || 'Unknown',
      email: session.user.email || 'unknown@example.com',
      role: session.user.role,
      isActive: session.user.isActive,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}
