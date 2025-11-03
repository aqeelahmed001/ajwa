import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Role from '@/models/Role';
// Define permissions directly to avoid circular imports
const DEFAULT_ROLE_PERMISSIONS = {
  admin: [
    'dashboard.view', 'dashboard.analytics',
    'users.view', 'users.create', 'users.edit', 'users.delete', 'users.activate',
    'roles.view', 'roles.create', 'roles.edit', 'roles.delete', 'roles.assign',
    'content.view', 'content.create', 'content.edit', 'content.delete', 'content.publish',
    'settings.view', 'settings.edit',
    'activity.view', 'activity.export'
  ],
  editor: [
    'dashboard.view', 'dashboard.analytics',
    'content.view', 'content.create', 'content.edit', 'content.publish'
  ],
  viewer: [
    'dashboard.view',
    'content.view'
  ]
};

// This is a one-time setup route to create the initial admin user and roles
export async function POST(request: NextRequest) {
  try {
    // Connect to database
    try {
      await connectToDatabase();
      console.log('Database connection established');
    } catch (dbError: any) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { success: false, message: 'Database connection failed: ' + (dbError.message || 'Unknown error') },
        { status: 500 }
      );
    }
    
    // Check if any users exist in the system
    const userCount = await User.countDocuments();
    console.log(`Found ${userCount} existing users in the database`);

    // Create default roles if they don't exist
    const roleNames = ['admin', 'editor', 'viewer'] as const;
    type RoleName = typeof roleNames[number];
    
    const roleDescriptions: Record<RoleName, string> = {
      admin: 'Administrator with full access',
      editor: 'Editor with content management access',
      viewer: 'Viewer with read-only access'
    };
    
    const roles: Record<string, any> = {};
    
    for (const roleName of roleNames) {
      let role = await Role.findOne({ name: roleName });
      
      if (!role) {
        // Generate a slug from the name
        const slug = roleName.toLowerCase().replace(/\s+/g, '-');
        
        // Create role with slug
        role = new Role({
          name: roleName,
          description: roleDescriptions[roleName as RoleName],
          permissions: DEFAULT_ROLE_PERMISSIONS[roleName as keyof typeof DEFAULT_ROLE_PERMISSIONS] || [],
          isSystem: true,
          // Add any missing fields that might be in the database schema
          slug: slug,
        });
        await role.save();
        console.log(`Created ${roleName} role`);
      }
      
      roles[roleName] = role;
    }

    // Create initial admin user if no users exist in the system
    // This is just for initial setup - after this, all user management should be done through the admin interface
    const initialAdminEmail = 'admin@ajwatrading.com';
    const initialAdminPassword = 'admin123';
    
    let adminUser = await User.findOne({ email: initialAdminEmail });
    
    if (!adminUser) {
      adminUser = new User({
        name: 'Admin User',
        email: initialAdminEmail,
        password: initialAdminPassword,
        role: 'admin',
        roleId: roles['admin']._id,
        isActive: true,
      });
      
      await adminUser.save();
      console.log('Created admin user');
    } else {
      console.log('Admin user already exists');
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database initialization completed successfully',
      usersCreated: userCount === 0 ? 1 : 0,
      rolesCreated: Object.keys(roles).length,
      user: adminUser ? {
        id: adminUser._id ? adminUser._id.toString() : 'unknown',
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
      } : null,
      roles: Object.fromEntries(
        Object.entries(roles).map(([name, role]) => [name, role._id ? role._id.toString() : null])
      )
    }, { status: 201 });
  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to complete setup' },
      { status: 500 }
    );
  }
}
