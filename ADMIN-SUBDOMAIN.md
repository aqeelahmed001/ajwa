# Admin Subdomain Setup

This document explains how to set up and use the admin subdomain for the Ajwa Trading website.

## Overview

The admin panel is configured to run on a separate subdomain (`admin.yourdomain.com`) in production, which provides several security benefits:

1. **Obscurity**: Makes the admin panel less predictable for potential attackers
2. **Isolation**: Separates admin functionality from the main website
3. **Security**: Allows for domain-specific security policies

## How It Works

The implementation uses Next.js middleware to handle subdomain routing:

1. In development, the admin panel is accessible at `/admin` on localhost
2. In production, the admin panel is accessible at `admin.yourdomain.com`

## DNS Configuration

To set up the admin subdomain in production, you need to configure your DNS settings:

1. Log in to your domain registrar or DNS provider
2. Add a new CNAME record:
   - Type: CNAME
   - Name: admin
   - Value: @ (or your apex domain)
   - TTL: 3600 (or as recommended by your provider)

## Environment Variables

The system uses environment variables to determine the correct URLs:

- `.env.development`: Contains development settings (localhost)
- `.env.production`: Contains production settings (actual domain)

## Testing Locally

To test the subdomain routing locally:

1. Edit your hosts file:
   - On macOS/Linux: `/etc/hosts`
   - On Windows: `C:\\Windows\\System32\\drivers\\etc\\hosts`

2. Add these lines:
   ```
   127.0.0.1 yourdomain.local
   127.0.0.1 admin.yourdomain.local
   ```

3. Run the development server with the hostname flag:
   ```bash
   npm run dev -- -H yourdomain.local
   ```

4. Access the admin panel at `http://admin.yourdomain.local:3000`

## Production Deployment

When deploying to production:

1. Ensure your DNS is properly configured
2. Set up SSL certificates for both the main domain and admin subdomain
3. Configure your hosting provider to handle subdomains correctly
4. Set the correct environment variables in your deployment platform

## Security Considerations

- Always use HTTPS for both the main domain and admin subdomain
- Implement proper authentication for the admin panel
- Consider adding IP restrictions for the admin subdomain
- Use strong, unique passwords for admin accounts
- Enable two-factor authentication if possible

## Troubleshooting

If you encounter issues with the admin subdomain:

1. Verify DNS settings are correct and have propagated
2. Check that SSL certificates are valid for both domains
3. Ensure the middleware is correctly handling the subdomain routing
4. Check environment variables are set correctly in your deployment platform
