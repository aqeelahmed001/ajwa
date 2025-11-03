// Import Cloudinary v2 API
import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_CONFIG } from './env';

// Configure Cloudinary (server-side only)
cloudinary.config({
  cloud_name: CLOUDINARY_CONFIG.CLOUD_NAME,
  api_key: CLOUDINARY_CONFIG.API_KEY,
  api_secret: CLOUDINARY_CONFIG.API_SECRET,
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