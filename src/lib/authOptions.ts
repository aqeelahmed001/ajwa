import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { UserRole } from './auth'; // Import from client-side auth

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
        try {
          // Connect to the database
          const { connectToDatabase } = await import('@/lib/mongodb');
          await connectToDatabase();
          
          // Import User model dynamically to avoid circular dependencies
          const { default: User } = await import('@/models/User');
          
          // Find user by email
          const user = await User.findOne({ email: credentials?.email });
          
          // If user doesn't exist or is not active, return null
          if (!user || !user.isActive) {
            return null;
          }
          
          // Verify password
          const isValid = await user.comparePassword(credentials?.password || '');
          if (!isValid) {
            return null;
          }
          
          // Return user data for session
          return {
            id: user._id ? user._id.toString() : user.id,
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
