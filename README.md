# Ajwa Trading Limited - Machinery Export & Import Website

A modern, multilingual website for Ajwa Trading Limited, a Japan-based machinery export and import company.

## 🚀 Project Overview

This website serves the dual purpose of:
- **Exporting machinery worldwide** - Showcasing quality Japanese machinery to international buyers
- **Buying used machinery** - Providing a platform for Japanese customers to sell their used machinery

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - Modern component library
- **Radix UI** - Accessible UI primitives
- **Lucide React** - Beautiful icons

### Future Backend (Planned)
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication

## 🌍 Features

- **Multilingual Support** - English (`/en`) and Japanese (`/ja`) routes
- **Responsive Design** - Mobile-first approach
- **SEO Optimized** - Multi-language meta tags and structured data
- **Accessibility** - WCAG 2.1 AA compliant
- **Performance** - Optimized for Core Web Vitals

## 📂 Project Structure

```
ajwa/
├── src/
│   ├── app/
│   │   ├── [lang]/          # Language-based routing
│   │   │   ├── page.tsx     # Homepage
│   │   │   └── layout.tsx   # Language layout
│   │   ├── page.tsx         # Root redirect
│   │   └── layout.tsx       # Root layout
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   ├── layout/          # Layout components
│   │   ├── sections/        # Page sections
│   │   └── forms/           # Form components
│   ├── lib/
│   │   └── utils.ts         # Utility functions
│   └── styles/
│       └── globals.css      # Global styles
├── locales/
│   ├── en/                  # English translations
│   └── ja/                  # Japanese translations
├── public/
│   ├── images/              # Static images
│   └── icons/               # Icon files
└── memory-bank/             # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd ajwa
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - English: http://localhost:3000/en
   - Japanese: http://localhost:3000/ja
   - Root (redirects to English): http://localhost:3000

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🎨 Design System

### Hero Section
The hero section features the distinctive "We Buy & Sell Machinery" design:
- **"We Buy"** - Aligned left
- **"& Sell Machinery"** - Aligned right
- Responsive typography with animations
- Multilingual support

### Color Scheme
- **Primary**: Professional dark colors for trust
- **Secondary**: Light grays for accessibility
- **Accent**: Carefully chosen colors for CTAs

### Typography
- **Font**: Inter for clean, professional appearance
- **Scale**: Responsive typography system
- **Hierarchy**: Clear content hierarchy

## 🌐 Internationalization

### Supported Languages
- **English** (`en`) - Primary language
- **Japanese** (`ja`) - Secondary language

### URL Structure
- `/en/` - English pages
- `/ja/` - Japanese pages
- `/` - Redirects to `/en/`

### Adding Translations
1. Add content to `locales/en/` and `locales/ja/`
2. Use translation keys in components
3. Update metadata for SEO

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Mobile-First Approach
All designs start with mobile and enhance for larger screens.

## 🔧 Development Guidelines

### Code Style
- TypeScript strict mode
- ESLint + Prettier for consistency
- Tailwind CSS for styling
- Component-driven development

### Component Structure
- **UI Components**: Reusable, styled components
- **Layout Components**: Header, Footer, Navigation
- **Section Components**: Hero, CTA, Services, Contact
- **Form Components**: Contact forms, validation

### Performance
- Next.js Image optimization
- Code splitting by route
- Lazy loading for non-critical components
- Optimized bundle sizes

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Platform Recommendations
- **Vercel** - Optimized for Next.js
- **Netlify** - Great for static sites
- **AWS** - For full control

## 📋 Project Status

### ✅ Completed
- [x] Next.js 14 project setup
- [x] TypeScript configuration
- [x] Tailwind CSS integration
- [x] Basic project structure
- [x] Multilingual routing
- [x] Hero section with dual messaging
- [x] Services section
- [x] Contact section
- [x] Responsive design

### 🔄 In Progress
- [ ] Component library integration (Shadcn UI)
- [ ] i18next configuration
- [ ] Advanced animations
- [ ] Contact form functionality

### 📋 Planned
- [ ] Backend API
- [ ] Admin dashboard
- [ ] Machinery listing system
- [ ] Email notifications
- [ ] SEO enhancements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or support, please contact:
- **Email**: [contact@ajwa-trading.com]
- **Website**: [www.ajwa-trading.com]

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ for Ajwa Trading Limited 