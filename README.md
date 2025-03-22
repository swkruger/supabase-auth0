# FiFolio - Next.js with Auth0 and Supabase Integration

FiFolio is a modern web application built with Next.js, featuring integrated authentication via Auth0 and database functionality powered by Supabase.

## Introduction

This application demonstrates a production-ready integration between Auth0 for authentication and Supabase for data storage. It uses Next.js App Router for efficient routing and React server components for optimal performance.

Key features:
- Auth0 authentication with secure session management
- Supabase database integration with row-level security
- User synchronization between Auth0 and Supabase
- Modern UI with Tailwind CSS and shadcn/ui components
- TypeScript for type safety

## Project Structure

```
├── database/               # Database schema and migration files
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router pages and API routes
│   │   ├── api/            # API routes including Auth0 endpoints
│   │   │   ├── auth/       # Auth0 authentication endpoints 
│   │   │   └── todos/      # Todo API endpoints (example functionality)
│   │   ├── components/     # App-specific React components
│   │   ├── contexts/       # React context providers
│   │   └── [routes]/       # App routes (dashboard, settings, etc.)
│   ├── components/         # Shared React components
│   ├── lib/                # Utility functions and libraries
│   │   └── supabase.ts     # Supabase client configuration
│   └── middleware.ts       # Next.js middleware for auth and security
└── .env.local              # Environment variables (not in repo)
```

## Main Platform Features

### Authentication Flow

1. Users authenticate with Auth0 via `/api/auth/login`
2. After successful Auth0 login, user data is synchronized to Supabase via API
3. User sessions are maintained securely through HTTP-only cookies
4. Middleware ensures protected routes require authentication

### Supabase Integration

The application uses Supabase as the primary database with the following features:

- **Data Schema**: Tables for users, folios, categories, field groups, and fields
- **Security**: Row-level security (RLS) policies ensure data access control
- **API Layer**: Server-side API routes use `supabaseAdmin` client for database operations
- **User Sync**: Auth0 users are automatically synchronized to Supabase for permissions

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- Auth0 account and configured application
- Supabase project

### Environment Setup

Create a `.env.local` file with the following variables:

```
# Auth0 configuration
AUTH0_SECRET=your-auth0-secret
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-tenant.us.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_SCOPE="openid profile email"

# Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
```

### Development

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Next.js Cheatsheet

### Common Commands

```bash
# Create a new Next.js app
npx create-next-app@latest my-app

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

### Key Concepts

- **App Router**: File-based routing system in the `app/` directory
- **Server Components**: Default components that render on the server
- **Client Components**: Components using "use client" directive
- **Route Handlers**: API endpoints in `app/api/` directory
- **Middleware**: Global request handlers in `middleware.ts`

## Supabase Cheatsheet

### Common Operations

```typescript
// Basic query
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('column', 'value')

// Insert data
const { data, error } = await supabase
  .from('table_name')
  .insert([{ column: 'value' }])

// Update data
const { data, error } = await supabase
  .from('table_name')
  .update({ column: 'new_value' })
  .eq('id', 'record_id')

// Delete data
const { data, error } = await supabase
  .from('table_name')
  .delete()
  .eq('id', 'record_id')
```

### Authentication with Auth0 JWT

```typescript
// Create authenticated client
const supabaseWithAuth = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    global: {
      headers: {
        Authorization: `Bearer ${auth0Token}`
      }
    }
  }
)
```

## NPM Tasks

This project includes the following npm scripts:

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint

# Install new dependency
npm install package-name

# Install dev dependency
npm install --save-dev package-name

# Update dependencies
npm update
```

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Auth0 Next.js SDK](https://github.com/auth0/nextjs-auth0)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
