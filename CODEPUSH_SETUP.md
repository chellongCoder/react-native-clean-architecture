# React Native CodePush Setup Guide

This guide covers the complete setup of React Native CodePush version 9.0.1 for both Android and iOS platforms.

## Overview

React Native CodePush allows you to deploy mobile app updates directly to your users' devices without going through the app store review process. This is particularly useful for:

- Bug fixes
- Minor feature updates
- Content updates
- A/B testing

## Prerequisites

1. **Install CodePush CLI globally:**
   ```bash
   npm install -g @microsoft/code-push-cli
   ```

2. **Create a CodePush account:**
   ```bash
   code-push register
   ```

3. **Create CodePush apps:**
   ```bash
   # For iOS
   code-push app add YourApp-iOS ios react-native

   # For Android
   code-push app add YourApp-Android android react-native
   ```

4. **Get your deployment keys:**
   ```bash
   # List your apps
   code-push app list

   # Get deployment keys for iOS
   code-push deployment list YourApp-iOS --displayKeys

   # Get deployment keys for Android
   code-push deployment list YourApp-Android --displayKeys
   ```

## Configuration Done

### ✅ Package Installation
- `react-native-code-push` version 9.0.1 is already installed in package.json

### ✅ Android Configuration
- Added CodePush Gradle plugin to `android/app/build.gradle`
- Updated `MainApplication.kt` with CodePush imports and configuration
- Added CodePush package to the React packages list
- Configured bundle URL override for CodePush

### ✅ iOS Configuration
- Added CodePush import to `AppDelegate.h`
- Updated `AppDelegate.mm` to use CodePush bundle URL for release builds
- Added CodePushDeploymentKey to `Info.plist`

### ✅ Expo Configuration
- Added CodePush plugin configuration to `app.config.ts`
- Removed invalid `entryPoint` property that was causing linter errors

## Self-Hosted CodePush Server Configuration

### Configuration Added

✅ **iOS Configuration**
- Added `CodePushServerURL` key to `Info.plist` with build variable `$(CODEPUSH_SERVER_URL)`

✅ **Android Configuration** 
- Updated `MainApplication.kt` to pass custom server URL to CodePush constructor
- Added `getCodePushServerUrl()` method that reads from `BuildConfig.CODEPUSH_SERVER_URL`

✅ **App Config**
- Added `serverUrl` property to CodePush plugin configuration in `app.config.ts`

### Build Configuration

For your self-hosted CodePush server, you'll need to set build variables:

**iOS (Xcode build settings or .xcconfig file):**
```
CODEPUSH_SERVER_URL = https://your-codepush-server.com
CODEPUSH_DEPLOYMENT_KEY = your_deployment_key
```

**Android (android/app/build.gradle):**
```gradle
android {
    defaultConfig {
        buildConfigField "String", "CODEPUSH_SERVER_URL", "\"https://your-codepush-server.com\""
        buildConfigField "String", "CODEPUSH_DEPLOYMENT_KEY", "\"your_deployment_key\""
    }
}
```

## Next Steps

### 1. Update Server URL and Deployment Keys

Replace the placeholder values in `app.config.ts` with your actual self-hosted server URL and deployment keys:

```typescript
plugins: [
  [
    'react-native-code-push',
    {
      deploymentKey: {
        ios: {
          debug: 'YOUR_ACTUAL_IOS_DEBUG_KEY',
          staging: 'YOUR_ACTUAL_IOS_STAGING_KEY', 
          release: 'YOUR_ACTUAL_IOS_PRODUCTION_KEY',
        },
        android: {
          debug: 'YOUR_ACTUAL_ANDROID_DEBUG_KEY',
          staging: 'YOUR_ACTUAL_ANDROID_STAGING_KEY',
          release: 'YOUR_ACTUAL_ANDROID_PRODUCTION_KEY',
        },
      },
      serverUrl: 'https://your-codepush-server.com', // Your self-hosted server URL
    },
  ],
],
```

### 2. Environment Variables

For better security, consider using environment variables for deployment keys and server URL:

```typescript
// In app.config.ts
plugins: [
  [
    'react-native-code-push',
    {
      deploymentKey: {
        ios: {
          debug: process.env.IOS_CODEPUSH_DEBUG_KEY,
          staging: process.env.IOS_CODEPUSH_STAGING_KEY,
          release: process.env.IOS_CODEPUSH_PRODUCTION_KEY,
        },
        android: {
          debug: process.env.ANDROID_CODEPUSH_DEBUG_KEY,
          staging: process.env.ANDROID_CODEPUSH_STAGING_KEY,
          release: process.env.ANDROID_CODEPUSH_PRODUCTION_KEY,
        },
      },
      serverUrl: process.env.CODEPUSH_SERVER_URL || 'https://your-codepush-server.com',
    },
  ],
],
```

### 3. Build Configuration

For Android, make sure your `android/app/build.gradle` includes the deployment key as a build config field:

