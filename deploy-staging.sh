#!/bin/bash

# LUXA Menu Staging Deployment Script
# Run this script to deploy updates from repository to staging

echo "🚀 Deploying LUXA Menu to staging..."

# Navigate to project directory
cd /var/www/luxa-menu-staging

# Pull latest changes from repository
echo "📥 Pulling latest changes from repository..."
git pull origin staging

# Install/update dependencies
echo "📦 Installing/updating dependencies..."
npm install

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
echo "🔄 Restarting staging application..."
pm2 restart luxa-menu-staging

echo "✅ Staging deployment complete!"
echo "🌐 Your staging app is available at: http://staging.noirvarna.com"
