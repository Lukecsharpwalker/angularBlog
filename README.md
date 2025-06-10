# Angular Blog Application 
![GitHub Actions](https://img.shields.io/github/actions/workflow/status/Lukecsharpwalker/angularBlog/ci.yml?branch=main) 
![Codecov](https://img.shields.io/codecov/c/github/Lukecsharpwalker/angularBlog) 
![Angular](https://img.shields.io/badge/angular-v19-red) 
![Supabase](https://img.shields.io/badge/supabase-powered-green) 
![Playwright](https://img.shields.io/badge/testing-playwright-blue?style=flat-square) 
![NPM](https://img.shields.io/npm/v/your-package-name?color=blue)

A modern, feature-rich blog application built with Angular 19 and Supabase. This application provides a responsive, user-friendly interface for reading blog posts and an admin panel for content management.

---

## Features

### Reader Interface
- **Blog Post Listing**: Browse all published blog posts with previews.
- **Post Details**: View full blog posts with formatted content.
- **Comments System**: Read and add comments to blog posts.
- **Code Highlighting**: Syntax highlighting for code blocks with expandable modal view.
- **Responsive Design**: Optimized for all device sizes using Tailwind CSS and DaisyUI.

### Admin Interface
- **Authentication**: Secure admin access with Supabase authentication.
- **Post Management**: Create, edit, and delete blog posts.
- **Rich Text Editor**: Quill-based editor with support for formatting, images, and code blocks.
- **Unsaved Changes Protection**: Guards against accidental navigation away from unsaved content.

---

## Screenshots


---

## Technologies Used

### Frontend
- **Angular 19**
- **NgRx Signals**
- **Tailwind CSS**
- **DaisyUI**
- **Quill Editor**
- **Highlight.js**

### Backend
- **Supabase**: Backend-as-a-Service (PostgreSQL, Authentication, Storage, Functions).

### Development
- **Angular SSR**
- **TypeScript**
- **Webpack Bundle Analyzer**

---

## Setup and Installation

### Prerequisites
- Node.js (v18 or later)
- npm (v10 or later)
- Angular CLI (v19 or later)
- Docker (for local Supabase setup)

### Installation Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/Lukecsharpwalker/angularBlog.git
   cd angularBlog
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up local Supabase (optional, but recommended for development):

   **For Unix/macOS users:**
   ```bash
   npm run setup:local-supabase
   ```

   **For Windows users:**
   ```powershell
   npm run setup:local-supabase:win
   ```

   This command will:
   - Initialize a local Supabase instance using Docker
   - Create the necessary database tables
   - Create an admin user for testing (email: admin@example.com, password: admin123)

4. Start the application with local Supabase:
   ```bash
   npm run start:local
   ```
   Or use the cloud Supabase instance:
   ```bash
   npm start
   ```

### Supabase Management
- To stop the local Supabase instance:
  ```bash
  supabase stop
  ```
- To start it again:
  ```bash
  supabase start
  ```
- To access Supabase Studio (admin interface):
  Open http://localhost:54323 in your browser

### Syncing from Cloud Supabase
You can sync your local Supabase instance with the cloud instance to get the latest schema, policies, and data:

**For Unix/macOS users:**
```bash
npm run sync:cloud-supabase
```

**For Windows users:**
```powershell
npm run sync:cloud-supabase:win
```

This command will:
- Link your local Supabase project to the remote project
- Pull the database schema and policies from the cloud
- Dump data from the remote database
- Apply the schema and data to your local instance

This is useful for:
- Getting the latest database structure during development
- Testing with real data from the production environment
- Ensuring your local environment matches the cloud environment
