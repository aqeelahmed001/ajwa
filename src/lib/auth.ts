import { Session } from 'next-auth';

// Define UserRole type here to avoid importing from server-side models
export type UserRole = 'admin' | 'editor' | 'viewer' | string;

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

// Get user from session
export function getUserFromSession(session: Session | null) {
  if (!session?.user) return null;
  return session.user;
}
