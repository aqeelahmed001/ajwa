# Cloudinary Setup for Ajwa Website

This document explains how to use Cloudinary for image management in the Ajwa website.

## Configuration

### 1. Environment Variables

The Cloudinary credentials are stored in the `.env.local` file:

```
CLOUDINARY_CLOUD_NAME=dlgifqrj8
CLOUDINARY_API_KEY=129881768349894
CLOUDINARY_API_SECRET=0_qki1Fmll7nnZtpzgu-UQzxGN0
CLOUDINARY_URL=cloudinary://129881768349894:0_qki1Fmll7nnZtpzgu-UQzxGN0@dlgifqrj8
```

### 2. Next.js Configuration

The Cloudinary domain is added to the Next.js image domains in `next.config.js`:

```javascript
images: {
  domains: [
    'placehold.co',
    'res.cloudinary.com',
    // add other domains as needed
  ],
}
```

## Components

### 1. CloudinaryImage Component

Use this component instead of Next.js Image for optimized images:

```jsx
import CloudinaryImage from '@/components/ui/CloudinaryImage';

<CloudinaryImage
  src="/images/example.jpg"  // Local path or Cloudinary URL
  alt="Example Image"
  width={400}
  height={300}
  quality={85}        // Optional: Image quality (1-100)
  format="auto"       // Optional: 'auto', 'webp', 'jpg', 'png'
  crop="fill"         // Optional: 'fill', 'scale', 'fit', 'thumb'
  className="..."     // Optional: Additional CSS classes
/>
```

### 2. ImageUploader Component

Use this component in admin interfaces to upload images to Cloudinary:

```jsx
import ImageUploader from '@/components/ui/ImageUploader';

<ImageUploader
  onUpload={(url) => {
    console.log('Uploaded image URL:', url);
    // Save URL to your form state or database
  }}
  folder="ajwa/products"  // Optional: Cloudinary folder path
  buttonText="Upload Product Image"  // Optional: Custom button text
/>
```

## Architecture

The Cloudinary integration is split into client-side and server-side components:

### Client-Side (`/src/lib/cloudinary.ts`)
- Contains utilities that work in the browser
- Handles image URL optimization
- Sends upload requests to the API route

### Server-Side (`/src/lib/cloudinary-server.ts`)
- Contains utilities that work on the server
- Handles direct Cloudinary API interactions
- Used by API routes

### API Route (`/src/app/api/upload/route.ts`)
- Handles file uploads from the client
- Validates files before uploading to Cloudinary
- Returns the Cloudinary URL to the client

## Utility Functions

### 1. Upload Image (Client-Side)

```js
import { uploadImage } from '@/lib/cloudinary';

// In an async function:
const imageUrl = await uploadImage(file, 'ajwa/folder');
```

### 2. Get Optimized Image URL (Client-Side)

```js
import { getOptimizedImageUrl } from '@/lib/cloudinary';

const optimizedUrl = getOptimizedImageUrl('/images/example.jpg', {
  width: 800,
  height: 600,
  quality: 80,
  format: 'auto',
  crop: 'fill'
});
```

### 3. Upload Image (Server-Side)

```js
import { uploadImageServer } from '@/lib/cloudinary-server';

// In an API route or server component:
const imageUrl = await uploadImageServer(buffer, 'ajwa/folder');
```

## Benefits of Using Cloudinary

1. **Automatic Optimization**: Images are automatically optimized for web delivery
2. **Responsive Images**: Serve different sized images based on device
3. **Format Conversion**: Automatically serve WebP to supported browsers
4. **CDN Delivery**: Fast global content delivery
5. **Transformations**: Resize, crop, and transform images on-the-fly
6. **Reduced Server Load**: Offload image processing to Cloudinary

## Best Practices

1. Use descriptive folder names for organization (e.g., `ajwa/products`, `ajwa/blog`)
2. Set appropriate quality settings (80-85% is usually a good balance)
3. Use `format="auto"` to automatically serve the best format for each browser
4. Choose appropriate crop modes based on your needs
5. Consider adding lazy loading for images below the fold

## Troubleshooting

If images aren't loading properly:

1. Check that your Cloudinary credentials are correct in `.env.local`
2. Verify that the image path or URL is correct
3. Check browser console for any errors
4. Ensure the Cloudinary package is installed (`npm install cloudinary`)