```gradle
android {
    defaultConfig {
        // ... other config
        resValue "string", "CodePushDeploymentKey", "YOUR_ANDROID_DEPLOYMENT_KEY"
    }
}
```

### 4. Integration in Your App

Use the provided helper files:

1. **CodePushHelper.ts** - Utility functions for CodePush operations
2. **CodePushExample.tsx** - Example component showing how to integrate CodePush

### 5. Usage Examples

#### Basic Integration
```typescript
import CodePush from 'react-native-code-push';
import {CodePushHelper} from './src/core/utils/CodePushHelper';

// In your main App component
useEffect(() => {
  CodePushHelper.notifyAppReady();
  CodePushHelper.checkForUpdate();
}, []);
```

#### HOC Wrapper (Automatic Updates)
```typescript
import CodePush from 'react-native-code-push';

const MyApp = () => {
  // Your app component
};

export default CodePush({
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  installMode: CodePush.InstallMode.ON_NEXT_RESTART,
})(MyApp);
```

## Deployment Commands

### Release an Update

```bash
# For iOS
code-push release-react YourApp-iOS ios --description "Bug fix" --mandatory

# For Android  
code-push release-react YourApp-Android android --description "Bug fix" --mandatory

# For specific deployment (staging/production)
code-push release-react YourApp-iOS ios --deploymentName Staging
code-push release-react YourApp-iOS ios --deploymentName Production
```

### Check Deployment History

```bash
code-push deployment history YourApp-iOS Staging
code-push deployment history YourApp-Android Production
```

### Rollback an Update

```bash
code-push rollback YourApp-iOS Production
code-push rollback YourApp-Android Production --targetRelease v2
```

## Best Practices

1. **Test thoroughly** before releasing updates
2. **Use staging deployments** for internal testing
3. **Start with non-mandatory updates** to ensure stability
4. **Monitor rollback rates** and user feedback
5. **Always call `notifyAppReady()`** after successful updates
6. **Handle offline scenarios** gracefully
7. **Use meaningful descriptions** for your releases
8. **Consider app store policies** regarding over-the-air updates

## Troubleshooting

### Common Issues

1. **Update not appearing**: Check deployment keys and ensure they match your build configuration
2. **App crashes after update**: Ensure bundle is compatible with native code changes
3. **Updates failing silently**: Check network connectivity and server responses
4. **iOS Simulator issues**: Reset simulator if experiencing network timeouts

### Debug Mode

Enable debug mode to see detailed logs:

```bash
# View logs during development
code-push debug ios
code-push debug android
```

### Verification

Check if CodePush is working correctly:

```typescript
// Check current package info
const packageInfo = await CodePush.getCurrentPackage();
console.log('Current CodePush package:', packageInfo);
```

## Self-Hosted Server Considerations

### Server Setup
When using a self-hosted CodePush server, ensure your server:

1. **Implements the CodePush API** - Compatible with the official CodePush client
2. **Uses HTTPS** - Required for production apps
3. **Handles authentication** - Deployment keys and user authentication
4. **Supports metadata** - App versions, deployments, rollbacks
5. **Manages file storage** - Bundle storage and distribution

### Popular Self-Hosted Solutions
- **CodePush Server** - Community fork of the original Microsoft server
- **Electrode CodePush Server** - Walmart's implementation
- **Custom implementations** - Using Express.js, databases, and file storage

### Configuration Example for Self-Hosted

```bash
# Environment variables
export CODEPUSH_SERVER_URL="https://your-codepush-server.com"
export IOS_CODEPUSH_STAGING_KEY="your-ios-staging-key"
export IOS_CODEPUSH_PRODUCTION_KEY="your-ios-production-key"
export ANDROID_CODEPUSH_STAGING_KEY="your-android-staging-key"
export ANDROID_CODEPUSH_PRODUCTION_KEY="your-android-production-key"
```

### CLI Configuration for Self-Hosted

```bash
# Configure CodePush CLI for your server
code-push login --server https://your-codepush-server.com

# Create apps on your server
code-push app add YourApp-iOS ios react-native --server https://your-codepush-server.com
code-push app add YourApp-Android android react-native --server https://your-codepush-server.com

# Release updates to your server
code-push release-react YourApp-iOS ios --server https://your-codepush-server.com
code-push release-react YourApp-Android android --server https://your-codepush-server.com
```

## Resources

- [CodePush Documentation](https://docs.microsoft.com/en-us/appcenter/distribution/codepush/)
- [React Native CodePush GitHub](https://github.com/microsoft/react-native-code-push)
- [App Center Portal](https://appcenter.ms/)
- [CodePush Server (Community)](https://github.com/lisong/code-push-server)
- [Electrode CodePush Server](https://github.com/electrode-io/electrode-native)

## Notes

- CodePush only works with JavaScript/TypeScript changes
- Native code changes still require app store releases
- Be mindful of app store policies regarding code push functionality
- Consider implementing A/B testing with different deployment keys