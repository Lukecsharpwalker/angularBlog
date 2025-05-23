# PowerShell script for setting up local Supabase instance for Angular Blog App
# Windows-compatible version of setup-local-supabase.sh
#
# Note: If running this script directly (not through npm), you may need to change the execution policy:
# Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force

# Stop on error
$ErrorActionPreference = "Stop"

Write-Host "Setting up local Supabase instance for Angular Blog App..."

# Check if Supabase CLI is installed
try {
    $null = Get-Command supabase -ErrorAction Stop
    Write-Host "Supabase CLI is already installed."
} catch {
    Write-Host "Supabase CLI is not installed. Installing..."
    npm install -g supabase
}

# Check if Docker is running
try {
    $null = docker info
} catch {
    Write-Host "Docker is not running. Please start Docker and try again."
    exit 1
}

# Initialize Supabase if not already initialized
if (-not (Test-Path "supabase\.branches")) {
    Write-Host "Initializing Supabase..."
    supabase init
}

# Start Supabase
Write-Host "Starting Supabase..."
supabase start

# Wait for Supabase to be ready
Write-Host "Waiting for Supabase to be ready..."
Start-Sleep -Seconds 5

# Apply schema
Write-Host "Applying database schema..."
supabase db reset --db-url postgresql://postgres:postgres@localhost:54322/postgres

# Create a local environment file for development
if (-not (Test-Path "src\environments\environment.local.ts")) {
    Write-Host "Creating local environment file..."
    $envContent = @"
export const environment = {
  production: false,
  supabaseUrl: 'http://localhost:54321',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
};
"@
    Set-Content -Path "src\environments\environment.local.ts" -Value $envContent
}

# Print success message
Write-Host "Local Supabase instance is now running!"
Write-Host "Admin user credentials:"
Write-Host "  Email: admin@example.com"
Write-Host "  Password: admin123"
Write-Host ""
Write-Host "Supabase Studio: http://localhost:54323"
Write-Host "API URL: http://localhost:54321"
Write-Host ""
Write-Host "To use the local Supabase instance in your Angular app, run:"
Write-Host "  ng serve --configuration=local"
Write-Host ""
Write-Host "To stop Supabase, run:"
Write-Host "  supabase stop"
