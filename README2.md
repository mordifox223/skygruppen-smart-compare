
# Skygruppen Compare - Documentation

## Overview
Skygruppen Compare is a comprehensive web application designed to help users compare different service providers across multiple categories including insurance, electricity, mobile plans, and banking services. The application is built with React, TypeScript, and utilizes modern frontend technologies to create a responsive and user-friendly interface.

## Tech Stack
- **React**: Frontend library for building user interfaces
- **TypeScript**: For type safety and better developer experience
- **React Router**: For page navigation and routing
- **Tailwind CSS**: For styling and responsive design
- **Shadcn UI**: For pre-built UI components
- **Lucide React**: For icons
- **QRCode.react**: For generating shareable QR codes

## Application Structure

### Core Components

#### Language System
- `LanguageContext.tsx`: Provides a context for language switching between Norwegian (nb) and English (en)
- `LanguageToggle.tsx`: UI component that allows users to switch between languages
- `i18n.ts`: Internationalization utilities and language strings

#### Layout Components
- `Header.tsx`: Navigation bar with language switcher and category links
- `Footer.tsx`: Page footer with company information and links

#### Comparison System
- `CategoryCard.tsx`: Displays available comparison categories on the home page
- `ComparisonTable.tsx`: Core component for displaying provider comparisons with filtering/sorting
- `ProviderCard.tsx`: Displays individual provider information with ratings and features
- `QRCodeGenerator.tsx`: Generates shareable QR codes for comparison results

### Pages
- `Index.tsx`: The landing page showing all available categories
- `Compare.tsx`: The comparison page for a specific category
- `NotFound.tsx`: 404 error page

### Data Model
The application uses TypeScript interfaces to define its data structures:

- `Language`: Type defining supported languages ('nb' | 'en')
- `Category`: Interface for category data including multilingual name and description
- `Provider`: Interface for provider data including pricing, features, and ratings
- `ComparisonFilters`: Interface for filtering and sorting options

### Design System
The application uses a consistent color scheme:
- Primary colors: Sky blue variants for general UI elements
- Category-specific colors: Different colors for different categories (e.g., emerald for electricity, blue for insurance)
- UI elements use Shadcn UI components for consistency

## How It Works

### User Flow
1. User lands on the home page and sees available comparison categories
2. User selects a category to compare (e.g., insurance, mobile plans)
3. User is taken to a comparison page showing all providers in that category
4. User can filter and sort providers based on various criteria
5. User can select a provider to visit their website

### Internationalization
- All text content is available in both Norwegian and English
- Language can be switched using the language toggle in the header
- The selected language is stored in React context and applied throughout the app

### Responsive Design
- Mobile-first approach with tailored layouts for different screen sizes
- Mobile menu for smaller screens with hamburger icon
- Responsive grid layouts that adjust based on screen width

### Provider Data
- Provider information includes logos, pricing, features, and ratings
- Providers can be sorted by price, rating, or name
- Filtering allows users to narrow down providers based on criteria like minimum rating

## Future Development
- Backend integration for real-time data from providers
- User accounts for saving comparisons
- More detailed comparison views with feature-by-feature analysis
- Additional categories of providers
- Advanced filtering options

## File Structure
```
src/
├── components/
│   ├── ui/              # Shadcn UI components
│   ├── CategoryCard.tsx # Category display component
│   ├── ComparisonTable.tsx # Main comparison component
│   ├── Header.tsx       # Navigation header
│   ├── Footer.tsx       # Page footer
│   ├── LanguageToggle.tsx # Language switcher
│   ├── ProviderCard.tsx # Provider display component
│   └── QRCodeGenerator.tsx # QR code generation component
├── lib/
│   ├── i18n.ts          # Translation utilities
│   ├── languageContext.tsx # Language context provider
│   ├── types.ts         # TypeScript interfaces
│   └── utils.ts         # Utility functions
├── pages/
│   ├── Compare.tsx      # Comparison page
│   ├── Index.tsx        # Home page
│   └── NotFound.tsx     # 404 page
└── App.tsx              # Main application component
```

## How to Use the Site
1. Browse available categories on the home page
2. Click on a category to see provider comparisons
3. Use filters and sorting to find the best provider for your needs
4. Click on "Select provider" to visit the provider's website
5. Use the language toggle to switch between Norwegian and English

## How to Extend
- Add new providers in the i18n.ts file following the existing provider format
- Create new categories by adding to the categories array in i18n.ts
- Customize category colors in the ProviderCard component
