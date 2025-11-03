import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import UserActivity from '@/models/UserActivity';

export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
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
      _id: { $ne: session.user.id } 
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use by another account' },
        { status: 400 }
      );
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      session.user.id,
      { name, email, ...(image && { image }) },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Log activity
    await UserActivity.create({
      userId: session.user.id,
      action: 'update_profile',
      details: 'Updated profile information',
      ipAddress: request.headers.get('x-forwarded-for') || request.ip,
      userAgent: request.headers.get('user-agent')
    });

    // Return updated user
    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
      image: user.image
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
