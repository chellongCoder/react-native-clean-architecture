#!/bin/bash

# Quick Asset Size Monitor
# Run this to quickly check your current assets

echo "🔍 Quick Asset Size Check"
echo "========================"

cd ..

# Check assets directory
if [ -d "assets" ]; then
    echo "📁 Checking assets/ directory..."
    
    # Find large files (>5MB)
    echo ""
    echo "🚨 Files larger than 5MB:"
    find assets -type f -size +5M -exec ls -lh {} \; 2>/dev/null | awk '{print "   📄 " $9 " - " $5}'
    
    # Find medium files (1-5MB)  
    echo ""
    echo "⚠️  Files between 1-5MB:"
    find assets -type f -size +1M -size -5M -exec ls -lh {} \; 2>/dev/null | awk '{print "   📄 " $9 " - " $5}'
    
    # Total assets size
    echo ""
    echo "📊 Total assets size:"
    du -sh assets 2>/dev/null | awk '{print "   📦 " $1}'
    
else
    echo "❌ No assets/ directory found"
fi

# Check for common large file types in src
echo ""
echo "🔍 Checking src/ for embedded assets..."
if [ -d "src" ]; then
    find src -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif" -o -name "*.mp3" -o -name "*.mp4" -o -name "*.pdf" \) -size +1M -exec ls -lh {} \; 2>/dev/null | awk '{print "   📄 " $9 " - " $5}'
fi

# Check node_modules for accidentally included large files
echo ""
echo "🔍 Checking for large files in source code..."
find . -name "node_modules" -prune -o -name ".git" -prune -o -type f -size +10M -print 2>/dev/null | while read -r file; do
    if [[ "$file" != "./node_modules"* ]] && [[ "$file" != "./.git"* ]]; then
        size=$(du -h "$file" 2>/dev/null | awk '{print $1}')
        echo "   🚨 $file - $size"
    fi
done

echo ""
echo "✅ Asset check complete!"

cd script
