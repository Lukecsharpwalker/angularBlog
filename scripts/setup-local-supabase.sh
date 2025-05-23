
#!/bin/bash

# Exit on error
set -e

echo "Setting up local Supabase instance for Angular Blog App..."

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

# Start Supabase
echo "Starting Supabase..."
supabase start

# Wait for Supabase to be ready
echo "Waiting for Supabase to be ready..."
sleep 5

# Apply schema
echo "Applying database schema..."
supabase db reset --db-url postgresql://postgres:postgres@localhost:54322/postgres

# Create a local environment file for development
if [ ! -f "src/environments/environment.local.ts" ]; then
    echo "Creating local environment file..."
    cat > src/environments/environment.local.ts << EOL
export const environment = {
  production: false,
  supabaseUrl: 'http://localhost:54321',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
};
EOL
fi

# Print success message
echo "Local Supabase instance is now running!"
echo "Admin user credentials:"
echo "  Email: admin@example.com"
echo "  Password: admin123"
echo ""
echo "Supabase Studio: http://localhost:54323"
echo "API URL: http://localhost:54321"
echo ""
echo "To use the local Supabase instance in your Angular app, run:"
echo "  ng serve --configuration=local"
echo ""
echo "To stop Supabase, run:"
echo "  supabase stop"

# Make the script executable
chmod +x scripts/setup-local-supabase.sh
