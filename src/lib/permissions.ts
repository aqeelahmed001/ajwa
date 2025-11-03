/**
 * Centralized permissions management for the application
 */

export interface Permission {
  key: string;
  name: string;
  description: string;
  category: string;
}

// Define all available permissions
export const PERMISSIONS: Permission[] = [
  // Dashboard permissions
  {
    key: 'dashboard.view',
    name: 'View Dashboard',
    description: 'Access to view the admin dashboard',
    category: 'Dashboard',
  },
  {
    key: 'dashboard.analytics',
    name: 'View Analytics',
    description: 'Access to view analytics data',
    category: 'Dashboard',
  },
  
  // User management permissions
  {
    key: 'users.view',
    name: 'View Users',
    description: 'Access to view user list',
    category: 'User Management',
  },
  {
    key: 'users.create',
    name: 'Create Users',
    description: 'Ability to create new users',
    category: 'User Management',
  },
  {
    key: 'users.edit',
    name: 'Edit Users',
    description: 'Ability to edit existing users',
    category: 'User Management',
  },
  {
    key: 'users.delete',
    name: 'Delete Users',
    description: 'Ability to delete users',
    category: 'User Management',
  },
  {
    key: 'users.activate',
    name: 'Activate/Deactivate Users',
    description: 'Ability to activate or deactivate users',
    category: 'User Management',
  },
  
  // Role management permissions
  {
    key: 'roles.view',
    name: 'View Roles',
    description: 'Access to view roles list',
    category: 'Role Management',
  },
  {
    key: 'roles.create',
    name: 'Create Roles',
    description: 'Ability to create new roles',
    category: 'Role Management',
  },
  {
    key: 'roles.edit',
    name: 'Edit Roles',
    description: 'Ability to edit existing roles',
    category: 'Role Management',
  },
  {
    key: 'roles.delete',
    name: 'Delete Roles',
    description: 'Ability to delete roles',
    category: 'Role Management',
  },
  {
    key: 'roles.assign',
    name: 'Assign Roles',
    description: 'Ability to assign roles to users',
    category: 'Role Management',
  },
  
  // Content management permissions
  {
    key: 'content.view',
    name: 'View Content',
    description: 'Access to view content',
    category: 'Content Management',
  },
  {
    key: 'content.create',
    name: 'Create Content',
    description: 'Ability to create new content',
    category: 'Content Management',
  },
  {
    key: 'content.edit',
    name: 'Edit Content',
    description: 'Ability to edit existing content',
    category: 'Content Management',
  },
  {
    key: 'content.delete',
    name: 'Delete Content',
    description: 'Ability to delete content',
    category: 'Content Management',
  },
  {
    key: 'content.publish',
    name: 'Publish Content',
    description: 'Ability to publish or unpublish content',
    category: 'Content Management',
  },
  
  // Settings permissions
  {
    key: 'settings.view',
    name: 'View Settings',
    description: 'Access to view system settings',
    category: 'Settings',
  },
  {
    key: 'settings.edit',
    name: 'Edit Settings',
    description: 'Ability to edit system settings',
    category: 'Settings',
  },
  
  // Activity log permissions
  {
    key: 'activity.view',
    name: 'View Activity Logs',
    description: 'Access to view activity logs',
    category: 'Activity Logs',
  },
  {
    key: 'activity.export',
    name: 'Export Activity Logs',
    description: 'Ability to export activity logs',
    category: 'Activity Logs',
  },
];

// Get all permission categories
export const getPermissionCategories = (): string[] => {
  const categories = new Set<string>();
  PERMISSIONS.forEach(permission => categories.add(permission.category));
  return Array.from(categories);
};

// Get permissions by category
export const getPermissionsByCategory = (category: string): Permission[] => {
  return PERMISSIONS.filter(permission => permission.category === category);
};

// Check if a user has a specific permission
export const hasPermission = (userPermissions: string[], permissionKey: string): boolean => {
  return userPermissions.includes(permissionKey);
};

// Define default role permissions
export const DEFAULT_ROLE_PERMISSIONS = {
  admin: PERMISSIONS.map(p => p.key),
  editor: [
    'dashboard.view',
    'content.view',
    'content.create',
    'content.edit',
    'content.publish',
  ],
  viewer: [
    'dashboard.view',
    'content.view',
  ],
};

// Get permission by key
export const getPermissionByKey = (key: string): Permission | undefined => {
  return PERMISSIONS.find(permission => permission.key === key);
};
