#!/bin/bash

# Build script for Taylor resume extension

echo "Building Taylor Resume Extension..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the extension
echo "Building extension with Vite..."
npm run build

# Copy manifest and static files to dist
echo "Copying manifest and icons..."
cp manifest.json dist/
mkdir -p dist/icons
cp -r icons/* dist/icons/

# Adjust paths in manifest for distribution
echo "Adjusting paths in manifest..."
sed -i 's/src\/content\/content.js/content\/content.js/g' dist/manifest.json
sed -i 's/src\/background\/background.js/background\/background.js/g' dist/manifest.json

echo "Build complete! Extension is ready in the 'dist' folder."
echo "To install in Chrome:"
echo "1. Go to chrome://extensions/"
echo "2. Enable 'Developer mode'"
echo "3. Click 'Load unpacked'"
echo "4. Select the 'dist' folder"
