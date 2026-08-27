#!/usr/bin/env bash
# Render build script - Simple version without apt-get

echo "📦 Installing dependencies..."
npm install

echo "✅ Build complete!"
echo "⚠️  Note: Puppeteer will download Chromium automatically"
echo "    Browser automation will use mock mode on production"
