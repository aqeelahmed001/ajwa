/**
 * Centralized environment variables configuration
 * This file provides type-safe access to environment variables
 */

// Email configuration
export const EMAIL_CONFIG = {
  HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  PORT: parseInt(process.env.EMAIL_PORT || '587'),
  SECURE: process.env.EMAIL_SECURE === 'true',
  USER: process.env.EMAIL_USER || '',
  PASSWORD: process.env.EMAIL_PASSWORD || '',
  FROM: process.env.EMAIL_FROM || 'noreply@ajwa.co.jp',
  TO: process.env.EMAIL_TO || 'info@ajwa.co.jp',
}

// Cloudinary configuration
export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'dlgifqrj8',
  API_KEY: process.env.CLOUDINARY_API_KEY || '',
  API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  URL: process.env.CLOUDINARY_URL || '',
}

// Security configuration
export const SECURITY_CONFIG = {
  // Rate limiting
  MAX_REQUESTS_PER_MINUTE: parseInt(process.env.MAX_REQUESTS_PER_MINUTE || '10'),
  
  // CSRF protection
  CSRF_SECRET: process.env.CSRF_SECRET || 'ajwa-secure-csrf-token',
  
  // Content security
  CONTENT_SECURITY_ENABLED: process.env.CONTENT_SECURITY_ENABLED === 'true',
  
  // File upload limits
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB in bytes
  MAX_FILES_PER_UPLOAD: parseInt(process.env.MAX_FILES_PER_UPLOAD || '8'),
}

// API keys for external services
export const API_KEYS = {
  RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY || '',
  RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY || '',
}

// Application configuration
export const APP_CONFIG = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
}

// Validate critical environment variables in production
if (APP_CONFIG.IS_PRODUCTION) {
  const missingVars = [];
  
  if (!EMAIL_CONFIG.USER) missingVars.push('EMAIL_USER');
  if (!EMAIL_CONFIG.PASSWORD) missingVars.push('EMAIL_PASSWORD');
  if (!CLOUDINARY_CONFIG.API_KEY) missingVars.push('CLOUDINARY_API_KEY');
  if (!CLOUDINARY_CONFIG.API_SECRET) missingVars.push('CLOUDINARY_API_SECRET');
  if (!API_KEYS.RECAPTCHA_SECRET_KEY) missingVars.push('RECAPTCHA_SECRET_KEY');
  
  if (missingVars.length > 0) {
    console.error(`Missing critical environment variables: ${missingVars.join(', ')}`);
  }
}
