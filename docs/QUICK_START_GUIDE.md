# 🚀 QUICK START GUIDE
## Asia Night Life Platform - Quick Start Guide

This document provides a quick guide to get started with the Asia Night Life Platform project.

---

## 📋 TABLE OF CONTENTS

1. [Quick Installation](#1-quick-installation)
2. [Environment Configuration](#2-environment-configuration)
3. [Running the Application](#3-running-the-application)
4. [Basic Structure](#4-basic-structure)
5. [Common Commands](#5-common-commands)
6. [Quick Troubleshooting](#6-quick-troubleshooting)

---

## 1. QUICK INSTALLATION

### Requirements

- Node.js >= 18.0.0
- npm >= 9.0.0 or yarn >= 1.22.0
- Git >= 2.30.0

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd asianightlife
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Create .env.local File

```bash
cp .env.example .env.local
# Then fill in the required values
```

### Step 4: Run Development Server

```bash
npm run dev
# or
yarn dev
```

Application will run at `http://localhost:3000`

---

## 2. ENVIRONMENT CONFIGURATION

### .env.local File

Create `.env.local` file in root directory with content:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Get Supabase Credentials

1. Log in to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Settings → API
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 3. RUNNING THE APPLICATION

### Development Mode

```bash
npm run dev
```

- Hot reload enabled
- Development tools available
- Source maps enabled

### Production Build

```bash
# Build
npm run build

# Start production server
npm run start
```

### Linting

```bash
npm run lint
```

---

## 4. BASIC STRUCTURE

### Important Directories

```
src/
├── app/              # Next.js App Router
│   ├── [locale]/    # Routes with locale prefix
│   └── api/         # API endpoints
├── components/       # React components
├── lib/             # Utilities and data
├── hooks/           # Custom React hooks
└── utils/           # Helper functions
```

### Main Routes

- `/` - Homepage
- `/dj` - DJ list
- `/dj/[id]` - DJ details
- `/venue/[id]` - Venue details
- `/employee` - Employee management
- `/login` - Login

### API Routes

- `/api/venues` - Venues API
- `/api/djs` - DJs API
- `/api/votes` - Votes API
- `/api/employees` - Employees API

---

## 5. COMMON COMMANDS

### Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

### Git

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Commit changes
git commit -m "feat: Add new feature"

# Push to remote
git push origin feature/your-feature-name
```

### Database (Supabase CLI)

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Pull schema
supabase db pull

# Push schema
supabase db push
```

---

## 6. QUICK TROUBLESHOOTING

### Error: Cannot find module

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: Environment variables not found

**Solution:**
- Check that `.env.local` file exists
- Ensure variable names are correct (NEXT_PUBLIC_*)
- Restart dev server after changes

### Error: Port 3000 already in use

**Solution:**
```bash
# Kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill
```

### Error: Authentication failed

**Solution:**
- Check Supabase credentials in `.env.local`
- Verify Supabase project settings
- Check browser console for errors

### Error: Images not loading

**Solution:**
- Check image domain in `next.config.ts`
- Verify image URLs
- Check CORS settings

### Build errors

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

---

## 7. DEVELOPMENT WORKFLOW

### Create New Feature

1. **Create branch:**
   ```bash
   git checkout -b feature/feature-name
   ```

2. **Develop:**
   - Code feature
   - Test locally
   - Commit changes

3. **Push and create PR:**
   ```bash
   git push origin feature/feature-name
   ```
   - Create Pull Request on GitHub
   - Code review
   - Merge into `main`

### Commit Convention

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

---

## 8. REFERENCES

### Main Documentation

- [Technical Documentation](./TECHNICAL_DOCUMENTATION.md) - Detailed technical documentation
- [API Documentation](./API_DOCUMENTATION.md) - API documentation

### External Links

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

---

## 9. CONTACT

If you encounter issues or need support:

1. Check [Technical Documentation](./TECHNICAL_DOCUMENTATION.md)
2. Check [Troubleshooting section](./TECHNICAL_DOCUMENTATION.md#14-troubleshooting)
3. Contact the development team

---

**Last Updated**: 28/01/2026  
**Version**: 1.0.0
