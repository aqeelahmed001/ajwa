/**
 * Utility functions for handling admin URLs
 */

/**
 * Get the base admin URL depending on the environment
 * This will be the /admin path in both production and development
 */
export function getAdminBaseUrl(): string {
  return process.env.NEXT_PUBLIC_ADMIN_URL || 
    (process.env.NODE_ENV === 'production' 
      ? 'https://ajwa-xi.vercel.app/admin' 
      : 'http://localhost:3000/admin');
}

/**
 * Get the full admin URL for a specific path
 * @param path The path to append to the admin base URL
 */
export function getAdminUrl(path: string = ''): string {
  const baseUrl = getAdminBaseUrl();
  
  // Handle paths that already include /admin
  if (path.startsWith('/admin/')) {
    return `${baseUrl}${path.substring(6)}`;
  }
  
  if (path === '/admin') {
    return baseUrl;
  }
  
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${baseUrl}/${cleanPath}`;
}

/**
 * This function is kept for backward compatibility
 * Always returns false as we're not using subdomains anymore
 */
export function isAdminSubdomain(): boolean {
  return false;
}
