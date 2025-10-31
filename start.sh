#!/bin/bash

echo "🚀 Starting 3DAIXS.COM Services..."

# Kill old processes
echo "🔪 Killing old processes..."
sudo killall -9 node 2>/dev/null || true
sleep 2

# Start Backend
echo "📦 Starting Backend on port 5000..."
cd /opt/3daixs.com/backend
nohup node server.js > /tmp/backend.log 2>&1 &
echo "Backend PID: $!"

sleep 2

# Start Frontend  
echo "🎨 Starting Frontend on port 3000..."
cd /opt/3daixs.com/frontend
nohup npm start > /tmp/frontend.log 2>&1 &
echo "Frontend PID: $!"

sleep 3

# Check status
echo ""
echo "✅ Services started!"
echo ""
echo "📊 Status:"
echo "Backend (5000): $(lsof -ti:5000 | wc -l) process(es)"
echo "Frontend (3000): $(lsof -ti:3000 | wc -l) process(es)"
echo ""
echo "🔍 Test URLs:"
echo "curl http://localhost:5000/api/health"
echo "curl -I http://localhost:3000"
echo ""
echo "📝 Logs:"
echo "tail -f /tmp/backend.log"
echo "tail -f /tmp/frontend.log"
