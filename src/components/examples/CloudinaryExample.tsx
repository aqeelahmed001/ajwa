"use client";

import React, { useState } from 'react';
import CloudinaryImage from '@/components/ui/CloudinaryImage';
import ImageUploader from '@/components/ui/ImageUploader';

export default function CloudinaryExample() {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Cloudinary Integration Examples</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">1. Optimized Images</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border p-4 rounded-lg">
            <h4 className="font-medium mb-2">Original Image</h4>
            <img 
              src="/images/mach1.jpg" 
              alt="Original" 
              className="w-full h-48 object-cover rounded"
            />
            <p className="text-sm text-gray-500 mt-2">Standard img tag</p>
          </div>
          
          <div className="border p-4 rounded-lg">
            <h4 className="font-medium mb-2">Next.js Image</h4>
            <CloudinaryImage 
              src="/images/mach1.jpg" 
              alt="Next.js Image" 
              width={400}
              height={300}
              className="w-full h-48 object-cover rounded"
            />
            <p className="text-sm text-gray-500 mt-2">Next.js Image component</p>
          </div>
          
          <div className="border p-4 rounded-lg">
            <h4 className="font-medium mb-2">Cloudinary Optimized</h4>
            <CloudinaryImage 
              src="/images/mach1.jpg" 
              alt="Cloudinary Optimized" 
              width={400}
              height={300}
              quality={80}
              format="auto"
              crop="fill"
              className="w-full h-48 object-cover rounded"
            />
            <p className="text-sm text-gray-500 mt-2">With Cloudinary optimizations</p>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">2. Image Upload</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border p-4 rounded-lg">
            <h4 className="font-medium mb-2">Upload an Image</h4>
            <ImageUploader 
              onUpload={(url) => setUploadedImageUrl(url)}
              folder="ajwa/examples"
              buttonText="Upload Image to Cloudinary"
            />
          </div>
          
          {uploadedImageUrl && (
            <div className="border p-4 rounded-lg">
              <h4 className="font-medium mb-2">Uploaded Image</h4>
              <CloudinaryImage 
                src={uploadedImageUrl} 
                alt="Uploaded Image" 
                width={400}
                height={300}
                className="w-full h-48 object-cover rounded"
              />
              <p className="text-sm text-gray-500 mt-2 break-all">{uploadedImageUrl}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
