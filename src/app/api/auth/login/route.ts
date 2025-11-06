import { NextRequest, NextResponse } from 'next/server';
import { createToken, setAuthCookie, UserJwtPayload } from '@/lib/jwt';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Simple validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // First check environment variables for admin access
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Create response object early so we can set cookies
    const response = NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });

    // Check if admin credentials match
    if (adminEmail && adminPassword && email === adminEmail && password === adminPassword) {
      console.log('Admin credentials match, creating admin user payload');
      
      // Create admin user payload
      const adminUser: UserJwtPayload = {
        id: 'admin-1',
        name: 'Admin User',
        email: adminEmail,
        role: 'admin',
        isActive: true
      };

      console.log('Generating JWT token for admin user');
      // Generate JWT token
      const token = await createToken(adminUser);
      console.log('JWT token generated successfully');
      
      // Create success response
      const adminResponse = NextResponse.json({
        success: true,
        user: adminUser
      }, { status: 200 });
      
      // Set auth cookie
      console.log('Setting auth cookie');
      setAuthCookie(adminResponse, token);
      console.log('Auth cookie set successfully');
      
      // Return success with user data (excluding sensitive info)
      return adminResponse;
    }

    // If not admin, check database
    try {
      await connectToDatabase();
      const { default: User } = await import('@/models/User');
      
      const user = await User.findOne({ 
        email,
        isActive: true
      }).select('+password');

      if (!user) {
        return response; // Return 401 Unauthorized
      }

      // Compare password
      const isValid = await user.comparePassword(password);
      if (!isValid) {
        return response; // Return 401 Unauthorized
      }

      // Update last login time
      user.lastLogin = new Date();
      await user.save();

      // Convert Mongoose document to plain object
      const userObject = user.toObject();
      
      console.log('User object from database:', userObject);
      
      // Safely convert _id to string with error handling
      let userId = '';
      try {
        if (userObject._id) {
          // Check if it's an ObjectId with a toString method
          if (typeof userObject._id.toString === 'function') {
            userId = userObject._id.toString();
          } else {
            // If it's already a string or another type
            userId = String(userObject._id);
          }
        }
      } catch (idError) {
        console.error('Error converting _id to string:', idError);
        userId = String(Date.now()); // Fallback ID based on timestamp
      }
      
      // Create user payload for JWT
      const userData: UserJwtPayload = {
        id: userId,
        name: userObject.name || 'User',
        email: userObject.email,
        role: userObject.role || 'user',
        isActive: Boolean(userObject.isActive)
      };
      
      console.log('Created user payload for JWT:', userData);

      // Generate JWT token
      const token = await createToken(userData);
      
      // Create success response
      const successResponse = NextResponse.json({
        success: true,
        user: userData
      }, { status: 200 });
      
      // Set auth cookie
      setAuthCookie(successResponse, token);
      
      return successResponse;
    } catch (dbError) {
      console.error('Database error during login:', dbError);
      return NextResponse.json(
        { success: false, error: 'Database error during authentication' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
