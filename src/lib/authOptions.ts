import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { UserRole } from '@/models/User';

// Custom types for NextAuth
declare module 'next-auth' {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: UserRole;
    isActive: boolean;
  }

  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole;
    isActive: boolean;
  }
}

// Define auth options for NextAuth
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // In a real application, validate credentials against your database
        // For development, we'll use a mock user
        if (credentials?.email === 'admin@ajwatrading.com' && credentials?.password === 'admin') {
          return {
            id: '1',
            name: 'Admin User',
            email: 'admin@ajwatrading.com',
            role: 'admin' as UserRole,
            isActive: true,
          };
        }
        return null;
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add role to JWT token
      if (user) {
        token.role = user.role;
        token.isActive = user.isActive;
      }
      return token;
    },
    async session({ session, token }) {
      // Add role to session user
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).isActive = token.isActive;
      }
      return session;
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'development-secret',
};

// Helper function to check if a user is an admin
export async function isAdmin(session: any) {
  return session?.user?.role === 'admin';
}
