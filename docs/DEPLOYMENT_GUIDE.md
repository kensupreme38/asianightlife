# 🚀 DEPLOYMENT GUIDE
## Asia Night Life Platform - Deployment Guide

This document provides detailed instructions for deploying the Asia Night Life Platform system to production.

---

## TABLE OF CONTENTS

1. [Overview](#1-overview)
2. [Preparation](#2-preparation)
3. [Vercel Deployment](#3-vercel-deployment)
4. [Firebase App Hosting](#4-firebase-app-hosting)
5. [Database Setup](#5-database-setup)
6. [Environment Configuration](#6-environment-configuration)
7. [Post-Deployment](#7-post-deployment)
8. [Monitoring](#8-monitoring)
9. [Rollback Procedure](#9-rollback-procedure)

---

## 1. OVERVIEW

### 1.1. Deployment Platforms

The system supports deployment on:
- **Vercel** (Recommended) - Next.js optimized
- **Firebase App Hosting** - Alternative option

### 1.2. Prerequisites

- GitHub/GitLab repository
- Supabase project
- Domain name (optional)
- Vercel/Firebase account

---

## 2. PREPARATION

### 2.1. Pre-deployment Checklist

- [ ] Code has been tested and reviewed
- [ ] Build successful locally (`npm run build`)
- [ ] Environment variables prepared
- [ ] Database schema migrated
- [ ] Supabase project setup
- [ ] Domain DNS configured (if applicable)

### 2.2. Environment Variables

Prepare the following environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# App URL
NEXT_PUBLIC_APP_URL=https://asianightlife.sg
```

---

## 3. VERCEL DEPLOYMENT

### 3.1. Setup Vercel Project

#### Step 1: Import Project

1. Log in to [Vercel Dashboard](https://vercel.com)
2. Click "Add New" → "Project"
3. Import from GitHub/GitLab repository
4. Vercel automatically detects Next.js

#### Step 2: Configure Project

**Framework Preset**: Next.js  
**Root Directory**: `./` (or leave empty)  
**Build Command**: `npm run build` (default)  
**Output Directory**: `.next` (default)  
**Install Command**: `npm install` (default)

### 3.2. Environment Variables

Add environment variables in Vercel Dashboard:

1. Go to Project Settings → Environment Variables
2. Add variables:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://...` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `...` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | `https://asianightlife.sg` | Production |

**Note**: 
- `NEXT_PUBLIC_*` variables are exposed to client
- Do not commit secrets to Git

### 3.3. Domain Configuration

#### Custom Domain

1. Go to Project Settings → Domains
2. Add domain: `asianightlife.sg`
3. Configure DNS records according to Vercel instructions:
   - Type: `CNAME`
   - Name: `@` or `www`
   - Value: `cname.vercel-dns.com`

#### SSL Certificate

- Vercel automatically provisions SSL certificate
- Auto-renewal enabled

### 3.4. Deploy

#### Automatic Deployment

- Each push to `main` branch automatically deploys to production
- Each PR creates preview deployment

#### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### 3.5. Vercel Configuration

File `vercel.json` (optional):

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["sin1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

---

## 4. FIREBASE APP HOSTING

### 4.1. Setup Firebase Project

#### Step 1: Create Firebase Project

1. Log in to [Firebase Console](https://console.firebase.google.com)
2. Create new project
3. Enable App Hosting

#### Step 2: Install Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

#### Step 3: Initialize Firebase

```bash
firebase init hosting
```

Select:
- Use existing project
- Public directory: `.next`
- Configure as single-page app: No
- Set up automatic builds: Yes

### 4.2. Configuration

File `apphosting.yaml`:

```yaml
runConfig:
  maxInstances: 1  # Adjust based on traffic
```

File `firebase.json`:

```json
{
  "hosting": {
    "public": ".next",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### 4.3. Environment Variables

Set in Firebase Console:
1. App Hosting → Settings → Environment Variables
2. Add variables similar to Vercel

### 4.4. Deploy

```bash
# Build first
npm run build

# Deploy
firebase deploy --only hosting
```

---

## 5. DATABASE SETUP

### 5.1. Supabase Setup

#### Step 1: Create Supabase Project

1. Log in to [Supabase Dashboard](https://app.supabase.com)
2. Create new project
3. Note down:
   - Project URL
   - Anon key
   - Service role key (keep secret!)

#### Step 2: Run Migrations

Create tables and functions according to schema in [Technical Documentation](./TECHNICAL_DOCUMENTATION.md#5-database-schema).

**SQL Editor** in Supabase Dashboard:

```sql
-- Create djs table
CREATE TABLE djs (...);

-- Create votes table
CREATE TABLE votes (...);

-- Create employee_profiles table
CREATE TABLE employee_profiles (...);

-- Create views
CREATE VIEW dj_stats AS ...;

-- Create functions
CREATE OR REPLACE FUNCTION get_dj_votes_count(...) ...;
```

#### Step 3: Configure RLS

Enable Row Level Security and setup policies:

```sql
-- Enable RLS
ALTER TABLE djs ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read access" ON djs FOR SELECT USING (true);
CREATE POLICY "Authenticated write" ON votes FOR INSERT WITH CHECK (auth.uid() = user_id);
```

#### Step 4: Setup Storage (if needed)

1. Storage → Create bucket
2. Configure policies
3. Update `next.config.ts` with storage domain

### 5.2. Database Backup

#### Automatic Backups

- Supabase automatically backs up daily
- Point-in-time recovery available
- Retention: 7 days (free tier)

#### Manual Backup

```bash
# Using Supabase CLI
supabase db dump -f backup.sql
```

---

## 6. ENVIRONMENT CONFIGURATION

### 6.1. Production Environment Variables

#### Vercel

Set in Project Settings → Environment Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=https://asianightlife.sg
```

#### Firebase

Set in App Hosting → Settings → Environment Variables (similar)

### 6.2. Environment-specific Configs

#### Development

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=local_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Preview/Staging

```env
NEXT_PUBLIC_SUPABASE_URL=https://staging-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=staging_key
NEXT_PUBLIC_APP_URL=https://staging.asianightlife.sg
```

#### Production

```env
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=prod_key
NEXT_PUBLIC_APP_URL=https://asianightlife.sg
```

---

## 7. POST-DEPLOYMENT

### 7.1. Verification Checklist

- [ ] Website accessible at production URL
- [ ] All pages load correctly
- [ ] API endpoints respond correctly
- [ ] Authentication works
- [ ] Database connections working
- [ ] Images loading correctly
- [ ] i18n routing working
- [ ] SEO metadata correct
- [ ] SSL certificate active
- [ ] Performance metrics acceptable

### 7.2. Testing

#### Functional Testing

```bash
# Test homepage
curl https://asianightlife.sg

# Test API
curl https://asianightlife.sg/api/venues

# Test locale routing
curl https://asianightlife.sg/vi/
curl https://asianightlife.sg/en/
```

#### Performance Testing

- Check Core Web Vitals
- Test page load times
- Verify caching working
- Check bundle sizes

### 7.3. Monitoring Setup

#### Vercel Analytics

- Enable in Project Settings
- View metrics in Dashboard

#### Error Tracking

- Setup Sentry (optional)
- Monitor Vercel logs
- Check Supabase logs

---

## 8. MONITORING

### 8.1. Application Monitoring

#### Vercel Dashboard

- **Analytics**: Page views, performance
- **Logs**: Server logs, errors
- **Deployments**: Deployment history

#### Key Metrics

- **Uptime**: Target 99.9%
- **Response Time**: < 200ms
- **Error Rate**: < 0.1%

### 8.2. Database Monitoring

#### Supabase Dashboard

- **Database**: Query performance, connections
- **Auth**: User activity, sessions
- **Storage**: Usage, bandwidth

#### Alerts

Setup alerts for:
- High error rate
- Slow queries
- Connection pool exhaustion
- Storage quota

### 8.3. Uptime Monitoring

#### External Services

- **UptimeRobot**: Free uptime monitoring
- **Pingdom**: Advanced monitoring
- **StatusCake**: Alternative option

---

## 9. ROLLBACK PROCEDURE

### 9.1. Vercel Rollback

#### Via Dashboard

1. Go to Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

#### Via CLI

```bash
vercel rollback [deployment-url]
```

### 9.2. Database Rollback

#### Supabase Point-in-time Recovery

1. Go to Database → Backups
2. Select restore point
3. Restore database

#### Manual Rollback

```bash
# Restore from backup
psql -h db.xxx.supabase.co -U postgres -d postgres < backup.sql
```

### 9.3. Emergency Procedures

#### Complete Rollback

1. Revert code to previous commit
2. Redeploy
3. Restore database if needed
4. Verify functionality

#### Partial Rollback

- Disable feature flags
- Revert specific changes
- Hotfix deployment

---

## 10. MAINTENANCE

### 10.1. Regular Tasks

#### Weekly

- Review error logs
- Check performance metrics
- Update dependencies (minor)

#### Monthly

- Security updates
- Dependency updates (major)
- Database optimization
- Backup verification

#### Quarterly

- Security audit
- Performance review
- Cost optimization
- Documentation update

### 10.2. Updates

#### Dependency Updates

```bash
# Check outdated
npm outdated

# Update minor/patch
npm update

# Update major (test first!)
npm install package@latest
```

#### Next.js Updates

- Follow [Next.js upgrade guide](https://nextjs.org/docs/app/building-your-application/upgrading)
- Test thoroughly before production

---

## 11. TROUBLESHOOTING

### 11.1. Common Issues

#### Build Failures

**Issue**: Build fails on Vercel

**Solution**:
- Check build logs
- Verify Node.js version
- Check environment variables
- Test build locally

#### Database Connection Issues

**Issue**: Cannot connect to Supabase

**Solution**:
- Verify credentials
- Check network connectivity
- Verify Supabase project status
- Check RLS policies

#### Performance Issues

**Issue**: Slow page loads

**Solution**:
- Check bundle size
- Optimize images
- Enable caching
- Check database queries

### 11.2. Emergency Contacts

- **Vercel Support**: support@vercel.com
- **Supabase Support**: support@supabase.io
- **Firebase Support**: firebase-support@google.com

---

## APPENDIX

### A. Deployment Checklist Template

```
Pre-Deployment:
[ ] Code reviewed and tested
[ ] Build successful locally
[ ] Environment variables prepared
[ ] Database migrations ready
[ ] Domain DNS configured

Deployment:
[ ] Deploy to staging first
[ ] Test staging environment
[ ] Deploy to production
[ ] Verify deployment

Post-Deployment:
[ ] Verify all pages load
[ ] Test API endpoints
[ ] Check authentication
[ ] Verify database connections
[ ] Monitor error logs
[ ] Check performance metrics
```

### B. Useful Commands

```bash
# Vercel
vercel login
vercel --prod
vercel logs

# Firebase
firebase login
firebase deploy
firebase hosting:channel:deploy preview

# Supabase
supabase login
supabase db pull
supabase db push
```

---

**Last Updated**: 28/01/2026  
**Version**: 1.0.0
