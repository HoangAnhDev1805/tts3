#!/bin/bash

# Script sửa lỗi Nginx cho Next.js
# Usage: sudo ./fix-nginx.sh

set -e

echo "🔧 Fixing Nginx configuration for Next.js..."

# Backup current config
if [ -f /etc/nginx/sites-available/3daixs.com ]; then
    sudo cp /etc/nginx/sites-available/3daixs.com /etc/nginx/sites-available/3daixs.com.backup.$(date +%Y%m%d_%H%M%S)
    echo "✅ Backup created"
fi

# Copy new config
sudo cp /opt/3daixs.com/nginx.conf /etc/nginx/sites-available/3daixs.com
echo "✅ Config copied"

# Test config
echo "🧪 Testing Nginx config..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Config test passed"
    
    # Reload Nginx
    echo "🔄 Reloading Nginx..."
    sudo systemctl reload nginx
    echo "✅ Nginx reloaded"
    
    # Restart PM2 processes
    echo "🔄 Restarting PM2 processes..."
    pm2 restart all
    echo "✅ PM2 restarted"
    
    echo ""
    echo "🎉 Done! Try accessing https://3daixs.com now"
    echo ""
    echo "📝 Check logs:"
    echo "   sudo tail -f /var/log/nginx/3daixs_error.log"
    echo "   pm2 logs 3daixs-frontend"
else
    echo "❌ Config test failed. Restoring backup..."
    sudo cp /etc/nginx/sites-available/3daixs.com.backup.* /etc/nginx/sites-available/3daixs.com
    exit 1
fi
