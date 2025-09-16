#!/bin/bash

echo "🚀 LUXA Menu Deployment Script"
echo "================================"
echo ""
echo "Which environment do you want to deploy to?"
echo "1) Production (http://noirvarna.com)"
echo "2) Staging (http://staging.noirvarna.com)"
echo ""
read -p "Enter choice (1 or 2): " choice

case $choice in
    1)
        echo ""
        echo "⚠️  WARNING: Deploying to PRODUCTION!"
        echo "Current directory: $PWD"
        read -p "Are you sure? (type 'yes' to continue): " confirm
        if [[ "$confirm" == "yes" ]]; then
            echo "🚀 Deploying to PRODUCTION..."
            cd /var/www/luxa-menu && ./deploy-production-server.sh
        else
            echo "❌ Production deployment cancelled"
        fi
        ;;
    2)
        echo ""
        echo "🚀 Deploying to STAGING..."
        cd /var/www/luxa-menu-staging && ./deploy-staging-server.sh
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again and choose 1 or 2."
        exit 1
        ;;
esac
