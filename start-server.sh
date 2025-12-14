#!/bin/bash

# Start Call Break Game Server

echo "Starting Call Break Game Server..."
echo "=================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Error: node_modules not found. Please run 'npm install' first."
    exit 1
fi

# Get local IP address
if command -v ifconfig &> /dev/null; then
    # macOS/Linux
    LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)
elif command -v ip &> /dev/null; then
    # Linux alternative
    LOCAL_IP=$(ip addr show | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | cut -d/ -f1 | head -n 1)
else
    LOCAL_IP="localhost"
fi

echo "Server will be accessible at:"
echo "  Local:   http://localhost:3000"
if [ "$LOCAL_IP" != "localhost" ]; then
    echo "  Network: http://$LOCAL_IP:3000"
fi
echo ""
echo "Update App.tsx with the network URL for mobile device testing."
echo ""
echo "Press Ctrl+C to stop the server"
echo "=================================="
echo ""

# Start the server
node -r ts-node/register server/index.ts
