import { NextRequest, NextResponse } from 'next/server';
import { uploadImageServer } from '@/lib/cloudinary-server';
import { SECURITY_CONFIG } from '@/lib/env';
import { isValidImage, checkRateLimit, generateSecureFilename } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown-ip';
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, message: 'Too many requests. Please try again later.' },
        { status: 429 } // Too Many Requests
      );
    }
    
    // Check if the request is multipart/form-data
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { success: false, message: 'Content type must be multipart/form-data' },
        { status: 400 }
      );
    }

    // Parse the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    // Validate file existence
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file
    if (!isValidImage(file)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file. Please check file type and size.' },
        { status: 400 }
      );
    }

    // Get folder from form data or use default
    const folder = formData.get('folder') as string || 'ajwa';
    
    // Convert the file to a Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Create a data URI for Cloudinary
    const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`;
    
    // Upload to Cloudinary
    const fileUrl = await uploadImageServer(dataUri, folder);
    
    return NextResponse.json({
      success: true,
      url: fileUrl,
      message: 'File uploaded successfully',
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
