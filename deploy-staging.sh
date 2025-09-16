#!/bin/bash

# LUXA Menu Staging Deployment Script
# Run this script to deploy updates from repository to staging

echo "🚀 Deploying LUXA Menu to staging..."

# Navigate to project directory
cd /var/www/luxa-menu-staging

# Pull latest changes from main branch
git pull origin main

# Install dependencies
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run generate

# Run database migrations
echo "️ Running database migrations..."
npx prisma migrate deploy

# Seed the database
echo "🌱 Seeding database..."
npm run seed

# Build the application
npm run build -- --no-lint

# Restart PM2 process
pm2 restart luxa-menu-staging

echo "✅ Staging deployment complete!"
echo "🌐 Your staging app is available at: http://staging.noirvarna.com"
