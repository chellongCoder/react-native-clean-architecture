#!/bin/bash

# Script to rebuild app for Google Play resubmission
# FAMILIES POLICY COMPLIANCE VERSION
# Run this script from the project root directory

set -e

echo "� =========================================="
echo "🚨 FAMILIES POLICY COMPLIANCE BUILD"
echo "🚨 Version 1.1.1 (Build 155)"
echo "🚨 =========================================="
echo ""

# Clean previous builds
echo "📦 Step 1/5: Cleaning previous builds..."
cd android
./gradlew clean
cd ..

# Clean React Native cache
echo "🧹 Step 2/5: Cleaning React Native cache..."
rm -rf $TMPDIR/react-* 2>/dev/null || true
rm -rf $TMPDIR/metro-* 2>/dev/null || true

# Install dependencies (if needed)
echo "📥 Step 3/5: Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    yarn install
else
    echo "Dependencies already installed ✓"
fi

# Build release bundle (AAB)
echo "🏗️  Step 4/5: Building release bundle (AAB)..."
cd android
./gradlew bundleProdRelease

# Build release APK (for testing)
echo "🏗️  Step 5/5: Building release APK for testing..."
./gradlew assembleProdRelease
cd ..

echo ""
echo "✅ =========================================="
echo "✅ BUILD COMPLETED SUCCESSFULLY!"
echo "✅ =========================================="
echo ""
echo "📦 Build Artifacts:"
echo "   AAB: android/app/build/outputs/bundle/prodRelease/app-prod-release.aab"
echo "   APK: android/app/build/outputs/apk/prod/release/app-prod-release.apk"
echo ""
echo "📋 NEXT STEPS - CRITICAL:"
echo ""
echo "1. ✅ Test APK on Physical Device"
echo "   - Install the APK on an Android device"
echo "   - Test all features thoroughly"
echo "   - Verify ads still work (non-personalized)"
echo ""
echo "2. 📤 Upload to Google Play Console"
echo "   - Go to: play.google.com/console"
echo "   - Navigate to: Your App → Production → Create new release"
echo "   - Upload: app-prod-release.aab"
echo ""
echo "3. 📝 Update Data Safety Section"
echo "   - App content → Data safety"
echo "   - Change 'Collects device IDs' to NO"
echo "   - Change 'Uses Advertising ID' to NO"
echo "   - Confirm child-directed settings"
echo ""
echo "4. 📋 Release Notes"
echo "   Use: 'Updated for Families Policy compliance - removed device"
echo "   identifier collection, configured child-directed advertising'"
echo ""
echo "5. 🚀 Submit for Review"
echo ""
echo "⚠️  DEADLINE: October 31, 2025"
echo ""
echo "📚 For detailed instructions, see: FAMILIES_POLICY_FIX.md"
echo ""
echo "🎉 Good luck with your submission!"
