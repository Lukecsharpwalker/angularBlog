# PowerShell script for syncing from cloud Supabase instance to local Supabase
# Windows-compatible version of sync-from-cloud-supabase.sh
#
# Note: If running this script directly (not through npm), you may need to change the execution policy:
# Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force

# Stop on error
$ErrorActionPreference = "Stop"

Write-Host "Syncing from cloud Supabase instance to local Supabase..."

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

# Extract Supabase URL and key from environment.ts
$envContent = Get-Content "src\environments\environment.ts" -Raw
$supabaseUrlMatch = [regex]::Match($envContent, "supabaseUrl: '([^']*)'")
$supabaseKeyMatch = [regex]::Match($envContent, "supabaseKey:\s*'([^']*)'")

if (-not $supabaseUrlMatch.Success -or -not $supabaseKeyMatch.Success) {
    Write-Host "Could not extract Supabase URL or key from environment.ts"
    exit 1
}

$SUPABASE_URL = $supabaseUrlMatch.Groups[1].Value
$SUPABASE_KEY = $supabaseKeyMatch.Groups[1].Value

# Extract project reference from URL
$PROJECT_REF = $SUPABASE_URL.Split('/')[2].Split('.')[0]

Write-Host "Found Supabase project reference: $PROJECT_REF"

# Start Supabase if not already running
try {
    $null = supabase status
} catch {
    Write-Host "Starting Supabase..."
    supabase start
}

# Wait for Supabase to be ready
Write-Host "Waiting for Supabase to be ready..."
Start-Sleep -Seconds 5

# Link to the remote project
Write-Host "Linking to remote Supabase project..."
supabase link --project-ref $PROJECT_REF --password $SUPABASE_KEY

# Pull database schema and policies
Write-Host "Pulling database schema and policies from cloud..."
supabase db pull

# Dump data from remote database (optional, can be commented out if not needed)
Write-Host "Dumping data from remote database..."
if (-not (Test-Path "supabase\seed")) {
    New-Item -Path "supabase\seed" -ItemType Directory -Force | Out-Null
}
supabase db dump -f supabase/seed/remote_data.sql

# Apply schema and data to local instance
Write-Host "Applying schema and data to local instance..."
supabase db reset --db-url postgresql://postgres:postgres@localhost:54322/postgres

# Print success message
Write-Host "Local Supabase instance is now synced with cloud!"
Write-Host "Supabase Studio: http://localhost:54323"
Write-Host "API URL: http://localhost:54321"
Write-Host ""
Write-Host "To use the local Supabase instance in your Angular app, run:"
Write-Host "  ng serve --configuration=local"
Write-Host ""
Write-Host "To stop Supabase, run:"
Write-Host "  supabase stop"
