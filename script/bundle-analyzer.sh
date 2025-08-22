#!/bin/bash

# Bundle Size Analyzer for CodePush
# This script analyzes the bundle size and identifies large assets

echo "🔍 Analyzing CodePush Bundle Size..."
echo "=================================="

# Configuration
BUNDLE_OUTPUT_DIR="/tmp/codepush-analysis"
ASSETS_DIR="$BUNDLE_OUTPUT_DIR/assets"
BUNDLE_FILE="$BUNDLE_OUTPUT_DIR/index.android.bundle"
SIZE_LIMIT_MB=10  # Alert if individual asset is larger than this
TOTAL_SIZE_LIMIT_MB=50  # Alert if total bundle is larger than this

# Create temporary directory
mkdir -p "$BUNDLE_OUTPUT_DIR"

# Navigate to project root
cd ..

echo "📦 Building bundle for analysis..."
npx react-native bundle \
  --platform android \
  --dev false \
  --entry-file index.js \
  --bundle-output "$BUNDLE_FILE" \
  --assets-dest "$ASSETS_DIR"

if [ $? -ne 0 ]; then
    echo "❌ Bundle creation failed!"
    exit 1
fi

echo ""
echo "📊 Bundle Analysis Results:"
echo "=========================="

# Analyze bundle file size
if [ -f "$BUNDLE_FILE" ]; then
    BUNDLE_SIZE_BYTES=$(stat -f%z "$BUNDLE_FILE" 2>/dev/null || stat -c%s "$BUNDLE_FILE" 2>/dev/null)
    BUNDLE_SIZE_MB=$(echo "scale=2; $BUNDLE_SIZE_BYTES / 1024 / 1024" | bc)
    echo "📄 JS Bundle Size: ${BUNDLE_SIZE_MB}MB (${BUNDLE_SIZE_BYTES} bytes)"
    
    if (( $(echo "$BUNDLE_SIZE_MB > 20" | bc -l) )); then
        echo "⚠️  Warning: JS bundle is quite large (${BUNDLE_SIZE_MB}MB)"
    fi
else
    echo "❌ Bundle file not found!"
fi

echo ""
echo "🖼️  Asset Analysis:"
echo "=================="

# Initialize counters
TOTAL_ASSETS_SIZE=0
LARGE_ASSETS_COUNT=0
ASSET_COUNT=0

# Function to convert bytes to human readable format
human_readable_size() {
    local bytes=$1
    if [ $bytes -ge 1048576 ]; then
        echo "$(echo "scale=2; $bytes / 1048576" | bc)MB"
    elif [ $bytes -ge 1024 ]; then
        echo "$(echo "scale=2; $bytes / 1024" | bc)KB"
    else
        echo "${bytes}B"
    fi
}

# Analyze assets if directory exists
if [ -d "$ASSETS_DIR" ]; then
    echo "📁 Large Assets (>${SIZE_LIMIT_MB}MB):"
    echo "-----------------------------------"
    
    # Find and analyze all files
    find "$ASSETS_DIR" -type f | while read -r file; do
        if [ -f "$file" ]; then
            FILE_SIZE=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
            FILE_SIZE_MB=$(echo "scale=2; $FILE_SIZE / 1024 / 1024" | bc)
            RELATIVE_PATH=${file#$ASSETS_DIR/}
            
            # Check if file is large
            if (( $(echo "$FILE_SIZE_MB > $SIZE_LIMIT_MB" | bc -l) )); then
                echo "🚨 $RELATIVE_PATH - $(human_readable_size $FILE_SIZE)"
                LARGE_ASSETS_COUNT=$((LARGE_ASSETS_COUNT + 1))
            fi
            
            TOTAL_ASSETS_SIZE=$((TOTAL_ASSETS_SIZE + FILE_SIZE))
            ASSET_COUNT=$((ASSET_COUNT + 1))
        fi
    done
    
    # Calculate total assets size
    TOTAL_ASSETS_MB=$(echo "scale=2; $TOTAL_ASSETS_SIZE / 1024 / 1024" | bc)
    echo ""
    echo "📊 Assets Summary:"
    echo "================="
    echo "📁 Total Assets: $ASSET_COUNT files"
    echo "📏 Total Assets Size: ${TOTAL_ASSETS_MB}MB"
    echo "🚨 Large Assets (>${SIZE_LIMIT_MB}MB): $LARGE_ASSETS_COUNT files"
    
else
    echo "❌ Assets directory not found!"
fi

echo ""
echo "📦 Overall Bundle Analysis:"
echo "=========================="

# Calculate total bundle size
TOTAL_BUNDLE_SIZE=$((BUNDLE_SIZE_BYTES + TOTAL_ASSETS_SIZE))
TOTAL_BUNDLE_MB=$(echo "scale=2; $TOTAL_BUNDLE_SIZE / 1024 / 1024" | bc)

echo "📄 JS Bundle: ${BUNDLE_SIZE_MB}MB"
echo "🖼️  Assets: ${TOTAL_ASSETS_MB}MB"
echo "📦 Total Bundle: ${TOTAL_BUNDLE_MB}MB"

# Check if total bundle exceeds limit
if (( $(echo "$TOTAL_BUNDLE_MB > $TOTAL_SIZE_LIMIT_MB" | bc -l) )); then
    echo ""
    echo "🚨 WARNING: Total bundle size (${TOTAL_BUNDLE_MB}MB) exceeds recommended limit (${TOTAL_SIZE_LIMIT_MB}MB)!"
    echo "   Consider optimizing assets or code splitting."
fi

echo ""
echo "💡 Optimization Suggestions:"
echo "=========================="

# Analyze specific file types
echo "🖼️  Image Analysis:"
find "$ASSETS_DIR" -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif" \) | while read -r file; do
    if [ -f "$file" ]; then
        FILE_SIZE=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        FILE_SIZE_KB=$(echo "scale=0; $FILE_SIZE / 1024" | bc)
        RELATIVE_PATH=${file#$ASSETS_DIR/}
        
        if [ $FILE_SIZE -gt 1048576 ]; then  # > 1MB
            echo "   🔍 Consider optimizing: $RELATIVE_PATH ($(human_readable_size $FILE_SIZE))"
        fi
    fi
done

echo ""
echo "🎵 Audio/Video Analysis:"
find "$ASSETS_DIR" -type f \( -name "*.mp3" -o -name "*.mp4" -o -name "*.wav" -o -name "*.m4a" \) | while read -r file; do
    if [ -f "$file" ]; then
        FILE_SIZE=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        RELATIVE_PATH=${file#$ASSETS_DIR/}
        echo "   🔍 Media file: $RELATIVE_PATH ($(human_readable_size $FILE_SIZE))"
    fi
done

echo ""
echo "🔧 Recommendations:"
echo "=================="
echo "1. 🖼️  Optimize images: Use tools like ImageOptim, TinyPNG"
echo "2. 📱 Use @2x, @3x variants instead of single high-res images"
echo "3. 🗜️  Consider using WebP format for images"
echo "4. 📦 Enable asset compression in metro.config.js"
echo "5. 🎵 Compress audio files or use streaming for large media"
echo "6. 📊 Monitor bundle size in CI/CD pipeline"

# Clean up
echo ""
echo "🧹 Cleaning up temporary files..."
rm -rf "$BUNDLE_OUTPUT_DIR"

echo "✅ Analysis complete!"
