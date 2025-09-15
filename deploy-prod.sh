#!/bin/bash

# LUXA Menu Production Deployment Script
# Run this script to deploy updates from repository to production

echo "�� Deploying LUXA Menu to production..."

# Navigate to project directory
cd /var/www/luxa-menu

# Pull latest changes from repository
echo "📥 Pulling latest changes from repository..."
git pull origin main

# Install/update dependencies
echo "📦 Installing/updating dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build -- --no-lint

# Run database migrations
echo "��️ Running database migrations..."
npx prisma migrate deploy

# Seed database (optional - uncomment if needed)
# echo "�� Seeding database..."
# npm run seed

# Restart PM2 application
echo "🔄 Restarting application..."
pm2 restart luxa-menu

echo "✅ Production deployment complete!"
echo "🌐 Your app is available at: http://noirvarna.com"
