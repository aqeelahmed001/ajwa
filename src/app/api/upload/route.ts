import { NextRequest, NextResponse } from 'next/server';
import { uploadImageServer } from '@/lib/cloudinary-server';

// Define allowed file types
const allowedFileTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
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

    // Validate file type
    if (!allowedFileTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'File type not allowed' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: 'File size exceeds the limit (5MB)' },
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
