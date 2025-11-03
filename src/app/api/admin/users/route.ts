import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { logActivity } from '@/lib/activityLogger';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-server';

// GET handler - Get all users with optional filters
export async function GET(request: NextRequest) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDatabase();
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const isActive = searchParams.get('isActive');
    
    // Build query
    const query: any = {};
    
    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    
    // Filter by role
    if (role) {
      query.role = role;
    }
    
    // Filter by active status
    if (isActive !== null && isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get users
    const usersFromDb = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('roleId', 'name')
      .populate('createdBy', 'name email')
      .lean();
      
    // Ensure each user has an id field
    const users = usersFromDb.map(user => {
      // Make sure each user has an id field
      if (user._id && !user.id) {
        user.id = user._id.toString();
      }
      return user;
    });
    
    console.log('Users being returned:', users.map(u => ({ id: u.id, name: u.name })));
    
    // Get total count
    const totalCount = await User.countDocuments(query);
    
    // Log activity
    try {
      // Access the user ID from session
      const userId = session.user.id;
      
      // Log session details for debugging
      console.debug('Session user for activity logging:', JSON.stringify(session.user));
      
      if (!userId) {
        console.warn('No user ID found in session for activity logging');
        console.debug('Session user object:', session.user);
      } else {
        await logActivity(
          userId,
          'view_users',
          `Viewed users list with filters: ${JSON.stringify({ search, role, isActive })}`,
          request
        );
      }
    } catch (logError) {
      console.error('Error logging activity:', logError);
      // Continue even if logging fails
    }
    
    return NextResponse.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST handler - Create a new user
export async function POST(request: NextRequest) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDatabase();
    
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email || !body.password || !body.role) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if email already exists
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already in use' },
        { status: 400 }
      );
    }
    
    // Create new user
    const userData: any = {
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role,
      isActive: body.isActive !== undefined ? body.isActive : true,
      createdBy: session.user.id,
    };
    
    // Only add roleId if it's not empty
    if (body.roleId && body.roleId.trim() !== '') {
      userData.roleId = body.roleId;
    }
    
    const newUser = new User(userData);
    
    try {
      await newUser.save();
      
      // Log activity
      await logActivity(
        session.user.id,
        'create_user',
        `Created new user: ${newUser.name} (${newUser.email})`,
        request
      );
      
      return NextResponse.json({
        success: true,
        message: 'User created successfully',
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          isActive: newUser.isActive,
          createdAt: newUser.createdAt,
        },
      }, { status: 201 });
    } catch (saveError: any) {
      // Handle Mongoose validation errors
      if (saveError.name === 'ValidationError') {
        const validationErrors = Object.keys(saveError.errors).map(field => {
          return `${field}: ${saveError.errors[field].message}`;
        }).join(', ');
        
        console.error('Validation error creating user:', validationErrors);
        return NextResponse.json(
          { success: false, message: `Validation error: ${validationErrors}` },
          { status: 400 }
        );
      }
      
      // Handle duplicate key errors (e.g., duplicate email)
      if (saveError.code === 11000) {
        const field = Object.keys(saveError.keyPattern)[0];
        console.error(`Duplicate ${field} error:`, saveError);
        return NextResponse.json(
          { success: false, message: `This ${field} is already in use` },
          { status: 400 }
        );
      }
      
      // Handle other errors
      console.error('Error creating user:', saveError);
      return NextResponse.json(
        { success: false, message: saveError.message || 'Failed to create user' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error in user creation process:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to process user creation' },
      { status: 500 }
    );
  }
}
