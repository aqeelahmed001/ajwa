// Import Cloudinary v2 API
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary (server-side only)
cloudinary.config({
  cloud_name: 'dlgifqrj8',
  api_key: process.env.CLOUDINARY_API_KEY || '129881768349894',
  api_secret: process.env.CLOUDINARY_API_SECRET || '0_qki1Fmll7nnZtpzgu-UQzxGN0',
  secure: true,
});

/**
 * Upload an image to Cloudinary (server-side only)
 * @param file The file buffer or path
 * @param folder The folder to upload to
 * @returns The uploaded image URL
 */
export async function uploadImageServer(file: Buffer | string, folder: string = 'ajwa'): Promise<string> {
  try {
    // For Buffer type, convert to base64 string
    let fileToUpload: string;
    
    if (Buffer.isBuffer(file)) {
      fileToUpload = `data:image/png;base64,${file.toString('base64')}`;
    } else {
      fileToUpload = file;
    }
    
    // Now upload the file
    const result = await cloudinary.uploader.upload(fileToUpload, {
      folder,
      resource_type: 'auto',
    });
    
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

// Export the configured cloudinary instance
export { cloudinary };