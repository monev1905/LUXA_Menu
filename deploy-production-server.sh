#!/bin/bash

# ========================================
# LUXA MENU - PRODUCTION DEPLOYMENT
# ========================================
# This script deploys to PRODUCTION
# URL: [REDACTED]
# Database: [REDACTED]
# Directory: [REDACTED]
# ========================================

# Safety check - ensure we're on production server
if [[ ! "$PWD" == *"luxa-menu"* ]] || [[ "$PWD" == *"staging"* ]]; then
    echo "❌ ERROR: This script should only run in /var/www/luxa-menu/ (NOT staging)"
    echo "Current directory: $PWD"
    echo "Please run this script from the production directory only!"
    exit 1
fi

# Additional safety check - confirm production deployment
echo "⚠️  WARNING: You are about to deploy to PRODUCTION!"
echo "Current directory: $PWD"
read -p "Are you sure? (type 'yes' to continue): " confirm
if [[ "$confirm" != "yes" ]]; then
    echo "❌ Production deployment cancelled"
    exit 1
fi

echo " Deploying to PRODUCTION..."

# Navigate to project directory
cd /var/www/luxa-menu

# Fix script permissions automatically
echo "🔧 Fixing script permissions..."
chmod +x deploy-production-server.sh deploy-staging-server.sh deploy.sh

# Pull latest changes from repository
echo "📥 Pulling latest changes from repository..."
git pull origin main

# Install/update dependencies
echo " Installing/updating dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run generate

# Build the application
echo "🔨 Building application..."
npm run build -- --no-lint

# Run database migrations
echo "️ Running database migrations..."
npx prisma migrate deploy

# Seed database (optional - uncomment if needed)
# echo "🌱 Seeding database..."
# npm run seed

# Restart PM2 application
echo "🔄 Restarting application..."
pm2 restart luxa-menu

echo "✅ Production deployment complete!"
echo " Your app is available at: http://noirvarna.com" 