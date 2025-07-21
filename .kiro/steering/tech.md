# Technical Stack & Development Guidelines

## Core Technologies
- **Framework**: Next.js 15.4.1 (App Router)
- **Language**: TypeScript 5
- **UI**: React 19.1.0
- **Styling**: Tailwind CSS 4
- **Authentication**: Clerk
- **Database**: Neon (PostgreSQL)
- **Storage**: Vercel Blob
- **Animations**: Framer Motion

## UI Component Library
The project uses a custom UI component library built with:
- Radix UI primitives
- Tailwind CSS for styling
- Class Variance Authority (CVA) for component variants
- clsx/tailwind-merge for class name management

## Project Commands
```bash
# Development (with Turbopack)
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Linting
npm run lint
```

## Authentication & Authorization
- Clerk is used for authentication
- Custom role-based access control via Clerk metadata
- Middleware protection for admin routes

## Data Fetching Patterns
- React Server Components for server-side data fetching
- Custom hooks with SWR-like patterns for client-side data fetching
- Error handling with retry mechanisms

## Error Handling
- Structured error handling with error codes
- Retry utilities for transient errors
- Consistent error logging

## Storage
- Vercel Blob for file storage
- Support for various file types with size limits
- Client-side upload with progress tracking