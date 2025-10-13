# Ajwa Trading Admin Panel

This document provides instructions for setting up and using the admin panel for the Ajwa Trading website.

## Overview

The admin panel is integrated directly into the Next.js project, allowing you to manage website content without accessing the backend code. It uses MongoDB as a database to store content.

## Setup Instructions

### 1. Environment Variables

Make sure your `.env.local` file contains the following variables:

```
# MongoDB Connection
MONGODB_URI=mongodb+srv://ajwa:CI0Mrmjr3BufidoA@ajwa.d0pdxso.mongodb.net/ajwa_db
MONGODB_DB=ajwa_db

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_SECRET=your-nextauth-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000

# Admin credentials (for development only, use database in production)
ADMIN_EMAIL=admin@ajwatrading.com
ADMIN_PASSWORD=admin123
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Initialize Database

To seed the database with initial data:

```bash
npm run seed-db
```

### 4. Run the Development Server

```bash
npm run dev
```

## Accessing the Admin Panel

1. Navigate to `http://localhost:3000/admin`
2. Login with the credentials:
   - Email: `admin@ajwatrading.com`
   - Password: `admin123`

## Admin Panel Features

### Dashboard

The dashboard provides an overview of your website content and quick access to common tasks.

### Machinery Management

Access the machinery management section to:
- View all machinery items
- Add new machinery items
- Edit existing machinery items
- Delete machinery items

### Content Management

Manage website content including:
- Page content
- Hero sections
- Content sections

### User Management

Manage admin users with different permission levels:
- Admin: Full access to all features
- Editor: Can create and edit content, but cannot manage users
- Viewer: Read-only access to content

## Database Structure

The project uses MongoDB with the following collections:

1. **MachineryItems**: Stores all machinery listings
2. **PageContent**: Stores website page content
3. **Users**: Stores admin user accounts

## API Routes

The admin panel interacts with the following API endpoints:

- `/api/auth/login`: Authentication
- `/api/auth/logout`: Logout
- `/api/content/machinery`: CRUD operations for machinery items
- `/api/content/machinery/[id]`: Operations on individual machinery items
- `/api/upload`: Image upload handling

## Production Deployment

Before deploying to production:

1. Change all default passwords and secrets
2. Set up proper authentication with JWT
3. Configure secure image storage (e.g., AWS S3)
4. Enable HTTPS
5. Set up proper database backups

## Troubleshooting

If you encounter issues:

1. Check MongoDB connection string
2. Ensure all dependencies are installed
3. Check for errors in the browser console or server logs
4. Verify that the uploads directory is writable

## Support

For additional support, please contact the development team.
