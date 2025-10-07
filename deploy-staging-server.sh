#!/bin/bash

# ========================================
# LUXA MENU - STAGING DEPLOYMENT
# ========================================
# This script deploys to STAGING
# URL: [REDACTED]
# Database: [REDACTED]
# Directory: [REDACTED]
# ========================================

# Safety check - ensure we're on staging server
if [[ ! "$PWD" == *"luxa-menu-staging"* ]]; then
    echo "❌ ERROR: This script should only run in /var/www/luxa-menu-staging/"
    echo "Current directory: $PWD"
    echo "Please run this script from the staging directory only!"
    exit 1
fi

echo "�� Deploying to STAGING..."

# Navigate to project directory
cd /var/www/luxa-menu-staging

# Fix script permissions automatically
echo "🔧 Fixing script permissions..."
chmod +x deploy-production-server.sh deploy-staging-server.sh deploy.sh

# Pull latest changes from main branch
git pull origin main

# Install dependencies
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run generate

# Run database migrations
echo "��️ Running database migrations..."
npx prisma migrate deploy

# Seed the database
# echo "🌱 Seeding database..."
# npm run seed

# Build the application
npm run build -- --no-lint

# Restart PM2 process
pm2 restart luxa-menu-staging

echo "✅ Staging deployment complete!"
echo "🌐 Your staging app is available at: http://staging.noirvarna.com" 