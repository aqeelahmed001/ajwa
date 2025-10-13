# MongoDB Integration for Ajwa Trading Website

This document provides an overview of the MongoDB integration for the Ajwa Trading website.

## Overview

We've integrated MongoDB with the Next.js project to store and manage content for the website. This allows the client to manage content through the admin panel without needing to access the backend code.

## Implementation Details

### 1. Database Connection

- Created a MongoDB Atlas account and database
- Set up connection string in `.env.local` file
- Implemented a connection utility in `src/lib/db.ts` with connection pooling for optimal performance

### 2. Data Models

We've created the following data models:

#### MachineryItem Model
- Stores machinery listings with details like name, category, manufacturer, price, etc.
- Includes support for images, specifications, and tags
- Automatically formats price in USD and JPY

#### PageContent Model
- Stores website page content with multilingual support (English and Japanese)
- Structured as content blocks that can be arranged in any order
- Supports various content types: text, image, hero, gallery, CTA, and feature sections

#### User Model
- Stores admin user accounts with role-based permissions
- Includes secure password hashing with bcrypt
- Supports different user roles: admin, editor, and viewer

### 3. API Routes

We've implemented the following API routes to interact with the database:

- `/api/content/machinery`: CRUD operations for machinery items
- `/api/content/machinery/[id]`: Operations on individual machinery items
- `/api/auth/login`: User authentication
- `/api/auth/logout`: User logout
- `/api/upload`: Image upload handling

### 4. Admin Panel

The admin panel provides a user-friendly interface to manage content:

- Dashboard with content overview
- Machinery management section
- Content management section
- User management section
- Settings section

### 5. Utilities

We've created several utility scripts to help with database management:

- `npm run seed-db`: Seeds the database with initial data
- `npm run test-db`: Tests the database connection

## Security Considerations

- Passwords are hashed using bcrypt before storage
- Authentication is handled with secure cookies
- Role-based access control restricts access to sensitive operations
- Environment variables are used for sensitive information

## Next Steps

1. **Production Deployment**:
   - Set up proper environment variables in production
   - Configure database backups
   - Enable database monitoring

2. **Performance Optimization**:
   - Implement caching for frequently accessed data
   - Add pagination for large data sets
   - Optimize database queries

3. **Additional Features**:
   - Implement full-text search for machinery items
   - Add analytics for content performance
   - Set up automated backups

## Troubleshooting

If you encounter database connection issues:

1. Verify the MongoDB connection string in `.env.local`
2. Check network connectivity to MongoDB Atlas
3. Run `npm run test-db` to test the connection
4. Check for any error messages in the console

For more detailed information, refer to the `ADMIN-README.md` file.
