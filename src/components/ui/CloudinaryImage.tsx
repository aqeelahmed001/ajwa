"use client";

import React from 'react';
import Image, { ImageProps } from 'next/image';
import { getOptimizedImageUrl } from '@/lib/cloudinary';

interface CloudinaryImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  width: number;
  height: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  crop?: 'fill' | 'scale' | 'fit' | 'thumb';
}

/**
 * CloudinaryImage component for optimized image loading
 * Uses Cloudinary for image optimization if the image is hosted on Cloudinary
 * Falls back to regular Next.js Image for local images
 */
export default function CloudinaryImage({
  src,
  width,
  height,
  quality = 80,
  format = 'auto',
  crop = 'fit',
  alt,
  ...props
}: CloudinaryImageProps) {
  // For debugging
  console.log(`CloudinaryImage: Original src: ${src}`);
  
  // Special case for test image or local images
  if (src.includes('logo.jpg') || src.startsWith('/images/')) {
    console.log('Using local image directly:', src);
    return (
      <Image
        src={src}
        width={width}
        height={height}
        alt={alt}
        {...props}
      />
    );
  }
  
  // For brand logos from Cloudinary, use them directly
  // The API already returns full Cloudinary URLs
  if (src.includes('res.cloudinary.com')) {
    console.log('Using Cloudinary URL directly:', src);
    return (
      <Image
        src={src}
        width={width}
        height={height}
        alt={alt}
        {...props}
      />
    );
  }
  
  // For any other images, use the standard processing
  const optimizedSrc = getOptimizedImageUrl(src, {
    width,
    height,
    quality,
    format,
    crop,
  });
  
  console.log(`CloudinaryImage: Final src: ${optimizedSrc}`);
  
  return (
    <Image
      src={optimizedSrc}
      width={width}
      height={height}
      alt={alt}
      onError={(e) => {
        console.error(`Image failed to load: ${optimizedSrc}`);
        if (props.onError) {
          props.onError(e);
        }
      }}
      {...props}
    />
  );
}
