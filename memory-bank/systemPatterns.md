# System Patterns - Ajwa Trading Limited Website

## Architecture Overview

### Frontend Architecture
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with component libraries
- **Components**: Radix UI + Material UI + Shadcn UI hybrid approach
- **State Management**: React hooks + Context API
- **Internationalization**: i18next for multilingual support

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: MongoDB or PostgreSQL (to be determined)
- **API Design**: RESTful endpoints
- **Authentication**: JWT for admin access

## Key Design Patterns

### Component Architecture
```
/components
  /ui          # Reusable UI components (Shadcn + custom)
  /layout      # Layout components (Header, Footer, etc.)
  /sections    # Page sections (Hero, CTA, Services, etc.)
  /forms       # Form components with validation
```

### Routing Pattern
```
/app/[lang]    # Language-based routing
  /page.tsx    # Homepage
  /about/      # About page
  /services/   # Services page
  /contact/    # Contact page
  /listings/   # Machinery listings (future)
```

### Data Flow Patterns
1. **Props Down**: Data flows down through component hierarchy
2. **Events Up**: User interactions bubble up to parent components
3. **Context for Global State**: Language, theme, user preferences
4. **API Integration**: Custom hooks for data fetching

## Technical Decisions

### UI Component Strategy
- **Shadcn UI**: Primary component library for consistency
- **Radix UI**: Accessible primitives for complex components
- **Material UI**: Specific components where needed
- **Custom Components**: Business-specific machinery components

### Internationalization Approach
- **Route-based**: `/en/...` and `/ja/...` URL structure
- **File-based**: JSON translation files in `/locales`
- **Component-level**: Translation keys at component level
- **SEO-friendly**: Proper meta tags per language

### Responsive Design
- **Mobile-first**: Design for mobile, enhance for desktop
- **Breakpoints**: Standard Tailwind breakpoints
- **Flexible Grid**: CSS Grid + Flexbox for layouts
- **Progressive Enhancement**: Core functionality works everywhere

## Security Patterns
- **Input Validation**: All form inputs validated client and server-side
- **CSRF Protection**: Cross-site request forgery protection
- **Rate Limiting**: API endpoint rate limiting
- **Secure Headers**: Security headers for all responses

## Performance Patterns
- **Code Splitting**: Route-based code splitting
- **Image Optimization**: Next.js Image component
- **Static Generation**: Static pages where possible
- **Lazy Loading**: Components loaded on demand 