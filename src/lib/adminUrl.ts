/**
 * Utility functions for handling admin URLs
 */

/**
 * Get the base admin URL depending on the environment
 * In production, this will be the admin subdomain
 * In development, this will be the /admin path
 */
export function getAdminBaseUrl(): string {
  return process.env.NEXT_PUBLIC_ADMIN_URL || 
    (process.env.NODE_ENV === 'production' 
      ? 'https://admin.yourdomain.com' 
      : 'http://localhost:3000/admin');
}

/**
 * Get the full admin URL for a specific path
 * @param path The path to append to the admin base URL
 */
export function getAdminUrl(path: string = ''): string {
  const baseUrl = getAdminBaseUrl();
  
  // In production with subdomain, don't include /admin in the path
  if (process.env.NODE_ENV === 'production') {
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${baseUrl}/${cleanPath}`;
  }
  
  // In development, the base URL already includes /admin
  // So we need to make sure we don't duplicate it
  if (path.startsWith('/admin')) {
    return `${baseUrl}${path.substring(6)}`;
  }
  
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${baseUrl}/${cleanPath}`;
}

/**
 * Check if the current URL is on the admin subdomain
 */
export function isAdminSubdomain(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  const hostname = window.location.hostname;
  return hostname.startsWith('admin.');
}
