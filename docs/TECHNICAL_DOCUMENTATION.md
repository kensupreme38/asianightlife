# 📚 TECHNICAL DOCUMENTATION
## Asia Night Life Platform - Technical Documentation

**Version:** 1.0.0  
**Created:** 28/01/2026  
**Project:** Asia Night Life - Premier Entertainment Venue Booking Platform

---

## 📋 TABLE OF CONTENTS

1. [System Overview](#1-system-overview)
2. [System Architecture](#2-system-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Project Structure](#4-project-structure)
5. [Database Schema](#5-database-schema)
6. [API Endpoints](#6-api-endpoints)
7. [Main Features](#7-main-features)
8. [Installation and Deployment](#8-installation-and-deployment)
9. [Environment Configuration](#9-environment-configuration)
10. [Security](#10-security)
11. [Performance Optimization](#11-performance-optimization)
12. [SEO and Accessibility](#12-seo-and-accessibility)
13. [Development Process](#13-development-process)
14. [Troubleshooting](#14-troubleshooting)
15. [Maintenance and Support](#15-maintenance-and-support)

---

## 1. SYSTEM OVERVIEW

### 1.1. Project Description

**Asia Night Life** is a modern web platform for searching, discovering, and booking nightlife entertainment venues (KTV, Club, Live House) in Southeast Asian countries such as Singapore, Vietnam, Thailand, and Malaysia.

### 1.2. Main Objectives

- Provide a rich venue directory with detailed information
- DJ voting system with ranking
- Employee management and referral system
- Multi-language support for 8 languages
- SEO and performance optimization
- Responsive design for all devices

### 1.3. User Types

- **End Users**: Customers searching and booking venues
- **DJs**: DJs registering profiles and receiving votes
- **Employees**: Employees managing personal information
- **Admins**: System administrators

---

## 2. SYSTEM ARCHITECTURE

### 2.1. Overall Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Browser    │  │   Mobile     │  │   Tablet     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                        │ HTTPS
                        ▼
┌─────────────────────────────────────────────────────────┐
│              NEXT.JS APPLICATION LAYER                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Pages      │  │   API Routes │  │  Components  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Middleware  │  │   i18n       │  │   Auth       │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│              BACKEND SERVICES                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Supabase   │  │   Storage    │  │   Auth       │ │
│  │   Database   │  │   (Images)   │  │   Service    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 2.2. Application Architecture

**Next.js 15 App Router Architecture:**
- **Server Components**: Render on server, reduce bundle size
- **Client Components**: Client-side interactions with `"use client"`
- **API Routes**: RESTful API endpoints in `/app/api`
- **Middleware**: Handle routing, authentication, i18n

### 2.3. Data Flow

```
User Action → Client Component → API Route → Supabase → Database
                ↓
         State Update → UI Re-render
```

---

## 3. TECHNOLOGY STACK

### 3.1. Frontend Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 15.5.7 | React framework with SSR/SSG |
| **React** | 18.3.1 | UI library |
| **TypeScript** | 5.8.3 | Type safety |
| **Tailwind CSS** | 3.4.17 | Utility-first CSS |
| **Framer Motion** | 11.18.2 | Animations |
| **Radix UI** | Latest | Accessible UI components |
| **shadcn/ui** | - | Component library |
| **next-intl** | 4.5.5 | Internationalization |
| **next-themes** | 0.3.0 | Dark/Light mode |

### 3.2. Backend Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Supabase** | 2.80.0 | Backend-as-a-Service |
| **PostgreSQL** | (via Supabase) | Database |
| **Supabase Auth** | - | Authentication |
| **Supabase Storage** | - | File storage |

### 3.3. Development Tools

| Technology | Version | Purpose |
|-----------|---------|---------|
| **ESLint** | 8.57.0 | Code linting |
| **PostCSS** | 8.5.6 | CSS processing |
| **Autoprefixer** | 10.4.21 | CSS vendor prefixes |

### 3.4. Deployment

- **Platform**: Vercel / Firebase App Hosting
- **CDN**: Vercel Edge Network
- **Domain**: asianightlife.sg

---

## 4. PROJECT STRUCTURE

### 4.1. Directory Structure

```
asianightlife/
├── .next/                  # Next.js build output
├── .idx/                   # Cursor IDE config
├── messages/               # i18n translation files
│   ├── en.json
│   ├── vi.json
│   ├── zh.json
│   ├── id.json
│   ├── ja.json
│   ├── ko.json
│   ├── ru.json
│   └── th.json
├── public/                 # Static assets
│   ├── logo.jpg
│   ├── manifest.json
│   └── sw.js              # Service Worker
├── src/
│   ├── ai/                # AI/Genkit integration
│   │   ├── dev.ts
│   │   ├── genkit.ts
│   │   └── flows/
│   ├── app/               # Next.js App Router
│   │   ├── [locale]/     # Localized routes
│   │   │   ├── dj/
│   │   │   ├── venue/
│   │   │   ├── employee/
│   │   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── api/          # API routes
│   │   │   ├── djs/
│   │   │   ├── venues/
│   │   │   ├── employees/
│   │   │   ├── votes/
│   │   │   └── stats/
│   │   ├── auth/         # Auth callbacks
│   │   ├── layout.tsx    # Root layout
│   │   ├── globals.css
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── components/        # React components
│   │   ├── animations/   # Framer Motion components
│   │   ├── auth/         # Auth components
│   │   ├── dj/           # DJ-related components
│   │   ├── employee/     # Employee components
│   │   ├── home/         # Homepage components
│   │   ├── layout/       # Layout components
│   │   ├── venue/        # Venue components
│   │   └── ui/           # shadcn/ui components
│   ├── contexts/         # React contexts
│   │   └── auth-context.tsx
│   ├── hooks/            # Custom React hooks
│   │   ├── use-debounce.ts
│   │   ├── use-mobile.tsx
│   │   ├── use-scroll-animation.ts
│   │   └── use-venues.ts
│   ├── i18n/             # i18n configuration
│   │   ├── request.ts
│   │   └── routing.ts
│   ├── lib/              # Utility libraries
│   │   ├── data.ts       # Venue data
│   │   ├── seo.ts
│   │   ├── seo-content.ts
│   │   └── utils.ts
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   ├── utils/            # Utility functions
│   │   └── supabase/     # Supabase clients
│   │       ├── client.ts
│   │       ├── server.ts
│   │       └── middleware.ts
│   └── middleware.ts     # Next.js middleware
├── .gitignore
├── apphosting.yaml       # Firebase App Hosting config
├── components.json       # shadcn/ui config
├── eslint.config.js
├── next.config.ts        # Next.js configuration
├── package.json
├── postcss.config.cjs
├── tailwind.config.ts
└── tsconfig.json
```

### 4.2. Main Directory Descriptions

#### `/src/app`
- Contains all routes and pages following Next.js 15 App Router
- `[locale]`: Routes with language prefix
- `api`: API endpoints (RESTful)

#### `/src/components`
- **animations/**: Animation components with Framer Motion
- **dj/**: DJ-related components (cards, grids, profiles)
- **venue/**: Venue components (cards, detail pages, galleries)
- **layout/**: Header, Footer, Breadcrumbs, etc.
- **ui/**: shadcn/ui base components

#### `/src/lib`
- **data.ts**: Static venue data (9000+ lines)
- **seo.ts**: SEO utilities and metadata generation
- **utils.ts**: Common utility functions

#### `/messages`
- Translation files for 8 languages
- JSON format with nested keys

---

## 5. DATABASE SCHEMA

### 5.1. Supabase Tables

#### 5.1.1. `djs` - DJ Profiles

```sql
CREATE TABLE djs (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  genres TEXT[],
  country TEXT,
  is_active BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indexes:**
- `idx_djs_user_id` on `user_id`
- `idx_djs_is_active` on `is_active`
- `idx_djs_status` on `status`

#### 5.1.2. `votes` - DJ Votes

```sql
CREATE TABLE votes (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  dj_id INTEGER REFERENCES djs(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, dj_id)
);
```

**Indexes:**
- `idx_votes_user_id` on `user_id`
- `idx_votes_dj_id` on `dj_id`
- Unique constraint on `(user_id, dj_id)`

#### 5.1.3. `employee_profiles` - Employee Profiles

```sql
CREATE TABLE employee_profiles (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  address TEXT,
  avatar TEXT,
  referral_code TEXT UNIQUE,
  position TEXT,
  department TEXT,
  hire_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indexes:**
- `idx_employee_profiles_user_id` on `user_id`
- `idx_employee_profiles_email` on `email`
- `idx_employee_profiles_referral_code` on `referral_code`

### 5.2. Database Views

#### 5.2.1. `dj_stats` - DJ Statistics View

```sql
CREATE VIEW dj_stats AS
SELECT 
  d.id,
  d.name,
  d.image_url,
  d.bio,
  d.genres,
  d.country,
  d.created_at,
  d.user_id,
  COALESCE(COUNT(v.id), 0) as votes_count
FROM djs d
LEFT JOIN votes v ON d.id = v.dj_id
WHERE d.is_active = true AND d.status = 'active'
GROUP BY d.id;
```

### 5.3. Database Functions

#### 5.3.1. `get_dj_votes_count(p_dj_id INTEGER)`

```sql
CREATE OR REPLACE FUNCTION get_dj_votes_count(p_dj_id INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM votes WHERE dj_id = p_dj_id);
END;
$$ LANGUAGE plpgsql;
```

#### 5.3.2. `has_user_voted(p_user_id UUID, p_dj_id INTEGER)`

```sql
CREATE OR REPLACE FUNCTION has_user_voted(p_user_id UUID, p_dj_id INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM votes 
    WHERE user_id = p_user_id AND dj_id = p_dj_id
  );
END;
$$ LANGUAGE plpgsql;
```

### 5.4. Row Level Security (RLS)

- **djs**: Public read, authenticated write
- **votes**: Public read, authenticated write (own votes only)
- **employee_profiles**: Authenticated read/write

---

## 6. API ENDPOINTS

### 6.1. Venues API

#### `GET /api/venues`

Get list of venues with filtering and pagination.

**Query Parameters:**
- `search` (string): Search by name, address, description
- `country` (string): Filter by country
- `category` (string): Filter by category
- `limit` (number): Number of results (default: 100)
- `offset` (number): Offset for pagination (default: 0)

**Response:**
```json
{
  "venues": [...],
  "total": 150,
  "limit": 100,
  "offset": 0
}
```

**Cache:** 3600 seconds (1 hour)

#### `GET /api/venues/[id]`

Get detailed information for a venue.

**Response:**
```json
{
  "id": 1,
  "name": "Iconic KTV",
  "main_image_url": "...",
  "images": [...],
  "address": "...",
  "country": "Singapore",
  "phone": "+65 8280 8072",
  "category": "KTV",
  "price": "800-900k",
  "description": "...",
  "hours": "4PM - 3AM"
}
```

#### `GET /api/venues/categories`

Get list of all categories.

#### `GET /api/venues/countries`

Get list of all countries.

### 6.2. DJs API

#### `GET /api/djs`

Get list of DJs with filtering.

**Query Parameters:**
- `search` (string): Search by name, bio, country
- `country` (string): Filter by country
- `genre` (string): Filter by genre
- `limit` (number): Default 100
- `offset` (number): Default 0

**Response:**
```json
{
  "djs": [
    {
      "id": "1",
      "name": "DJ Name",
      "image_url": "...",
      "bio": "...",
      "genres": ["House", "Techno"],
      "country": "Singapore",
      "votes_count": 150,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 50
}
```

#### `GET /api/djs/[id]`

Get detailed information for a DJ including rank.

**Response:**
```json
{
  "id": "1",
  "name": "DJ Name",
  "image_url": "...",
  "bio": "...",
  "genres": ["House", "Techno"],
  "country": "Singapore",
  "votes_count": 150,
  "rank": 5,
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### `GET /api/djs/me`

Get current user's DJ profile (authenticated).

**Authentication:** Required

#### `POST /api/djs/seed`

Seed sample DJs into database (development only).

**Authentication:** Required

### 6.3. Votes API

#### `POST /api/votes`

Create a vote for a DJ.

**Request Body:**
```json
{
  "dj_id": "1"
}
```

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "vote": {...},
  "votes_count": 151
}
```

#### `GET /api/votes`

Get list of votes for current user.

**Query Parameters:**
- `dj_id` (string): Filter by DJ ID

**Authentication:** Optional (returns empty array if not logged in)

**Response:**
```json
{
  "votes": ["1", "2", "3"]
}
```

### 6.4. Employees API

#### `GET /api/employees`

Get list of employees.

**Query Parameters:**
- `search` (string): Search by name, email, phone
- `email` (string): Filter by email
- `referral_code` (string): Filter by referral code
- `limit` (number): Default 100
- `offset` (number): Default 0

#### `POST /api/employees`

Create a new employee profile.

**Request Body:**
```json
{
  "email": "employee@example.com",
  "full_name": "John Doe",
  "phone": "+65 1234 5678",
  "date_of_birth": "1990-01-01",
  "gender": "male",
  "address": "...",
  "avatar": "...",
  "referral_code": "ABC123",
  "position": "Manager",
  "department": "Sales",
  "hire_date": "2024-01-01"
}
```

**Authentication:** Required

#### `GET /api/employees/[id]`

Get detailed information for an employee.

#### `GET /api/employees/me`

Get current user's employee profile.

**Authentication:** Required

#### `GET /api/employees/referral/[code]`

Get employee by referral code.

### 6.5. Stats API

#### `GET /api/stats/djs`

Get statistics about DJs.

#### `GET /api/stats/venues`

Get statistics about venues.

### 6.6. Users API

#### `GET /api/users/me`

Get current user information.

**Authentication:** Required

---

## 7. MAIN FEATURES

### 7.1. Venue Directory

#### 7.1.1. Search and Filter

- **Search**: Search by venue name, address, description
- **Filter**: Filter by country, category
- **Pagination**: Paginate results
- **Suggestions**: Auto-complete suggestions when searching

#### 7.1.2. Venue Detail Page

- Detailed venue information
- Image gallery with Masonry layout
- Map integration (VisitUsMap)
- Booking form
- Related/Similar venues
- SEO optimized with structured data

### 7.2. DJ Voting System

#### 7.2.1. DJ Profiles

- List of DJs with ranking
- Detailed profile with bio, genres, country
- Vote count and rank display
- Image gallery

#### 7.2.2. Voting Mechanism

- Each user can only vote once per DJ
- Real-time vote count update
- Automatic ranking calculation
- Vote history

#### 7.2.3. DJ Registration

- DJs can register profiles
- Upload avatar
- Select genres and country
- Profile management

### 7.3. Employee Management

#### 7.3.1. Employee Profiles

- Create and manage employee profiles
- Referral code system
- Personal information (email, phone, address, etc.)
- Avatar upload

#### 7.3.2. Referral System

- Unique referral code for each employee
- Tracking referrals
- Referral code lookup

### 7.4. Internationalization (i18n)

#### 7.4.1. Supported Languages

1. **English (en)** - Default
2. **Vietnamese (vi)**
3. **Chinese (zh)**
4. **Indonesian (id)**
5. **Japanese (ja)**
6. **Korean (ko)**
7. **Russian (ru)**
8. **Thai (th)**

#### 7.4.2. Implementation

- URL-based locale routing (`/en/`, `/vi/`, etc.)
- Cookie-based locale detection
- Server-side translation with `next-intl`
- Dynamic metadata per locale

### 7.5. Authentication

#### 7.5.1. Supabase Auth

- Email/Password authentication
- OAuth providers (Google, Facebook, etc.)
- Session management
- Protected routes

#### 7.5.2. Auth Flow

```
User Login → Supabase Auth → Session Cookie → Middleware Check → Protected Route
```

### 7.6. Dark/Light Mode

- Theme switcher in header
- Persistent theme preference (localStorage)
- System preference detection
- Smooth transitions

### 7.7. Animations

#### 7.7.1. Framer Motion

- Page transitions
- Scroll reveal animations
- Hover effects on cards
- Stagger animations for grids
- Hero banner slide transitions

#### 7.7.2. Smooth Scroll

- Lenis smooth scroll
- Scroll restoration
- Scroll position saving

### 7.8. SEO Optimization

#### 7.8.1. Metadata

- Dynamic metadata per page
- Open Graph tags
- Twitter Cards
- Structured data (JSON-LD)

#### 7.8.2. Technical SEO

- Sitemap.xml generation
- Robots.txt configuration
- Canonical URLs
- Language alternates

### 7.9. Performance Optimization

#### 7.9.1. Code Splitting

- Dynamic imports
- Route-based code splitting
- Component lazy loading

#### 7.9.2. Image Optimization

- Next.js Image component
- Lazy loading
- Responsive images
- WebP format support

#### 7.9.3. Caching

- API response caching
- Static asset caching
- Service Worker caching
- CDN caching (Vercel Edge)

### 7.10. Accessibility (a11y)

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support
- Skip links
- Focus management

---

## 8. INSTALLATION AND DEPLOYMENT

### 8.1. System Requirements

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0 or **yarn** >= 1.22.0
- **Git**: >= 2.30.0

### 8.2. Development Installation

#### 8.2.1. Clone Repository

```bash
git clone <repository-url>
cd asianightlife
```

#### 8.2.2. Install Dependencies

```bash
npm install
# or
yarn install
```

#### 8.2.3. Environment Variables

Create `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: For production
NEXT_PUBLIC_APP_URL=https://asianightlife.sg
```

#### 8.2.4. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Application will run at `http://localhost:3000`

### 8.3. Build Production

#### 8.3.1. Build

```bash
npm run build
# or
yarn build
```

#### 8.3.2. Start Production Server

```bash
npm run start
# or
yarn start
```

### 8.4. Deployment

#### 8.4.1. Vercel Deployment

1. **Connect Repository**
   - Import project from GitHub/GitLab
   - Vercel automatically detects Next.js

2. **Environment Variables**
   - Add environment variables in Vercel dashboard
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Deploy**
   - Vercel automatically deploys when code is pushed
   - Preview deployments for each PR

#### 8.4.2. Firebase App Hosting

Configuration in `apphosting.yaml`:

```yaml
runConfig:
  maxInstances: 1
```

Deploy command:
```bash
firebase deploy --only hosting
```

### 8.5. Database Setup

#### 8.5.1. Supabase Setup

1. Create project on Supabase
2. Run migration scripts to create tables
3. Configure RLS policies
4. Create database functions
5. Setup storage buckets (if needed)

#### 8.5.2. Migration Scripts

Create tables and functions according to schema in section 5.

---

## 9. ENVIRONMENT CONFIGURATION

### 9.1. Environment Variables

#### Development (`.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key
```

#### Production (Vercel Environment Variables)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
NEXT_PUBLIC_APP_URL=https://asianightlife.sg
```

### 9.2. Next.js Configuration

File `next.config.ts` contains:

- **Internationalization**: next-intl plugin
- **Image domains**: Whitelist domains for images
- **Webpack optimization**: Code splitting, tree shaking
- **Security headers**: CORS, X-Frame-Options, etc.
- **Performance**: Bundle optimization

### 9.3. Tailwind Configuration

File `tailwind.config.ts`:

- Custom color palette
- Font configuration
- Animation keyframes
- Responsive breakpoints

### 9.4. TypeScript Configuration

File `tsconfig.json`:

- Path aliases (`@/*` → `./src/*`)
- Strict mode settings
- Module resolution

---

## 10. SECURITY

### 10.1. Authentication Security

- **Supabase Auth**: Secure session management
- **JWT Tokens**: Encrypted tokens
- **Session Refresh**: Automatic token refresh
- **Protected Routes**: Middleware authentication check

### 10.2. API Security

- **Authentication Required**: For sensitive endpoints
- **Input Validation**: Zod schema validation
- **SQL Injection Prevention**: Supabase parameterized queries
- **Rate Limiting**: (Can be added with Vercel Edge Config)

### 10.3. Data Security

- **Row Level Security (RLS)**: Database-level access control
- **Environment Variables**: Secrets not committed to Git
- **HTTPS Only**: Force HTTPS in production
- **CORS**: Configured in headers

### 10.4. Security Headers

Configured in `next.config.ts`:

- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`: Restrict camera, microphone, geolocation

### 10.5. Best Practices

- Do not expose sensitive keys in client code
- Validate all user inputs
- Sanitize data before displaying
- Regular security audits
- Keep dependencies updated

---

## 11. PERFORMANCE OPTIMIZATION

### 11.1. Code Optimization

#### 11.1.1. Bundle Size

- **Tree Shaking**: Remove unused code
- **Code Splitting**: Split by routes
- **Dynamic Imports**: Lazy load components
- **Package Optimization**: Optimize imports in `next.config.ts`

#### 11.1.2. Component Optimization

- **React.memo**: Memoize expensive components
- **useMemo/useCallback**: Memoize values and functions
- **Lazy Loading**: Load components when needed

### 11.2. Image Optimization

- **Next.js Image**: Automatic optimization
- **Lazy Loading**: Load images when entering viewport
- **Responsive Images**: srcset and sizes
- **Format Optimization**: WebP when supported

### 11.3. Caching Strategy

#### 11.3.1. Static Assets

- **Cache-Control**: `public, max-age=31536000, immutable`
- **CDN Caching**: Vercel Edge Network

#### 11.3.2. API Responses

- **Revalidation**: `revalidate` in API routes
- **Stale-While-Revalidate**: Service Worker strategy

#### 11.3.3. Service Worker

File `public/sw.js`:
- Cache static assets
- Cache API responses
- Network-first strategy for pages

### 11.4. Performance Metrics

**Core Web Vitals:**
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

**Optimization Techniques:**
- Preload critical resources
- Defer non-critical JavaScript
- Optimize fonts loading
- Minimize render-blocking resources

---

## 12. SEO AND ACCESSIBILITY

### 12.1. SEO Implementation

#### 12.1.1. Metadata

- Dynamic metadata per page
- Open Graph tags
- Twitter Cards
- Canonical URLs
- Language alternates

#### 12.1.2. Structured Data

- JSON-LD schema markup
- Organization schema
- Website schema with SearchAction
- Venue schema (LocalBusiness)

#### 12.1.3. Technical SEO

- **Sitemap**: Auto-generated at `/sitemap.xml`
- **Robots.txt**: Configured at `/robots.txt`
- **URL Structure**: Clean, descriptive URLs
- **Internal Linking**: Related venues, breadcrumbs

### 12.2. Accessibility (a11y)

#### 12.2.1. Semantic HTML

- Proper heading hierarchy
- Landmark regions (header, nav, main, footer)
- Form labels and associations

#### 12.2.2. ARIA

- ARIA labels for interactive elements
- ARIA live regions for dynamic content
- ARIA roles when needed

#### 12.2.3. Keyboard Navigation

- Tab order logical
- Focus indicators visible
- Skip links
- Keyboard shortcuts

#### 12.2.4. Screen Readers

- Alt text for images
- Descriptive link text
- Form error messages accessible

---

## 13. DEVELOPMENT PROCESS

### 13.1. Git Workflow

#### 13.1.1. Branch Strategy

- **main**: Production branch
- **develop**: Development branch
- **feature/***: Feature branches
- **bugfix/***: Bug fix branches

#### 13.1.2. Commit Convention

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Code style changes
refactor: Code refactoring
perf: Performance improvements
test: Add tests
chore: Maintenance tasks
```

### 13.2. Code Review Process

1. Create feature branch
2. Implement changes
3. Create Pull Request
4. Code review
5. Address feedback
6. Merge to develop/main

### 13.3. Testing

#### 13.3.1. Manual Testing

- Test on multiple browsers
- Test responsive design
- Test i18n translations
- Test authentication flows

#### 13.3.2. Automated Testing

- Unit tests (can add Jest)
- Integration tests
- E2E tests (can add Playwright)

### 13.4. Deployment Process

1. **Development**: Test locally
2. **Staging**: Deploy to preview environment
3. **Production**: Deploy to production after review

---

## 14. TROUBLESHOOTING

### 14.1. Common Issues

#### 14.1.1. Build Errors

**Issue**: TypeScript errors in build

**Solution**:
```bash
# Check TypeScript errors
npm run build

# Fix type errors
# Update types in src/types/
```

#### 14.1.2. Authentication Issues

**Issue**: User cannot login

**Solution**:
- Check Supabase credentials in `.env.local`
- Check Supabase Auth settings
- Check browser console for errors

#### 14.1.3. Image Loading Issues

**Issue**: Images not loading

**Solution**:
- Check image domain in `next.config.ts`
- Verify image URLs
- Check CORS settings

#### 14.1.4. i18n Routing Issues

**Issue**: Locale not detected

**Solution**:
- Check middleware configuration
- Verify locale in URL
- Check cookie `NEXT_LOCALE`

### 14.2. Debugging

#### 14.2.1. Client-side Debugging

- Browser DevTools
- React DevTools
- Network tab for API calls
- Console logs

#### 14.2.2. Server-side Debugging

- Vercel logs
- Supabase logs
- Server-side console.log (will be removed in production)

### 14.3. Performance Issues

#### 14.3.1. Slow Page Load

- Check bundle size with `npm run build`
- Analyze with Next.js Bundle Analyzer
- Check image sizes
- Verify caching

#### 14.3.2. API Slow Response

- Check Supabase query performance
- Add database indexes
- Optimize queries
- Check network latency

---

## 15. MAINTENANCE AND SUPPORT

### 15.1. Regular Maintenance

#### 15.1.1. Dependencies Updates

```bash
# Check outdated packages
npm outdated

# Update packages
npm update

# Update major versions (be careful)
npm install package@latest
```

#### 15.1.2. Database Maintenance

- Regular backups
- Monitor query performance
- Optimize indexes
- Clean up old data

#### 15.1.3. Security Updates

- Monitor security advisories
- Update dependencies with security patches
- Regular security audits

### 15.2. Monitoring

#### 15.2.1. Application Monitoring

- **Vercel Analytics**: Page views, performance
- **Error Tracking**: (Can add Sentry)
- **Uptime Monitoring**: (Can add UptimeRobot)

#### 15.2.2. Database Monitoring

- Supabase Dashboard
- Query performance
- Connection pool usage

### 15.3. Backup Strategy

#### 15.3.1. Code Backup

- Git repository (GitHub/GitLab)
- Regular commits
- Tag releases

#### 15.3.2. Database Backup

- Supabase automatic backups
- Manual exports when needed
- Point-in-time recovery

### 15.4. Support Contacts

- **Technical Support**: [Your contact]
- **Supabase Support**: support@supabase.io
- **Vercel Support**: support@vercel.com

---

## PHỤ LỤC

### A. Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database (Supabase CLI)
supabase db pull         # Pull schema changes
supabase db push         # Push schema changes
supabase migration new   # Create new migration
```

### B. Useful Links

- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/
- **next-intl**: https://next-intl-docs.vercel.app/

### C. Project Structure Diagram

```
User Request
    ↓
Middleware (Auth + i18n)
    ↓
App Router Page
    ↓
Server Component / API Route
    ↓
Supabase Client
    ↓
PostgreSQL Database
```

---

## CONCLUSION

This documentation provides detailed information about the architecture, configuration, and operation of the Asia Night Life Platform system. For additional support, please contact the development team.

**Note**: This documentation will be updated as the system evolves. Please check for the latest version.

---

**Documentation created by:** Development Team  
**Last Updated:** 28/01/2026  
**Version:** 1.0.0
