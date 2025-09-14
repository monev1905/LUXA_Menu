#!/bin/bash

# Upload script for LUXA Menu
# Run this from your local machine

VPS_IP="YOUR_VPS_IP_HERE"

echo "📤 Uploading LUXA Menu to VPS..."

# Upload the entire menu directory
scp -r . root@$VPS_IP:/var/www/luxa-menu/

echo "✅ Upload complete!"
echo "📋 Now SSH into your VPS and run:"
echo "ssh root@$VPS_IP"
echo "cd /var/www/luxa-menu"
echo "npm install"
echo "npm run build"
echo "npx prisma migrate deploy"
echo "npm run seed"
echo "pm2 start npm --name 'luxa-menu' -- start"
echo "pm2 save && pm2 startup"
