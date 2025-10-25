"use client";

import React, { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from './button';
import { uploadImage } from '@/lib/cloudinary';

interface ImageUploaderProps {
  onUpload: (url: string) => void;
  folder?: string;
  className?: string;
  buttonText?: string;
}

export default function ImageUploader({
  onUpload,
  folder = 'ajwa',
  className = '',
  buttonText = 'Upload Image'
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      const imageUrl = await uploadImage(file, folder);
      onUpload(imageUrl);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const clearPreview = () => {
    setPreviewUrl(null);
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {previewUrl ? (
        <div className="relative mb-4">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="max-w-full max-h-[200px] rounded-md object-contain"
          />
          <button
            type="button"
            onClick={clearPreview}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : null}

      <div className="flex items-center justify-center w-full">
        <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-gray-50 transition-colors">
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          ) : (
            <Upload className="w-8 h-8 text-primary" />
          )}
          <span className="mt-2 text-base leading-normal">
            {isUploading ? 'Uploading...' : buttonText}
          </span>
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
            disabled={isUploading}
          />
        </label>
      </div>

      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
  );
}
