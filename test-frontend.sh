#!/bin/bash

echo "🔍 Kiểm tra Frontend..."

cd /opt/3daixs.com/frontend

# Check if .next exists
if [ ! -d ".next" ]; then
    echo "❌ Chưa build! Building now..."
    npm run build
fi

# Kill existing process on port 3000
echo "🔪 Killing existing process on port 3000..."
sudo lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Start fresh
echo "🚀 Starting frontend..."
npm run dev &

sleep 5

# Test
echo "🧪 Testing localhost:3000..."
curl -I http://localhost:3000

echo ""
echo "✅ Done! Check if frontend is running"
