# Firebase Admin Deployment

## Overview
The Angular admin application is deployed to Firebase Hosting with automated CI/CD.

## Live URLs
- **Primary**: https://angular-admin-blog.web.app
- **Custom Domain**: https://app.angular.fun

## Project Configuration
- **Firebase Project ID**: `angular-admin-blog`
- **Hosting Target**: `admin`
- **Build Output**: `dist/admin/browser`

## Features Configured

### ✅ Production Deployment
- Optimized Angular build
- Asset caching with immutable headers
- SPA routing configured

### ✅ Security Headers
- Content Security Policy (CSP) 
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy for privacy

### ✅ Preview Channels
- Automatic PR previews via GitHub Actions
- 7-day expiration for preview deployments
- Unique URLs per PR: `angular-admin-blog--pr-{number}-*.web.app`

### ✅ CI/CD Automation
- **Triggers**: Changes to `projects/admin/**`, `firebase.json`, etc.
- **PR Flow**: Lint → Test → Build → Deploy to preview channel
- **Main Branch**: Deploy to live site
- **PR Comments**: Automatic preview URL posting

## Manual Commands

```bash
# Deploy to live site
firebase deploy --only hosting:admin

# Deploy to preview channel
firebase hosting:channel:deploy preview --only admin

# Create new preview channel
firebase hosting:channel:create <channel-name> --site angular-admin-blog
```

## GitHub Secrets Required

For CI/CD to work, add this secret to your GitHub repository:
- `FIREBASE_SERVICE_ACCOUNT_ANGULAR_ADMIN_BLOG`

To get the service account key:
1. Go to [Firebase Console](https://console.firebase.google.com/project/angular-admin-blog/settings/serviceaccounts/adminsdk)
2. Generate new private key
3. Copy the JSON content to GitHub secret

## Build Process
1. Install dependencies (`npm ci`)
2. Lint admin project
3. Run tests
4. Build for production
5. Deploy to Firebase Hosting

## Cache Strategy
- **HTML files**: No cache (always fresh)
- **Assets** (JS/CSS/fonts/images): 1 year cache with immutable flag
- **Micro-frontend remoteEntry**: 1 year cache + CORS headers

## Redirects
- `/admin` → `/` (301 redirect for legacy paths)