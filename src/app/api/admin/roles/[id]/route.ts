import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Role from '@/models/Role';
import User from '@/models/User';
import { logActivity } from '@/lib/activityLogger';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-server';
import { PERMISSIONS } from '@/lib/permissions';
import mongoose from 'mongoose';

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET handler - Get a specific role by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const { id } = params;
    
    // Validate role ID
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid role ID' },
        { status: 400 }
      );
    }
    
    // Get role
    const role = await Role.findById(id).lean();
    
    if (!role) {
      return NextResponse.json(
        { success: false, message: 'Role not found' },
        { status: 404 }
      );
    }
    
    // Log activity
    await logActivity(
      session.user.id,
      'view_role',
      `Viewed role details: ${role.name}`,
      request
    );
    
    return NextResponse.json({
      success: true,
      role,
      availablePermissions: PERMISSIONS,
    });
  } catch (error: any) {
    console.error('Error fetching role:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch role' },
      { status: 500 }
    );
  }
}

// PUT handler - Update a role
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const { id } = params;
    
    // Validate role ID
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid role ID' },
        { status: 400 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    
    // Find role
    const role = await Role.findById(id);
    
    if (!role) {
      return NextResponse.json(
        { success: false, message: 'Role not found' },
        { status: 404 }
      );
    }
    
    // Prevent modifying system roles
    if (role.isSystem) {
      return NextResponse.json(
        { success: false, message: 'Cannot modify system roles' },
        { status: 400 }
      );
    }
    
    // Check if name is being changed and if it's already in use
    if (body.name && body.name !== role.name) {
      const existingRole = await Role.findOne({ name: body.name });
      if (existingRole) {
        return NextResponse.json(
          { success: false, message: 'Role name already exists' },
          { status: 400 }
        );
      }
    }
    
    // Validate permissions if provided
    if (body.permissions && Array.isArray(body.permissions)) {
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
    }
    
    // Update role fields
    if (body.name) role.name = body.name;
    if (body.description !== undefined) role.description = body.description;
    if (body.permissions) role.permissions = body.permissions;
    
    await role.save();
    
    // Log activity
    await logActivity(
      session.user.id,
      'update_role',
      `Updated role: ${role.name}`,
      request
    );
    
    return NextResponse.json({
      success: true,
      message: 'Role updated successfully',
      role,
    });
  } catch (error: any) {
    console.error('Error updating role:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update role' },
      { status: 500 }
    );
  }
}

// DELETE handler - Delete a role
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const { id } = params;
    
    // Validate role ID
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid role ID' },
        { status: 400 }
      );
    }
    
    // Find role
    const role = await Role.findById(id);
    
    if (!role) {
      return NextResponse.json(
        { success: false, message: 'Role not found' },
        { status: 404 }
      );
    }
    
    // Prevent deleting system roles
    if (role.isSystem) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete system roles' },
        { status: 400 }
      );
    }
    
    // Check if role is in use
    const usersWithRole = await User.countDocuments({ roleId: id });
    if (usersWithRole > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Cannot delete role that is assigned to users',
          usersCount: usersWithRole
        },
        { status: 400 }
      );
    }
    
    // Store role name for logging
    const roleName = role.name;
    
    // Delete role
    await Role.deleteOne({ _id: id });
    
    // Log activity
    await logActivity(
      session.user.id,
      'delete_role',
      `Deleted role: ${roleName}`,
      request
    );
    
    return NextResponse.json({
      success: true,
      message: 'Role deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting role:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete role' },
      { status: 500 }
    );
  }
}
