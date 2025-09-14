#!/bin/bash

VPS_IP=$1

if [ -z "$VPS_IP" ]; then
    echo "Usage: ./quick-deploy.sh YOUR_VPS_IP"
    echo "Example: ./quick-deploy.sh 192.168.1.100"
    exit 1
fi

echo "🚀 Uploading LUXA Menu to VPS: $VPS_IP"

# Upload deploy script
echo "📤 Uploading deploy script..."
scp deploy.sh root@$VPS_IP:/root/

# Upload entire project
echo "📤 Uploading project files..."
scp -r . root@$VPS_IP:/var/www/luxa-menu/

echo "✅ Upload complete!"
echo ""
echo "📋 Now SSH into your VPS and run:"
echo "ssh root@$VPS_IP"
echo "chmod +x /root/deploy.sh"
echo "/root/deploy.sh"
echo "cd /var/www/luxa-menu"
echo "npm install"
echo "npm run build"
echo "npx prisma migrate deploy"
echo "npm run seed"
echo "pm2 start npm --name 'luxa-menu' -- start"
echo "pm2 save && pm2 startup"
