````# Angular Blog Application

[![unit tests](https://img.shields.io/github/actions/workflow/status/Lukecsharpwalker/angularBlog/PR_Check.yml?event=pull_request&label=unit%20tests&logo=githubactions&logoColor=white)](https://github.com/Lukecsharpwalker/angularBlog/actions/workflows/PR_Check.yml)
[![e2e](https://img.shields.io/github/actions/workflow/status/Lukecsharpwalker/angularBlog/e2e-tests.yml?branch=main&label=e2e&logo=githubactions&logoColor=white)](https://github.com/Lukecsharpwalker/angularBlog/actions/workflows/e2e-tests.yml)
[![deploy](https://img.shields.io/github/actions/workflow/status/Lukecsharpwalker/angularBlog/google-cloudrun-docker.yml?branch=main&label=deploy&logo=googlecloud&logoColor=white)](https://github.com/Lukecsharpwalker/angularBlog/actions/workflows/google-cloudrun-docker.yml)
[![coverage](https://img.shields.io/codecov/c/github/Lukecsharpwalker/angularBlog?logo=codecov&logoColor=white)](https://app.codecov.io/gh/Lukecsharpwalker/angularBlog)
![Angular](https://img.shields.io/github/package-json/dependency-version/Lukecsharpwalker/angularBlog/%40angular%2Fcore?label=angular&logo=angular&color=dd0031)
![TypeScript](https://img.shields.io/github/package-json/dependency-version/Lukecsharpwalker/angularBlog/dev/typescript?label=typescript&logo=typescript&logoColor=white&color=3178c6)
![Node](https://img.shields.io/badge/node-20%20%7C%2022-339933?logo=nodedotjs&logoColor=white)
![Supabase](https://img.shields.io/badge/supabase-powered-3ecf8e?logo=supabase&logoColor=white)

A modern, feature-rich blog application built with Angular 20 and Supabase. This application provides a responsive, user-friendly interface for reading blog posts and an admin panel for content management.

---

## Features

### Reader Interface
- **Blog Post Listing**: Browse all published blog posts with previews.
- **Post Details**: View full blog posts with formatted content.
- **Comments System**: Read and add comments to blog posts.
- **Code Highlighting**: Syntax highlighting for code blocks with expandable modal view.
- **Responsive Design**: Optimized for all device sizes using Tailwind CSS.

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
- **Angular 20**
- **NgRx Signals**
- **Tailwind CSS**
- **Quill Editor**
- **Highlight.js**

### Backend
- **Supabase**: Backend-as-a-Service (PostgreSQL, Authentication, Storage, Functions).

### Development
- **Angular SSR**
- **TypeScript**
- **ESLint, Prettier, Stylelint**
- **Playwright** and **Karma + Jasmine**

---

## Setup and Installation

### Prerequisites
- Node.js (20.19+ or 22.12+; CI builds on Node 20, the PR check runs on Node 22)
- npm (v10 or later)
- Angular CLI (v20 or later)
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
   npm run start:local:backend
   ```

   **For Windows users:**
   ```powershell
   npm run start:local:backend
   ```

   This command will:
   - Initialize a local Supabase instance using Docker
   - Create the necessary database tables
   - Create the demo accounts defined in `supabase/seed/seed.sql` (see step 4):
     - admin: `admin@example.com` / `Admin123!`
     - user: `user@example.com` / `Password123!`

4. Seed the local database (requires the local stack from step 3 to be running):
   ```bash
   npm run db:seed
   ```
   `db:seed` regenerates `supabase/seed/seed.sql` and then runs `npx supabase db reset`, which
   recreates the local database from `supabase/migrations/` and loads that seed. To re-apply the
   committed seed without contacting the cloud project, run `npx supabase db reset` on its own.

5. Start the application with local Supabase:
   ```bash
   npm run start:web:local-env
   ```
   Or use the cloud Supabase instance:
   ```bash
   npm run start:web
   ```
   The admin panel runs on port 4201, next to the web app on 4200:
   ```bash
   npm run start:admin:local-env
   ```
   Or against the cloud instance:
   ```bash
   npm run start:admin
   ```

### Supabase Management
- To stop the local Supabase instance:
  ```bash
  npx supabase stop
  ```
- To start it again:
  ```bash
  npx supabase start
  ```
- To access Supabase Studio (admin interface):
  Open http://localhost:54323 in your browser

### Syncing from Cloud Supabase
You can refresh the data in your local Supabase instance from the cloud instance:

**For Unix/macOS users:**
```bash
npm run db:seed
```

**For Windows users:**
```powershell
npm run db:seed
```

This command runs `db:createSeed` and then `npx supabase db reset`, which will:
- Read tags, profiles, posts, post tags and comments over PostgREST from the Supabase project
  configured in `environments/environment.ts`
- Write them to `supabase/seed/seed.sql`, together with the demo accounts
  (`admin@example.com` / `Admin123!`, `user@example.com` / `Password123!`)
- Recreate the local database: apply every migration in `supabase/migrations/`, then load that seed

This is useful for:
- Refreshing local data during development (for the schema itself, use `npm run schema:pull`)
- Testing with real data from the production environment
- Ensuring your local environment matches the cloud environment

---

## Testing

### Unit Tests (Karma + Jasmine)
```bash
npm run test:web         # or test:admin, test:shared, test:mfe
npm run test:all         # all four projects, headless Chrome, single run
```

### E2E Tests (Playwright)
Install the browsers once:
```bash
npx playwright install
```
Then:
```bash
npm run e2e              # every Playwright project
npm run e2e:web          # web only
npm run e2e:admin        # admin only
```
Locally Playwright starts `npm run start:web:local-env` itself unless port 4200 is already served.
The admin app is not started for you: run `npm run start:admin:local-env` before `npm run e2e:admin`.
Specs that log in against the real local database rely on the seeded accounts, so run
`npm run db:seed` first.

---

## Linting and Formatting
```bash
npm run lint:all         # ESLint for web, admin, code-samples-mfe and shared
npm run lint:all:fix     # the same, with --fix
npm run lint:styles      # Stylelint for projects/**/*.css
npm run format           # Prettier, writes
npm run format:check     # Prettier, check only
```

---

## Environment Variables
The apps read the Supabase URL and anon key from the committed files in `environments/`. Two scripts
need credentials that are **not** part of the repository - export them in your shell before running:

- `PG_EXPORT_URL` - Postgres connection string of the remote database, used by `npm run schema:pull`
- `SUPABASE_URL` and `SERVICE_ROLE_KEY` - used by `npm run password:reset`

```bash
export PG_EXPORT_URL="postgresql://postgres:<password>@<host>:5432/postgres"
npm run schema:pull
```
```bash
export SUPABASE_URL="https://<project-ref>.supabase.co"
export SERVICE_ROLE_KEY="<service-role-key>"
npm run password:reset -- <userId> <newPassword>
```

`schema:pull` deletes the current `*_remote_schema.sql` migration with `find` and expands
`$PG_EXPORT_URL`, so it needs a Unix shell - on Windows run it from Git Bash or WSL.
The service role key bypasses Row Level Security; keep it out of commits.
````
