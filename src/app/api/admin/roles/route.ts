import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Role from '@/models/Role';
import { logActivity } from '@/lib/activityLogger';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-server';
import { PERMISSIONS } from '@/lib/permissions';

// GET handler - Get all roles with optional filters
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
    const search = searchParams.get('search') || '';
    
    // Build query
    const query: any = {};
    
    // Search by name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    // Get roles
    const roles = await Role.find(query).sort({ name: 1 }).lean();
    
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
          'view_roles',
          `Viewed roles list`,
          request
        );
      }
    } catch (logError) {
      console.error('Error logging activity:', logError);
      // Continue even if logging fails
    }
    
    return NextResponse.json({
      success: true,
      roles,
      availablePermissions: PERMISSIONS,
    });
  } catch (error: any) {
    console.error('Error fetching roles:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch roles' },
      { status: 500 }
    );
  }
}

// POST handler - Create a new role
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
    if (!body.name || !Array.isArray(body.permissions)) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if role name already exists
    const existingRole = await Role.findOne({ name: body.name });
    if (existingRole) {
      return NextResponse.json(
        { success: false, message: 'Role name already exists' },
        { status: 400 }
      );
    }
    
    // Validate permissions
    const validPermissions = PERMISSIONS.map(p => p.key);
    const invalidPermissions = body.permissions.filter(
      (p: string) => !validPermissions.includes(p)
    );
    
    if (invalidPermissions.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid permissions', 
          invalidPermissions 
        },
        { status: 400 }
      );
    }
    
    // Create new role
    const newRole = new Role({
      name: body.name,
      description: body.description || '',
      permissions: body.permissions,
      isSystem: false, // Custom roles are not system roles
    });
    
    await newRole.save();
    
    // Log activity
    try {
      // Access the user ID from session
      const userId = session.user.id;
      
      if (!userId) {
        console.warn('No user ID found in session for activity logging');
        console.debug('Session user object:', session.user);
      } else {
        await logActivity(
          userId,
          'create_role',
          `Created new role: ${newRole.name}`,
          request
        );
      }
    } catch (logError) {
      console.error('Error logging activity:', logError);
      // Continue even if logging fails
    }
    
    return NextResponse.json({
      success: true,
      message: 'Role created successfully',
      role: newRole,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating role:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create role' },
      { status: 500 }
    );
  }
}
