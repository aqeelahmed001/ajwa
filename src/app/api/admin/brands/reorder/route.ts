import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/db';
import Brand from '@/models/Brand';
import UserActivity from '@/models/UserActivity';

// POST to reorder brands
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    
    // Get request body
    const { brandIds } = await request.json();
    
    if (!Array.isArray(brandIds) || brandIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid brand IDs' },
        { status: 400 }
      );
    }
    
    // Update order for each brand
    const updatePromises = brandIds.map((id, index) => {
      return Brand.findByIdAndUpdate(id, { order: index });
    });
    
    await Promise.all(updatePromises);
    
    // Log activity (try-catch to make it non-blocking)
    try {
      // Check if the user ID is available
      if (session.user && session.user.id) {
        // Try to log the activity, but don't block if it fails
        await UserActivity.create({
          userId: session.user.id,
          // Use a valid action from the enum
          action: 'update_content', // Using an existing action as fallback
          details: `Reordered ${brandIds.length} brands`,
          ipAddress: request.headers.get('x-forwarded-for') || request.ip || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown'
        });
      }
    } catch (activityError) {
      // Just log the error but don't fail the whole request
      console.warn('Failed to log activity, but brands were reordered:', activityError);
    }
    
    // Get updated brands
    const brands = await Brand.find().sort({ order: 1 });
    
    return NextResponse.json(brands);
  } catch (error) {
    console.error('Error reordering brands:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
