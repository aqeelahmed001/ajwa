import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUserServer } from '@/lib/jwt';
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

// GET a single brand
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const brand = await Brand.findById(params.id);
    
    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(brand);
  } catch (error) {
    console.error('Error fetching brand:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// PUT/UPDATE a brand
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const user = await getCurrentUserServer();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    
    // Get brand
    const brand = await Brand.findById(params.id);
    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }
    
    // Get request body
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const file = formData.get('logo') as File | null;
    const isActive = formData.get('isActive') === 'true';
    const order = parseInt(formData.get('order') as string) || brand.order;
    
    // Validate input
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }
    
    // Update logo if provided
    let logoUrl = brand.logo;
    if (file) {
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
      
      logoUrl = (uploadResult as any).secure_url;
      
      // Delete old logo if it's from Cloudinary
      if (brand.logo && brand.logo.includes('cloudinary')) {
        try {
          const publicId = brand.logo.split('/').pop()?.split('.')[0];
          if (publicId) {
            await cloudinary.uploader.destroy(`ajwa/brands/${publicId}`);
          }
        } catch (error) {
          console.error('Error deleting old logo:', error);
        }
      }
    }
    
    // Update brand
    const updatedBrand = await Brand.findByIdAndUpdate(
      params.id,
      {
        name,
        logo: logoUrl,
        order,
        isActive
      },
      { new: true }
    );
    
    // Log activity (try-catch to make it non-blocking)
    try {
      // Check if the user ID is available
      if (session.user && user.id) {
        // Try to log the activity, but don't block if it fails
        await UserActivity.create({
          userId: user.id,
          // Use a valid action from the enum
          action: 'update_content', // Using an existing action as fallback
          details: `Updated brand: ${name}`,
          ipAddress: request.headers.get('x-forwarded-for') || request.ip || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown'
        });
      }
    } catch (activityError) {
      // Just log the error but don't fail the whole request
      console.warn('Failed to log activity, but brand was updated:', activityError);
    }
    
    return NextResponse.json(updatedBrand);
  } catch (error) {
    console.error('Error updating brand:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE a brand
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const user = await getCurrentUserServer();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    
    // Get brand
    const brand = await Brand.findById(params.id);
    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }
    
    // Delete logo from Cloudinary
    if (brand.logo && brand.logo.includes('cloudinary')) {
      try {
        const publicId = brand.logo.split('/').pop()?.split('.')[0];
        if (publicId) {
          await cloudinary.uploader.destroy(`ajwa/brands/${publicId}`);
        }
      } catch (error) {
        console.error('Error deleting logo:', error);
      }
    }
    
    // Delete brand
    await Brand.findByIdAndDelete(params.id);
    
    // Log activity (try-catch to make it non-blocking)
    try {
      // Check if the user ID is available
      if (session.user && user.id) {
        // Try to log the activity, but don't block if it fails
        await UserActivity.create({
          userId: user.id,
          // Use a valid action from the enum
          action: 'delete_content', // Using an existing action as fallback
          details: `Deleted brand: ${brand.name}`,
          ipAddress: request.headers.get('x-forwarded-for') || request.ip || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown'
        });
      }
    } catch (activityError) {
      // Just log the error but don't fail the whole request
      console.warn('Failed to log activity, but brand was deleted:', activityError);
    }
    
    return NextResponse.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    console.error('Error deleting brand:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
