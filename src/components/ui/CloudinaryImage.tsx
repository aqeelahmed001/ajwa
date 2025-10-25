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
  crop = 'fill',
  alt,
  ...props
}: CloudinaryImageProps) {
  // Get optimized image URL
  const optimizedSrc = getOptimizedImageUrl(src, {
    width,
    height,
    quality,
    format,
    crop,
  });

  return (
    <Image
      src={optimizedSrc}
      width={width}
      height={height}
      alt={alt}
      {...props}
    />
  );
}
