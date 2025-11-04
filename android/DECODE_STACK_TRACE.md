# How to Decode Obfuscated Stack Traces

After enabling R8/ProGuard optimization, stack traces from crashes will be obfuscated (class and method names will be shortened). This guide shows you how to decode them back to readable format.

## Automatic Decoding with Firebase Crashlytics

Firebase Crashlytics automatically uploads and uses mapping files to decode stack traces. No manual action needed for crashes reported through Firebase.

**Setup:**
- Mapping files are automatically uploaded when you build a release APK/AAB
- Check Firebase Console → Crashlytics → Stack traces are automatically deobfuscated

## Manual Stack Trace Decoding

### 1. Locate the Mapping File

After building a release APK/AAB, the mapping file is located at:
```
android/app/build/outputs/mapping/prodRelease/mapping.txt
# or
android/app/build/outputs/mapping/devRelease/mapping.txt
```

**Important:** Save this file for each release version!

### 2. Decode Stack Trace Using R8/ProGuard

#### Method 1: Using Android Studio
```bash
cd android

# Using retrace tool (comes with Android SDK)
$ANDROID_HOME/tools/proguard/bin/retrace.sh \
  app/build/outputs/mapping/prodRelease/mapping.txt \
  stacktrace.txt
```

#### Method 2: Using Gradle Task
```bash
cd android

# First, save your obfuscated stack trace to a file
# Then run:
./gradlew :app:decodeProdReleaseStackTrace -PstackTraceFile=path/to/stacktrace.txt
```

#### Method 3: Using Online Tool
1. Go to: https://retrace.proguard.dev/
2. Upload your `mapping.txt` file
3. Paste the obfuscated stack trace
4. Click "Retrace"

### 3. Decode Using Command Line

If you have the Android SDK installed:

```bash
# Find retrace tool
find $ANDROID_HOME -name "retrace.sh" -o -name "retrace.jar"

# Decode with retrace.sh
retrace.sh mapping.txt stacktrace.txt > decoded_stacktrace.txt

# Or with Java directly
java -jar $ANDROID_HOME/tools/proguard/lib/retrace.jar \
  mapping.txt \
  stacktrace.txt
```

## Example

### Obfuscated Stack Trace:
```
at com.a.b.c.d(Unknown Source:12)
at com.a.b.e.f(Unknown Source:45)
```

### After Decoding:
```
at com.alphadex.tbd.app.MainActivity.onCreate(MainActivity.kt:12)
at com.alphadex.tbd.app.utils.Helper.doSomething(Helper.kt:45)
```

## Best Practices

1. **Archive mapping files:** Save mapping.txt for every release
   - Store in version control or artifact repository
   - Name them with version: `mapping-v1.1.2-160.txt`

2. **Test optimized builds:** Always test release builds before publishing
   ```bash
   cd android
   ./gradlew assembleProdRelease
   # Install and test the APK thoroughly
   ```

3. **Use Crashlytics:** It handles mapping automatically
   - Already configured in build.gradle
   - Uploads happen during release builds

4. **Keep mapping files organized:**
   ```
   mappings/
   ├── v1.1.0/
   │   └── mapping.txt
   ├── v1.1.1/
   │   └── mapping.txt
   └── v1.1.2/
       └── mapping.txt
   ```

## Troubleshooting

### Stack trace still showing obfuscated names:
- Ensure you're using the correct mapping.txt for that specific build
- Check that the version code matches

### Missing mapping file:
- Rebuild the release APK/AAB: `./gradlew bundleProdRelease`
- Check `app/build/outputs/mapping/` directory

### Firebase Crashlytics not deobfuscating:
- Verify mapping upload: Check Firebase Console → Crashlytics → Settings
- Ensure `firebaseCrashlytics.mappingFileUploadEnabled = true` in build.gradle
- Check build logs for mapping upload confirmation

## Useful Commands

```bash
# Build release APK with mapping
cd android && ./gradlew assembleProdRelease

# Build release AAB (for Play Store)
cd android && ./gradlew bundleProdRelease

# Check mapping file exists
ls -lh android/app/build/outputs/mapping/prodRelease/mapping.txt

# Copy mapping file to safe location
cp android/app/build/outputs/mapping/prodRelease/mapping.txt \
   ./mappings/v$(cat package.json | grep version | cut -d'"' -f4)/mapping.txt
```

## References

- [Android R8 Documentation](https://developer.android.com/tools/r8)
- [ProGuard Retrace](https://www.guardsquare.com/manual/tools/retrace)
- [Firebase Crashlytics Mapping Files](https://firebase.google.com/docs/crashlytics/get-deobfuscated-reports?platform=android)
