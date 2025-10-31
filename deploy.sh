#!/bin/bash

# 3DAIXS.COM - Quick Deployment Script
# Usage: ./deploy.sh

set -e

echo "🚀 Starting deployment for 3DAIXS.COM..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    echo -e "${RED}❌ Please do not run as root${NC}"
    exit 1
fi

# 1. Create directories
echo -e "${YELLOW}📁 Creating directories...${NC}"
mkdir -p /opt/3daixs.com/backend/uploads/avatars
mkdir -p /opt/3daixs.com/backend/uploads/qrcodes
mkdir -p /opt/3daixs.com/backend/logs
chmod -R 755 /opt/3daixs.com/backend/uploads

# 2. Backend setup
echo -e "${YELLOW}📦 Setting up backend...${NC}"
cd /opt/3daixs.com/backend

if [ ! -f .env ]; then
    echo -e "${YELLOW}⚙️  Creating .env file...${NC}"
    cp .env.production .env
    echo -e "${RED}⚠️  Please edit /opt/3daixs.com/backend/.env and update:${NC}"
    echo "   - JWT_SECRET"
    echo "   - JWT_REFRESH_SECRET"
    echo "   - MONGODB_URI (if using authentication)"
    read -p "Press enter to continue after editing .env..."
fi

npm install --production

# Seed database if needed
read -p "Do you want to seed the database? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run seed
fi

# 3. Frontend setup
echo -e "${YELLOW}🎨 Setting up frontend...${NC}"
cd /opt/3daixs.com/frontend

if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚙️  Creating .env.local file...${NC}"
    cp .env.production .env.local
fi

npm install --production
npm run build

# 4. PM2 setup
echo -e "${YELLOW}⚡ Setting up PM2...${NC}"

# Stop existing processes
pm2 delete 3daixs-backend 2>/dev/null || true
pm2 delete 3daixs-frontend 2>/dev/null || true

# Start backend
cd /opt/3daixs.com/backend
pm2 start ecosystem.config.js

# Start frontend
cd /opt/3daixs.com/frontend
pm2 start npm --name "3daixs-frontend" -- start

# Save PM2 config
pm2 save

# 5. Nginx setup
echo -e "${YELLOW}🌐 Setting up Nginx...${NC}"

if [ ! -f /etc/nginx/sites-available/3daixs.com ]; then
    sudo cp /opt/3daixs.com/nginx.conf /etc/nginx/sites-available/3daixs.com
    sudo ln -s /etc/nginx/sites-available/3daixs.com /etc/nginx/sites-enabled/ 2>/dev/null || true
    sudo rm /etc/nginx/sites-enabled/default 2>/dev/null || true
fi

# Test Nginx config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# 6. Status check
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "📊 Service Status:"
pm2 list
echo ""
echo "🌐 URLs:"
echo "   Frontend: https://3daixs.com"
echo "   API: https://3daixs.com/api"
echo "   Health: https://3daixs.com/health"
echo ""
echo "📝 Logs:"
echo "   pm2 logs"
echo "   sudo tail -f /var/log/nginx/3daixs_access.log"
echo ""
echo "🎉 Done! Your website is now live!"
