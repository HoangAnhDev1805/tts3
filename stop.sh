#!/bin/bash

echo "🛑 Stopping all Node processes..."
sudo killall -9 node 2>/dev/null || true
echo "✅ Done!"
