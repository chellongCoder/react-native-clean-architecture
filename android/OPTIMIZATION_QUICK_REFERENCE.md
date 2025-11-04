# Quick Reference: Android Optimization

## ✅ What's Been Done

All Android optimizations from [Google's documentation](https://developer.android.com/topic/performance/app-optimization/enable-app-optimization) have been implemented:

### Changes Made:

1. **gradle.properties** - Added optimization flags
2. **app/build.gradle** - Enabled minification, shrinking, and mapping upload  
3. **proguard-rules.pro** - Updated with comprehensive keep rules

## 🚀 Build Commands

### Build Optimized Release APK
```bash
cd android
./gradlew assembleProdRelease
```
Output: `android/app/build/outputs/apk/prod/release/app-prod-release.apk`

### Build Release AAB (Play Store)
```bash
cd android
./gradlew bundleProdRelease
```
Output: `android/app/build/outputs/bundle/prodRelease/app-prod-release.aab`

### Clean Build
```bash
cd android
./gradlew clean
```

## 📊 Expected Results

- **APK Size:** 20-40% smaller
- **Startup Time:** 10-30% faster
- **Memory Usage:** 5-15% lower
- **Performance:** Smoother runtime execution

## 🔍 Important Files

### Mapping File Location
```
android/app/build/outputs/mapping/prodRelease/mapping.txt
```
**⚠️ Save this file for every release!** You need it to decode crash stack traces.

### Configuration Files
- `android/gradle.properties` - Build optimization flags
- `android/app/build.gradle` - Minification & shrinking settings
- `android/app/proguard-rules.pro` - Keep rules to prevent issues

## 📚 Documentation

- `APP_OPTIMIZATION_SUMMARY.md` - Complete implementation details
- `DECODE_STACK_TRACE.md` - How to decode obfuscated crashes

## ⚠️ Before Release

1. **Test thoroughly** - Install release APK and test all features
2. **Check mapping file** - Verify it exists after build
3. **Monitor Crashlytics** - Ensure stack traces are deobfuscated
4. **Archive mapping** - Save mapping.txt for this version

## 🐛 Troubleshooting

### If app crashes after optimization:
1. Check Crashlytics for stack trace
2. Add keep rules in `proguard-rules.pro` for affected classes
3. See `APP_OPTIMIZATION_SUMMARY.md` troubleshooting section

### If you need to temporarily disable:
```gradle
// In android/app/build.gradle
def enableProguardInReleaseBuilds = false
```

## 🎯 Next Steps

1. Build release: `cd android && ./gradlew bundleProdRelease`
2. Test thoroughly on real devices
3. Submit to Play Store internal testing
4. Monitor performance in Android Vitals

---

**Status:** ✅ Ready for production builds
