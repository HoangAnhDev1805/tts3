#!/bin/bash

echo "📤 Push Code to GitHub: https://github.com/HoangAnhDev1805/tts3.git"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

cd /opt/3daixs.com

# Step 1: Cleanup
echo -e "${YELLOW}🧹 Step 1: Cleaning up...${NC}"
rm -rf backend/node_modules
rm -rf frontend/node_modules
rm -rf frontend/.next
rm -rf frontend/out
rm -f backend/.env
rm -f frontend/.env.local
rm -rf backend/logs/*.log
rm -f /tmp/*.log
echo "✅ Cleanup done"
echo ""

# Step 2: Keep folder structure
echo -e "${YELLOW}📁 Step 2: Keeping folder structure...${NC}"
mkdir -p backend/uploads/avatars
mkdir -p backend/uploads/qrcodes
mkdir -p backend/logs
touch backend/uploads/avatars/.gitkeep
touch backend/uploads/qrcodes/.gitkeep
touch backend/logs/.gitkeep
echo "✅ Folder structure ready"
echo ""

# Step 3: Initialize Git
echo -e "${YELLOW}🔧 Step 3: Initializing Git...${NC}"
if [ -d .git ]; then
    echo "Git already initialized"
else
    git init
    echo "✅ Git initialized"
fi
echo ""

# Step 4: Configure Git
echo -e "${YELLOW}⚙️  Step 4: Configuring Git...${NC}"
git config user.name "HoangAnhDev1805" 2>/dev/null || true
git config user.email "hoanganh@3daixs.com" 2>/dev/null || true
echo "✅ Git configured"
echo ""

# Step 5: Add remote
echo -e "${YELLOW}🔗 Step 5: Adding remote...${NC}"
if git remote | grep -q origin; then
    git remote remove origin
fi
git remote add origin https://github.com/HoangAnhDev1805/tts3.git
echo "✅ Remote added"
echo ""

# Step 6: Add files
echo -e "${YELLOW}➕ Step 6: Adding files...${NC}"
git add .
echo "✅ Files added"
echo ""

# Step 7: Show status
echo -e "${YELLOW}📊 Step 7: Git status...${NC}"
git status --short | head -20
echo "..."
echo ""

# Step 8: Commit
echo -e "${YELLOW}💾 Step 8: Committing...${NC}"
git commit -m "Initial commit: 3DAIXS Lottery System

- ✅ Backend: Node.js + Express + MongoDB (90+ files)
- ✅ Frontend: Next.js 14 + TypeScript + TailwindCSS (45+ files)
- ✅ Full CRUD operations
- ✅ Real-time Socket.IO
- ✅ JWT Authentication
- ✅ Admin Panel
- ✅ Deployment configs (Nginx + PM2)
- ✅ Complete documentation
"
echo "✅ Committed"
echo ""

# Step 9: Push
echo -e "${YELLOW}🚀 Step 9: Pushing to GitHub...${NC}"
echo ""
echo -e "${RED}⚠️  You will need to enter your GitHub credentials:${NC}"
echo "   Username: HoangAnhDev1805"
echo "   Password: Your GitHub Personal Access Token"
echo ""
echo "How to get token:"
echo "1. Go to: https://github.com/settings/tokens"
echo "2. Generate new token (classic)"
echo "3. Select 'repo' scope"
echo "4. Copy token and paste as password"
echo ""
read -p "Press Enter to continue..."

git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ SUCCESS! Code pushed to GitHub!${NC}"
    echo ""
    echo "🌐 View at: https://github.com/HoangAnhDev1805/tts3"
else
    echo ""
    echo -e "${RED}❌ Push failed. Please check your credentials.${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "1. Make sure repository exists: https://github.com/HoangAnhDev1805/tts3"
    echo "2. Use Personal Access Token (not password)"
    echo "3. Token must have 'repo' permission"
fi
