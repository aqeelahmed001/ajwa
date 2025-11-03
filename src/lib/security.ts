/**
 * Security utilities for form validation and file uploads
 */
import { SECURITY_CONFIG } from './env';

/**
 * Sanitize user input to prevent XSS attacks
 * @param input The user input to sanitize
 * @returns Sanitized input
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  // Replace potentially dangerous characters
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate email format
 * @param email The email to validate
 * @returns Whether the email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format (basic validation)
 * @param phone The phone number to validate
 * @returns Whether the phone number is valid
 */
export function isValidPhone(phone: string): boolean {
  // Allow digits, spaces, dashes, plus, and parentheses
  const phoneRegex = /^[0-9\s\-\+\(\)]{7,20}$/;
  return phoneRegex.test(phone);
}

/**
 * Check if a file is a valid image
 * @param file The file to validate
 * @returns Whether the file is a valid image
 */
export function isValidImage(file: File): boolean {
  // Check file size
  if (file.size > SECURITY_CONFIG.MAX_FILE_SIZE) {
    return false;
  }
  
  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic'];
  return validTypes.includes(file.type.toLowerCase());
}

/**
 * Check if a file name is safe
 * @param filename The filename to validate
 * @returns Whether the filename is safe
 */
export function isSafeFilename(filename: string): boolean {
  // Prevent path traversal and dangerous filenames
  const safeFilenameRegex = /^[a-zA-Z0-9_\-. ()]+$/;
  return safeFilenameRegex.test(filename);
}

/**
 * Generate a secure filename
 * @param originalFilename The original filename
 * @returns A secure filename
 */
export function generateSecureFilename(originalFilename: string): string {
  // Extract file extension
  const parts = originalFilename.split('.');
  const extension = parts.length > 1 ? parts.pop()?.toLowerCase() : '';
  
  // Generate random string for filename
  const randomStr = Math.random().toString(36).substring(2, 15);
  const timestamp = Date.now();
  
  return `${timestamp}-${randomStr}.${extension}`;
}

/**
 * Validate form data to prevent injection attacks
 * @param formData The form data to validate
 * @returns Validation result
 */
export function validateFormData(formData: Record<string, any>): { 
  isValid: boolean; 
  sanitizedData: Record<string, any>;
  errors: Record<string, string>;
} {
  const sanitizedData: Record<string, any> = {};
  const errors: Record<string, string> = {};
  
  // Validate and sanitize each field
  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === 'string') {
      // Sanitize string input
      sanitizedData[key] = sanitizeInput(value);
      
      // Validate specific fields
      if (key === 'email' && value && !isValidEmail(value)) {
        errors[key] = 'Invalid email format';
      } else if (key === 'phone' && value && !isValidPhone(value)) {
        errors[key] = 'Invalid phone number format';
      }
    } else {
      // Pass through non-string values
      sanitizedData[key] = value;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    sanitizedData,
    errors,
  };
}

/**
 * Check if a request is within rate limits
 * This is a simple in-memory implementation
 * In production, use a Redis-based solution
 */
const requestCounts: Record<string, { count: number, timestamp: number }> = {};

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  
  // Clean up old entries
  for (const [key, data] of Object.entries(requestCounts)) {
    if (now - data.timestamp > windowMs) {
      delete requestCounts[key];
    }
  }
  
  // Check if IP exists in records
  if (!requestCounts[ip]) {
    requestCounts[ip] = { count: 1, timestamp: now };
    return true;
  }
  
  // Check if within time window
  if (now - requestCounts[ip].timestamp > windowMs) {
    requestCounts[ip] = { count: 1, timestamp: now };
    return true;
  }
  
  // Increment count and check limit
  requestCounts[ip].count++;
  return requestCounts[ip].count <= SECURITY_CONFIG.MAX_REQUESTS_PER_MINUTE;
}
