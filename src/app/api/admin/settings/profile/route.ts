import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUserServer } from '@/lib/jwt';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import UserActivity from '@/models/UserActivity';

export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const currentUser = await getCurrentUserServer();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to database
    await dbConnect();

    // Get request body
    const { name, email, image } = await request.json();

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if email already exists for another user
    const existingUser = await User.findOne({ 
      email, 
      _id: { $ne: currentUser.id } 
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use by another account' },
        { status: 400 }
      );
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      currentUser.id,
      { name, email, ...(image && { image }) },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Log activity
    await UserActivity.create({
      userId: updatedUser.id,
      action: 'update_profile',
      details: 'Updated profile information',
      ipAddress: request.headers.get('x-forwarded-for') || request.ip,
      userAgent: request.headers.get('user-agent')
    });

    // Return updated user
    return NextResponse.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      image: updatedUser.image
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
