# Google Cloud Speech API Authentication Fix for Release Builds

## Problem
The app was getting `io.grpc.StatusRuntimeException: UNAUTHENTICATED` error in release mode but working fine in debug mode when calling `speechClient.recognize()`.

## Root Cause
1. **ProGuard/R8 Obfuscation**: In release builds, ProGuard/R8 was obfuscating or removing critical classes needed for Google Cloud Speech API authentication, including:
   - Google Auth classes (GoogleCredentials, ServiceAccountCredentials)
   - gRPC classes (Metadata, CallCredentials)
   - Protobuf classes
   - Google API GAX classes

2. **Missing Consumer ProGuard Rules**: The @react-native-voice/voice module didn't have consumer ProGuard rules, so the app wasn't properly configured to keep necessary classes.

3. **Resource Shrinking**: The credentials file might have been affected by resource shrinking in release builds.

## Solution Applied

### 1. Updated ProGuard Rules (`android/app/proguard-rules.pro`)
Added comprehensive keep rules for:
- Google Cloud Speech API classes
- Google Auth classes (critical for authentication)
- gRPC classes (critical for API communication)
- Protobuf classes
- Google API GAX classes
- Netty classes (used by gRPC)
- Conscrypt classes (SSL/TLS provider)
- Raw resources (credentials file)

### 2. Added Consumer ProGuard Rules to Voice Module
Created `/node_modules/@react-native-voice/voice/android/proguard-rules.pro` with necessary keep rules.

Updated `/node_modules/@react-native-voice/voice/android/build.gradle` to include:
```groovy
consumerProguardFiles 'proguard-rules.pro'
```

### 3. Created Resource Keep File
Created `/android/app/src/main/res/xml/keep.xml` to explicitly prevent resource shrinking from removing the credentials file.

### 4. Updated App Build Configuration
Updated `/android/app/build.gradle` to add:
```groovy
resValue "bool", "keep_raw_resources", "true"
```

## Next Steps

### Clean and Rebuild
Run the following commands to test the fix:

```bash
cd android
./gradlew clean
./gradlew assembleRelease
# or for a specific flavor:
./gradlew assembleProdRelease
```

### Testing
1. Install the release APK on a device
2. Test the speech recognition functionality
3. Check logcat for any authentication errors

## Important Note
Since the ProGuard rules were added to the node_modules directory, they will be lost if you:
- Delete node_modules
- Run `npm install` or `yarn install` from scratch

### Permanent Solution
Consider using `patch-package` to persist these changes:

```bash
npm install patch-package --save-dev
```

Then add to package.json:
```json
"scripts": {
  "postinstall": "patch-package"
}
```

Create the patch:
```bash
npx patch-package @react-native-voice/voice
```

This will create a patch file in `patches/` directory that automatically applies the changes after npm install.

