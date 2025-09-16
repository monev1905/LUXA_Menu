#!/bin/bash

# LUXA Menu Deployment Script
# Run this script on your VPS as root

echo " Starting LUXA Menu deployment..."

# Update system
echo " Updating system packages..."
apt update && apt upgrade -y

# Install Node.js 18
echo " Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install PostgreSQL
echo " Installing PostgreSQL..."
apt install postgresql postgresql-contrib -y

# Install Nginx
echo " Installing Nginx..."
apt install nginx -y

# Install PM2
echo " Installing PM2..."
npm install -g pm2

# Install Git
echo " Installing Git..."
apt install git -y

# Create project directory
echo " Creating project directory..."
mkdir -p /var/www/luxa-menu
cd /var/www/luxa-menu

# Configure PostgreSQL
echo " Configuring PostgreSQL..."
sudo -u postgres psql -c "CREATE DATABASE menu_dev;"
sudo -u postgres psql -c "CREATE USER menu_user WITH PASSWORD 'luxa2024secure';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE menu_dev TO menu_user;"

# Create .env file
echo " Creating environment file..."
cat > .env << 'ENVEOF'
DATABASE_URL="postgresql://menu_user:luxa2024secure@localhost:5432/menu_dev"
NEXTAUTH_SECRET="luxa-menu-secret-key-2024"
NEXTAUTH_URL="http://$(curl -s ifconfig.me)"
NODE_ENV="production"
ENVEOF

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run generate

# Run database migrations
echo "️ Running database migrations..."
npx prisma migrate deploy

# Seed the database
echo "🌱 Seeding database..."
npm run seed

# Configure Nginx
echo " Configuring Nginx..."
cat > /etc/nginx/sites-available/luxa-menu << 'NGINXEOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000\;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINXEOF

# Enable the site
ln -sf /etc/nginx/sites-available/luxa-menu /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

# Configure firewall
echo " Configuring firewall..."
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable

echo "✅ Server setup complete!"
echo " Next steps:"
echo "1. Upload your code to /var/www/luxa-menu/"
echo "2. Run: cd /var/www/luxa-menu && npm install"
echo "3. Run: npm run build"
echo "4. Run: pm2 start npm --name 'luxa-menu' -- start"
echo "5. Run: pm2 save && pm2 startup"
echo ""
echo "🌐 Your app will be available at: http://$(curl -s ifconfig.me)"
