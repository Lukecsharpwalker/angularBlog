#!/bin/bash

# Exit on error
set -e

echo "Syncing from cloud Supabase instance to local Supabase..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Supabase CLI is not installed. Installing..."
    npm install -g supabase
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Initialize Supabase if not already initialized
if [ ! -f "supabase/.branches" ]; then
    echo "Initializing Supabase..."
    supabase init
fi

# Extract Supabase URL and key from environment.ts
SUPABASE_URL=$(grep -o "supabaseUrl: '[^']*'" src/environments/environment.ts | cut -d "'" -f 2)
SUPABASE_KEY=$(grep -o "supabaseKey: '[^']*'" src/environments/environment.ts | sed "s/supabaseKey: '//" | sed "s/',//")

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_KEY" ]; then
    echo "Could not extract Supabase URL or key from environment.ts"
    exit 1
fi

# Extract project reference from URL
PROJECT_REF=$(echo $SUPABASE_URL | cut -d '/' -f 3 | cut -d '.' -f 1)

echo "Found Supabase project reference: $PROJECT_REF"

# Start Supabase if not already running
if ! supabase status &> /dev/null; then
    echo "Starting Supabase..."
    supabase start
fi

# Wait for Supabase to be ready
echo "Waiting for Supabase to be ready..."
sleep 5

# Link to the remote project
echo "Linking to remote Supabase project..."
supabase link --project-ref $PROJECT_REF --password $SUPABASE_KEY

# Pull database schema and policies
echo "Pulling database schema and policies from cloud..."
supabase db pull

# Dump data from remote database (optional, can be commented out if not needed)
echo "Dumping data from remote database..."
mkdir -p supabase/seed
supabase db dump -f supabase/seed/remote_data.sql

# Apply schema and data to local instance
echo "Applying schema and data to local instance..."
supabase db reset --db-url postgresql://postgres:postgres@localhost:54322/postgres

# Print success message
echo "Local Supabase instance is now synced with cloud!"
echo "Supabase Studio: http://localhost:54323"
echo "API URL: http://localhost:54321"
echo ""
echo "To use the local Supabase instance in your Angular app, run:"
echo "  ng serve --configuration=local"
echo ""
echo "To stop Supabase, run:"
echo "  supabase stop"

# Make the script executable
chmod +x scripts/sync-from-cloud-supabase.sh
