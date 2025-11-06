import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { logActivity } from '@/lib/activityLogger';

import { getCurrentUserServer } from '@/lib/jwt';
import mongoose from 'mongoose';

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET handler - Get a specific user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and authorization
    const currentUser = await getCurrentUserServer();
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDatabase();
    
    const { id } = params;
    
    // Validate user ID
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid user ID' },
        { status: 400 }
      );
    }
    
    // Get user
    const user = await User.findById(id)
      .select('-password')
      .populate('roleId', 'name')
      .populate('createdBy', 'name email')
      .lean();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Log activity
    await logActivity(
      user.id,
      'view_user',
      `Viewed user details: ${user.name} (${user.email})`,
      request
    );
    
    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT handler - Update a user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and authorization
    const currentUser = await getCurrentUserServer();
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDatabase();
    
    const { id } = params;
    
    // Validate user ID
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid user ID' },
        { status: 400 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    
    // Find user
    const user = await User.findById(id);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if email is being changed and if it's already in use
    if (body.email && body.email !== user.email) {
      const existingUser = await User.findOne({ email: body.email });
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: 'Email already in use' },
          { status: 400 }
        );
      }
    }
    
    // Update user fields
    if (body.name) user.name = body.name;
    if (body.email) user.email = body.email;
    if (body.role) user.role = body.role;
    
    // Handle roleId - only set if it's a valid value
    if (body.roleId !== undefined) {
      if (body.roleId === '' || body.roleId === null) {
        // Remove roleId if empty
        user.roleId = undefined;
      } else {
        // Only set if not empty
        user.roleId = body.roleId;
      }
    }
    
    if (body.isActive !== undefined) user.isActive = body.isActive;
    
    // Only update password if provided
    if (body.password) {
      user.password = body.password;
    }
    
    await user.save();
    
    // Log activity
    await logActivity(
      user.id,
      'update_user',
      `Updated user: ${user.name} (${user.email})`,
      request
    );
    
    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE handler - Delete a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('DELETE handler called with params:', params);
  try {
    // Check authentication and authorization
    const currentUser = await getCurrentUserServer();
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDatabase();
    
    const { id } = params;
    
    // Validate user ID
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid user ID' },
        { status: 400 }
      );
    }
    
    // Find user
    const user = await User.findById(id);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Prevent deleting the last admin user
    if (user.role === 'admin') {
      console.log(`Attempting to delete admin user: ${user.name} (${user.email})`);
      
      // Find all admin users and log their details
      const adminUsers = await User.find({ role: 'admin' }).lean();
      const adminCount = adminUsers.length;
      
      console.log(`Total admin users found: ${adminCount}`);
      adminUsers.forEach((admin, index) => {
        console.log(`Admin ${index + 1}: ID=${admin._id}, Name=${admin.name}, Email=${admin.email}`);
      });
      
      if (adminCount <= 1) {
        console.log('Cannot delete the last admin user');
        return NextResponse.json(
          { success: false, message: 'Cannot delete the last admin user' },
          { status: 400 }
        );
      } else {
        console.log(`Multiple admin users found (${adminCount}), proceeding with deletion`);
      }
    }
    
    // Store user info for logging
    const userName = user.name;
    const userEmail = user.email;
    
    // Delete user
    console.log(`Deleting user with ID: ${id}`);
    try {
      // Try findByIdAndDelete which is more reliable
      const deleteResult = await User.findByIdAndDelete(id);
      console.log('Delete result:', deleteResult ? 'User deleted successfully' : 'No user found to delete');
      
      // Double-check if user was deleted
      const checkUser = await User.findById(id);
      console.log('User still exists after deletion?', checkUser ? 'Yes' : 'No');
    } catch (deleteError) {
      console.error('Error during user deletion:', deleteError);
      throw deleteError;
    }
    
    // Log activity
    await logActivity(
      user.id,
      'delete_user',
      `Deleted user: ${userName} (${userEmail})`,
      request
    );
    
    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
      userName: userName,
      userEmail: userEmail
    });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete user' },
      { status: 500 }
    );
  }
}
