#!/bin/bash

# Enhanced CodePush Script with Bundle Analysis
# This script analyzes bundle size before deployment

echo "🚀 CodePush Deployment with Bundle Analysis"
echo "==========================================="

# Configuration
DEPLOYMENT_NAME="Staging"
APP_NAME="ABeeCi-android"
PLATFORM="android"
TARGET_VERSION="1.1"
MAX_BUNDLE_SIZE_MB=60  # Fail deployment if bundle exceeds this size

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Step 1: Analyze bundle size first
print_status $YELLOW "📊 Step 1: Analyzing bundle size..."
echo "=================================="

# Run bundle analysis
./bundle-analyzer.sh

if [ $? -ne 0 ]; then
    print_status $RED "❌ Bundle analysis failed!"
    exit 1
fi

echo ""
print_status $YELLOW "📝 Step 2: Pre-deployment checks..."
echo "=================================="

# Create a temporary bundle to check size
TEMP_DIR="/tmp/codepush-check"
mkdir -p "$TEMP_DIR"

cd ..
npx react-native bundle \
  --platform $PLATFORM \
  --dev false \
  --entry-file index.js \
  --bundle-output "$TEMP_DIR/index.$PLATFORM.bundle" \
  --assets-dest "$TEMP_DIR/assets" > /dev/null 2>&1

# Calculate total bundle size
BUNDLE_SIZE=0
ASSETS_SIZE=0

if [ -f "$TEMP_DIR/index.$PLATFORM.bundle" ]; then
    BUNDLE_SIZE=$(stat -f%z "$TEMP_DIR/index.$PLATFORM.bundle" 2>/dev/null || stat -c%s "$TEMP_DIR/index.$PLATFORM.bundle" 2>/dev/null)
fi

if [ -d "$TEMP_DIR/assets" ]; then
    ASSETS_SIZE=$(find "$TEMP_DIR/assets" -type f -exec stat -f%z {} \; 2>/dev/null | awk '{sum+=$1} END {print sum+0}' || \
                  find "$TEMP_DIR/assets" -type f -exec stat -c%s {} \; 2>/dev/null | awk '{sum+=$1} END {print sum+0}')
fi

TOTAL_SIZE=$((BUNDLE_SIZE + ASSETS_SIZE))
TOTAL_SIZE_MB=$(echo "scale=2; $TOTAL_SIZE / 1024 / 1024" | bc)

echo "📦 Bundle Size: $(echo "scale=2; $BUNDLE_SIZE / 1024 / 1024" | bc)MB"
echo "🖼️  Assets Size: $(echo "scale=2; $ASSETS_SIZE / 1024 / 1024" | bc)MB"
echo "📊 Total Size: ${TOTAL_SIZE_MB}MB"

# Check if bundle size is acceptable
if (( $(echo "$TOTAL_SIZE_MB > $MAX_BUNDLE_SIZE_MB" | bc -l) )); then
    print_status $RED "🚨 ERROR: Bundle size (${TOTAL_SIZE_MB}MB) exceeds maximum allowed size (${MAX_BUNDLE_SIZE_MB}MB)!"
    print_status $RED "   Please optimize your assets or code before deploying."
    rm -rf "$TEMP_DIR"
    exit 1
fi

print_status $GREEN "✅ Bundle size check passed (${TOTAL_SIZE_MB}MB)"

# Clean up temp files
rm -rf "$TEMP_DIR"
cd script

echo ""
print_status $YELLOW "🚀 Step 3: Deploying to CodePush..."
echo "=================================="

# Get deployment description
read -p "📝 Enter deployment description (or press Enter for default): " DESCRIPTION
if [ -z "$DESCRIPTION" ]; then
    DESCRIPTION="Bundle release v$(date +%Y%m%d-%H%M) - Size: ${TOTAL_SIZE_MB}MB"
fi

# Ask for deployment type
echo ""
echo "🎯 Choose deployment type:"
echo "1) Staging (default)"
echo "2) Production"
echo "3) Custom"
read -p "Enter choice [1]: " DEPLOY_CHOICE

case $DEPLOY_CHOICE in
    2)
        DEPLOYMENT_NAME="Production"
        print_status $YELLOW "⚠️  WARNING: Deploying to PRODUCTION!"
        read -p "Are you sure? (y/N): " CONFIRM
        if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
            print_status $YELLOW "❌ Deployment cancelled."
            exit 0
        fi
        ;;
    3)
        read -p "Enter custom deployment name: " DEPLOYMENT_NAME
        ;;
    *)
        DEPLOYMENT_NAME="Staging"
        ;;
esac

# Ask for mandatory flag
read -p "🔒 Make this deployment mandatory? (y/N): " MANDATORY
if [[ $MANDATORY =~ ^[Yy]$ ]]; then
    MANDATORY_FLAG="--mandatory"
else
    MANDATORY_FLAG=""
fi

# Ask for rollout percentage
read -p "📈 Rollout percentage (1-100) [100]: " ROLLOUT
if [ -z "$ROLLOUT" ]; then
    ROLLOUT="100"
fi

echo ""
print_status $YELLOW "🔧 Deployment Configuration:"
echo "=========================="
echo "📱 App: $APP_NAME"
echo "🏗️  Platform: $PLATFORM"
echo "🎯 Deployment: $DEPLOYMENT_NAME"
echo "📦 Bundle Size: ${TOTAL_SIZE_MB}MB"
echo "📝 Description: $DESCRIPTION"
echo "🔒 Mandatory: $([ -n "$MANDATORY_FLAG" ] && echo "Yes" || echo "No")"
echo "📈 Rollout: ${ROLLOUT}%"

echo ""
read -p "🚀 Proceed with deployment? (Y/n): " PROCEED
if [[ $PROCEED =~ ^[Nn]$ ]]; then
    print_status $YELLOW "❌ Deployment cancelled."
    exit 0
fi

echo ""
print_status $YELLOW "🚀 Executing CodePush deployment..."

# Execute CodePush release
cd ..
npx code-push release-react $APP_NAME $PLATFORM \
  --deploymentName $DEPLOYMENT_NAME \
  --targetBinaryVersion "$TARGET_VERSION" \
  --description "$DESCRIPTION" \
  $MANDATORY_FLAG \
  --rollout "${ROLLOUT}%" \
  --verbose

if [ $? -eq 0 ]; then
    print_status $GREEN "✅ Deployment successful!"
    
    echo ""
    print_status $YELLOW "📊 Post-deployment information:"
    echo "=============================="
    
    # Show deployment history
    npx code-push deployment history $APP_NAME $DEPLOYMENT_NAME
    
    echo ""
    print_status $GREEN "🎉 CodePush deployment completed successfully!"
    print_status $GREEN "   Bundle Size: ${TOTAL_SIZE_MB}MB"
    print_status $GREEN "   Deployment: $DEPLOYMENT_NAME"
    print_status $GREEN "   Rollout: ${ROLLOUT}%"
    
else
    print_status $RED "❌ Deployment failed!"
    exit 1
fi

cd script
