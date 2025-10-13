# Technical Context - Ajwa Trading Limited Website

## Technology Stack

### Frontend Technologies
- **React 18+**: Modern React with hooks and concurrent features
- **Next.js 14+**: App Router, server components, static generation
- **TypeScript**: Type safety and better development experience
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible, unstyled UI primitives
- **Material UI**: Comprehensive React component library
- **Shadcn UI**: Modern component library built on Radix
- **i18next**: Internationalization framework with React integration

### Backend Technologies
- **Node.js**: JavaScript runtime for server-side development
- **Express.js**: Web framework for Node.js
- **TypeScript**: Type-safe backend development
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: ODM for MongoDB
- **JWT**: JSON Web Tokens for authentication
- **Nodemailer**: Email functionality for contact forms

### Development Tools
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
- **Jest**: Testing framework
- **React Testing Library**: Component testing
- **Cypress**: End-to-end testing

## Project Structure

### Frontend Structure
```
/app
  /[lang]/              # Internationalized routing
    /page.tsx           # Homepage
    /about/             # About page
    /services/          # Services page
    /contact/           # Contact page
    /layout.tsx         # Layout wrapper
    /loading.tsx        # Loading UI
    /error.tsx          # Error UI
  /api/                 # API routes
  /globals.css          # Global styles
  /layout.tsx           # Root layout

/components
  /ui/                  # Shadcn UI components
    /button.tsx
    /card.tsx
    /input.tsx
  /layout/              # Layout components
    /header.tsx
    /footer.tsx
    /navigation.tsx
  /sections/            # Page sections
    /hero.tsx
    /cta.tsx
    /services.tsx
    /contact.tsx
  /forms/               # Form components
    /contact-form.tsx

/lib
  /utils.ts             # Utility functions
  /i18n.ts              # Internationalization config
  /validations.ts       # Form validation schemas

/locales
  /en/
    /common.json
    /navigation.json
    /sections.json
  /ja/
    /common.json
    /navigation.json
    /sections.json

/public
  /images/
  /icons/
  /favicon.ico
```

### Backend Structure
```
/server
  /src
    /controllers/       # Route controllers
    /models/           # Database models
    /routes/           # API routes
    /middleware/       # Custom middleware
    /utils/            # Utility functions
    /config/           # Configuration files
  /tests/              # Backend tests
```

## Development Setup

### Environment Requirements
- Node.js 18+ (LTS recommended)
- npm or yarn package manager
- Git for version control
- VS Code (recommended) with extensions:
  - TypeScript
  - Tailwind CSS IntelliSense
  - ESLint
  - Prettier

### Environment Variables
```
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Backend (.env)
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/ajwa-trading
JWT_SECRET=your-secret-key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## Technical Constraints

### Performance Requirements
- First Contentful Paint < 2s
- Largest Contentful Paint < 3s
- Cumulative Layout Shift < 0.1
- Time to Interactive < 5s

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Graceful degradation for older browsers

### Accessibility Requirements
- WCAG 2.1 AA compliance
- Screen reader compatibility
- Keyboard navigation support
- Focus management

## Deployment Strategy

### Frontend Deployment
- **Platform**: Vercel or Netlify
- **Build**: Static site generation where possible
- **CDN**: Automatic CDN distribution
- **SSL**: HTTPS by default

### Backend Deployment
- **Platform**: Railway, Heroku, or AWS
- **Database**: MongoDB Atlas or PostgreSQL
- **Environment**: Production environment variables
- **Monitoring**: Error tracking and performance monitoring 