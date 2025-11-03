"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { uploadImage } from '@/lib/cloudinary'
import { Loader2, Upload, X } from 'lucide-react'

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
  placeholder?: string
  folder?: string
}

export function ImageUploader({ value, onChange, placeholder = 'Image URL', folder = 'ajwa' }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string>(value)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      setUploadProgress(10)

      // Simulate progress (actual upload doesn't provide progress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 300)

      // Upload the file
      const imageUrl = await uploadImage(file, folder)
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      // Update the value
      onChange(imageUrl)
      setPreviewUrl(imageUrl)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleManualUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    onChange(url)
    setPreviewUrl(url)
  }

  const clearImage = () => {
    onChange('')
    setPreviewUrl('')
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleManualUrlChange}
          className="flex-1"
          disabled={isUploading}
        />
        <div className="relative">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {uploadProgress}%
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </div>
        {value && (
          <Button
            type="button"
            variant="outline"
            onClick={clearImage}
            disabled={isUploading}
            className="px-2"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {previewUrl && (
        <div className="relative h-40 bg-slate-100 rounded-md overflow-hidden">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-contain"
          />
        </div>
      )}
    </div>
  )
}
