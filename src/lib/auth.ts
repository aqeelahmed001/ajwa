import { UserRole } from '@/models/User';
import { authOptions, isAdmin } from './authOptions';

// Export authOptions for use in API routes
export { authOptions, isAdmin };

// Temporary client-side mock user fetcher.
// Replace with API call (e.g., fetch('/api/auth/me')) when backend is ready.
export async function getCurrentUserClient() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // TODO: Replace with real authentication logic
  return {
    id: '1',
    name: 'Admin User',
    email: 'admin@ajwatrading.com',
    role: 'admin' as UserRole,
    isActive: true,
  };
}

// Check if the user has the required role
export function hasRole(user: any, requiredRoles: UserRole[]) {
  if (!user) return false;
  return requiredRoles.includes(user.role);
}

// Role-based permissions
export const PERMISSIONS = {
  // Dashboard
  viewDashboard: ['admin', 'editor', 'viewer'] as UserRole[],
  
  // Content management
  viewContent: ['admin', 'editor', 'viewer'] as UserRole[],
  createContent: ['admin', 'editor'] as UserRole[],
  editContent: ['admin', 'editor'] as UserRole[],
  deleteContent: ['admin'] as UserRole[],
  publishContent: ['admin', 'editor'] as UserRole[],
  
  // User management
  viewUsers: ['admin'] as UserRole[],
  createUsers: ['admin'] as UserRole[],
  editUsers: ['admin'] as UserRole[],
  deleteUsers: ['admin'] as UserRole[],
  
  // Settings
  viewSettings: ['admin'] as UserRole[],
  editSettings: ['admin'] as UserRole[],
};

// Check if the user has permission for a specific action
export function hasPermission(user: any, permission: keyof typeof PERMISSIONS) {
  if (!user) return false;
  return hasRole(user, PERMISSIONS[permission]);
}
