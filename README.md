# Angular Blog Application

A modern, feature-rich blog application built with Angular 19 and Supabase. This application provides a responsive, user-friendly interface for reading blog posts and an admin panel for content management.

## Features

### Reader Interface

- **Blog Post Listing**: Browse all published blog posts with previews
- **Post Details**: View full blog posts with formatted content
- **Comments System**: Read and add comments to blog posts
- **Code Highlighting**: Syntax highlighting for code blocks with expandable modal view
- **Responsive Design**: Optimized for all device sizes using Tailwind CSS and DaisyUI

### Admin Interface

- **Authentication**: Secure admin access with Supabase authentication
- **Post Management**: Create, edit, and delete blog posts
- **Rich Text Editor**: Quill-based editor with support for formatting, images, and code blocks
- **Unsaved Changes Protection**: Guards against accidental navigation away from unsaved content

## Technologies Used

### Frontend

- **Angular 19**: Latest version with standalone components and signals
- **NgRx Signals**: For state management
- **Tailwind CSS**: For styling with utility classes
- **DaisyUI**: Component library for Tailwind CSS
- **Quill Editor**: Rich text editor for content creation
- **Highlight.js**: Syntax highlighting for code blocks

### Backend

- **Supabase**: Backend-as-a-Service for:
  - Database (PostgreSQL)
  - Authentication
  - Storage
  - Serverless Functions

### Development & Deployment

- **Angular SSR**: Server-Side Rendering for improved performance and SEO
- **TypeScript**: For type-safe code
- **Webpack Bundle Analyzer**: For optimizing bundle size

## Project Structure

```
src/
├── app/
│   ├── admin/             # Admin interface components and services
│   ├── auth/              # Authentication components and guards
│   ├── reader/            # Public blog reading interface
│   ├── services/          # Shared services
│   ├── shared/            # Shared components
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── environments/          # Environment configuration
└── styles.scss            # Global styles
```

## Setup and Installation

### Prerequisites

- Node.js (v18 or later)
- npm (v10 or later)
- Angular CLI (v19 or later)

### Installation Steps

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd angular-blog-app
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
  - Create a Supabase project at [supabase.com](https://supabase.com)
  - Update the environment files with your Supabase URL and anon key

4. Run the development server
   ```bash
   npm start
   ```

5. Navigate to `http://localhost:4200/` to view the application

## Building for Production

Run `npm run build` to build the project for production. The build artifacts will be stored in the `dist/` directory.

## Deployment

The application can be deployed to any static hosting service that supports Angular applications with SSR, such as:

- Vercel
- Netlify
- Firebase APP Hosting

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
