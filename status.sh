#!/bin/bash

echo "📊 Service Status:"
echo ""
echo "Backend (port 5000):"
lsof -ti:5000 && echo "  ✅ Running" || echo "  ❌ Not running"
echo ""
echo "Frontend (port 3000):"
lsof -ti:3000 && echo "  ✅ Running" || echo "  ❌ Not running"
echo ""
echo "Test:"
echo "curl -I http://localhost:3000"
curl -I http://localhost:3000 2>/dev/null | head -2
