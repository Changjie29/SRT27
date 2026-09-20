#!/usr/bin/env sh
set -e

echo "Building client..."
npm run build:client

echo "Building server..."
npm run build:server

echo "Build complete."
echo "  - client dist: dist/"
echo "  - server dist: dist-server/"
