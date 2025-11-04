import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/db';
import Brand from '@/models/Brand';
import UserActivity from '@/models/UserActivity';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET all brands
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';
    
    // Build query
    const query: any = {};
    if (activeOnly) {
      query.isActive = true;
    }
    
    // Get brands
    const brands = await Brand.find(query).sort({ order: 1 });
    
    return NextResponse.json(brands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST a new brand
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    
    // Get request body
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const file = formData.get('logo') as File;
    const isActive = formData.get('isActive') === 'true';
    
    // Validate input
    if (!name || !file) {
      return NextResponse.json(
        { error: 'Name and logo are required' },
        { status: 400 }
      );
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Logo must be an image' },
        { status: 400 }
      );
    }
    
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Convert buffer to base64
    const base64 = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64}`;
    
    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        dataURI,
        {
          folder: 'ajwa/brands',
          public_id: `brand_${Date.now()}`,
          transformation: [
            { width: 300, crop: 'limit' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });
    
    // Get highest order
    const highestOrderBrand = await Brand.findOne().sort({ order: -1 });
    const nextOrder = highestOrderBrand ? highestOrderBrand.order + 1 : 0;
    
    // Create brand
    const brand = await Brand.create({
      name,
      logo: (uploadResult as any).secure_url,
      order: nextOrder,
      isActive
    });
    
    // Log activity (try-catch to make it non-blocking)
    try {
      // Check if the user ID is available
      if (session.user && session.user.id) {
        // Try to log the activity, but don't block if it fails
        await UserActivity.create({
          userId: session.user.id,
          // Use a valid action from the enum
          action: 'create_content', // Using an existing action as fallback
          details: `Created brand: ${name}`,
          ipAddress: request.headers.get('x-forwarded-for') || request.ip || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown'
        });
      }
    } catch (activityError) {
      // Just log the error but don't fail the whole request
      console.warn('Failed to log activity, but brand was created:', activityError);
    }
    
    return NextResponse.json(brand, { status: 201 });
  } catch (error) {
    console.error('Error creating brand:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
