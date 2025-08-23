#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');

// Load environment configuration
const loadEnvironment = () => {
  const env = process.env.NODE_ENV || 'production';
  
  try {
    let envConfig;
    
    if (env === 'local') {
      envConfig = require('../environments/environment.local.ts');
    } else if (env === 'development') {
      envConfig = require('../environments/environment.development.ts');
    } else {
      envConfig = require('../environments/environment.ts');
    }
    
    return envConfig.environment;
  } catch (error) {
    console.error('Failed to load environment config:', error.message);
    console.log('Falling back to environment variables...');
    
    return {
      supabaseUrl: process.env.SUPABASE_URL || 'https://aqdbdmepncxxuanlymwr.supabase.co',
      supabaseKey: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZGJkbWVwbmN4eHVhbmx5bXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNTA0MjYsImV4cCI6MjA2MDYyNjQyNn0.RNtZZ4Of4LIP3XuS9lumHYdjRLVUGXARtAxaTJmF7lc'
    };
  }
};

async function generateRoutes() {
  try {
    console.log('🚀 Starting route generation...');
    
    // Load environment configuration
    const config = loadEnvironment();
    console.log(`📡 Using Supabase URL: ${config.supabaseUrl}`);
    
    // Initialize Supabase client
    const supabase = createClient(config.supabaseUrl, config.supabaseKey);
    
    // Fetch all published post IDs
    console.log('📄 Fetching published posts...');
    const { data: posts, error } = await supabase
      .from('posts')
      .select('id')
      .eq('is_draft', false)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Supabase query failed: ${error.message}`);
    }
    
    if (!posts || posts.length === 0) {
      console.warn('⚠️  No published posts found in database');
      return;
    }
    
    console.log(`✅ Found ${posts.length} published posts`);
    
    // Generate routes
    const routes = [
      '/', // Home page
      ...posts.map(post => `/details/${post.id}`) // Individual post pages
    ];
    
    // Create routes.txt content
    const routesContent = routes.join('\n') + '\n';
    
    // Write to routes.txt
    const routesPath = path.join(__dirname, '..', 'routes.txt');
    await fs.writeFile(routesPath, routesContent, 'utf8');
    
    console.log('📝 Generated routes.txt with the following routes:');
    routes.forEach(route => console.log(`   ${route}`));
    console.log(`💾 Routes saved to: ${routesPath}`);
    
    console.log('✨ Route generation completed successfully!');
    
  } catch (error) {
    console.error('❌ Error generating routes:', error.message);
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
📚 Generate Routes Script

This script fetches all published post IDs from Supabase and generates a routes.txt file
for Angular prerendering.

Usage:
  node scripts/generate-routes.js [options]

Options:
  --help, -h    Show this help message
  --env <env>   Set environment (local, development, production)

Environment Variables:
  NODE_ENV           Environment mode (defaults to 'production')
  SUPABASE_URL       Supabase project URL (optional, uses config if not set)
  SUPABASE_ANON_KEY  Supabase anonymous key (optional, uses config if not set)

Examples:
  node scripts/generate-routes.js
  NODE_ENV=local node scripts/generate-routes.js
  node scripts/generate-routes.js --env development
  `);
  process.exit(0);
}

// Set environment from command line argument
const envIndex = args.indexOf('--env');
if (envIndex !== -1 && args[envIndex + 1]) {
  process.env.NODE_ENV = args[envIndex + 1];
}

// Run the script
generateRoutes();