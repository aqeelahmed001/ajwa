// Cloudinary client-side utilities (no Node.js dependencies)

// Cloud name for Cloudinary
const CLOUD_NAME = 'dlgifqrj8';

/**
 * Upload an image to Cloudinary via API route
 * @param file The file to upload
 * @param folder The folder to upload to
 * @returns The uploaded image URL
 */
export async function uploadImage(file: File, folder: string = 'ajwa'): Promise<string> {
  // Create form data for upload
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);
  
  // Upload via API route
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

/**
 * Get optimized image URL from Cloudinary
 * @param url The original image URL or Cloudinary public ID
 * @param options Transformation options
 * @returns The optimized image URL
 */
export function getOptimizedImageUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    crop?: 'fill' | 'scale' | 'fit' | 'thumb';
  } = {}
): string {
  // If it's already a Cloudinary URL, return it with transformations
  if (url.includes('res.cloudinary.com/dlgifqrj8')) {
    const baseUrl = url.split('/upload/')[0] + '/upload/';
    const transformations = [];
    
    if (options.width) transformations.push(`w_${options.width}`);
    if (options.height) transformations.push(`h_${options.height}`);
    if (options.quality) transformations.push(`q_${options.quality}`);
    if (options.format) transformations.push(`f_${options.format}`);
    if (options.crop) transformations.push(`c_${options.crop}`);
    
    const transformationString = transformations.length > 0 
      ? transformations.join(',') + '/' 
      : '';
    
    const imagePath = url.split('/upload/')[1];
    return `${baseUrl}${transformationString}${imagePath}`;
  }
  
  // If it's a local URL but we want to use Cloudinary, convert it
  if (url.startsWith('/') && options.width) {
    // Remove leading slash for Cloudinary path
    const imagePath = url.startsWith('/') ? url.substring(1) : url;
    
    // Build transformation string
    const transformations = [];
    if (options.width) transformations.push(`w_${options.width}`);
    if (options.height) transformations.push(`h_${options.height}`);
    if (options.quality) transformations.push(`q_${options.quality || 80}`);
    if (options.format) transformations.push(`f_${options.format}`);
    if (options.crop) transformations.push(`c_${options.crop || 'fill'}`);
    
    const transformationString = transformations.join(',');
    
    // Return Cloudinary URL
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformationString}/${imagePath}`;
  }
  
  // If it's a local URL and no transformations needed, return it as is
  return url;
}

/**
 * Read a file as base64
 * @param file The file to read
 * @returns The file as base64
 */
export function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
