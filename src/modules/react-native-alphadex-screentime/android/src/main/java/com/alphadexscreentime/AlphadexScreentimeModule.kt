package com.alphadexscreentime

import android.app.AppOpsManager
import android.app.NotificationManager
import android.content.Context
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.content.pm.PackageInfo
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.os.Build
import android.provider.Settings
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableArray
import java.io.File


class AlphadexScreentimeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  val SYSTEM_APP_MASK = ApplicationInfo.FLAG_SYSTEM or ApplicationInfo.FLAG_UPDATED_SYSTEM_APP


  override fun getName(): String {

    return NAME
  }

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  fun multiply(a: Double, b: Double, promise: Promise) {
    promise.resolve(a * b)
  }

  @ReactMethod
  private fun askOverlayPermission(promise: Promise) {
    if (!Settings.canDrawOverlays(reactApplicationContext)) {
      val myIntent = Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION)
      myIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      reactApplicationContext.startActivity(myIntent)
    }
    promise.resolve(Settings.canDrawOverlays(reactApplicationContext))
  }



  @ReactMethod
  private fun checkOverlayPermission(promise: Promise) {
    promise.resolve(Settings.canDrawOverlays(reactApplicationContext))
  }

  @ReactMethod
  fun startUsageStatsPermission(promise: Promise) {
    val myIntent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
    myIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    reactApplicationContext.startActivity(myIntent)
    promise.resolve(hasUsageStatsPermission(promise))
  }

  @ReactMethod
  fun hasUsageStatsPermission(promise: Promise): Boolean {
    val appOps = reactApplicationContext.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
    val mode = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
      appOps.unsafeCheckOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS,
        reactApplicationContext.applicationInfo.uid, reactApplicationContext.packageName)
    } else {
      appOps.checkOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS,
        reactApplicationContext.applicationInfo.uid, reactApplicationContext.packageName)
    }
    val result = mode == AppOpsManager.MODE_ALLOWED
    promise.resolve(result)
    return result
  }


  @ReactMethod
  fun checkAndRequestNotificationPermission(promise : Promise) {
    val notificationManager = reactApplicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

    if (if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
        !notificationManager.areNotificationsEnabled()
      } else {
        TODO("VERSION.SDK_INT < N")
        true
      }
    ) {

      promise.resolve(false)
    } else {
      promise.resolve(true)
    }
  }

  @ReactMethod
  fun requestPushNotificationPermission(promise : Promise) {
    val notificationManager = reactApplicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

    if (if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
        !notificationManager.areNotificationsEnabled()
      } else {
        // For versions below N, you can't check notification permission programmatically
        // so we assume it's true
        true
      }
    ) {
      // Notifications are not enabled. Open the settings screen where the user can enable them.
      val intent = Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS).apply {
        this.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        putExtra(Settings.EXTRA_APP_PACKAGE, reactApplicationContext.packageName)
      }
      reactApplicationContext.startActivity(intent)
    }
    promise.resolve(true)
  }
 
  @ReactMethod
  fun getInstalledApps(includeSystemApps: Boolean, includeAppIcons: Boolean, onlyAppsWithLaunchIntent: Boolean, promise: Promise) {
    val applicationContext = reactApplicationContext.applicationContext
    val packageManager = applicationContext.getPackageManager()
    val apps = packageManager.getInstalledPackages(0)
    val installedApps = ArrayList<Map<String, Any>>(apps.size)

    for (packageInfo in apps) {
        if (!includeSystemApps && isSystemApp(packageInfo)) {
            continue
        }
        if (onlyAppsWithLaunchIntent && packageManager.getLaunchIntentForPackage(packageInfo.packageName) == null) {
            continue
        }

        val map = getAppData(packageManager, packageInfo, packageInfo.applicationInfo, includeAppIcons)
        installedApps.add(map)
    }

    val installedAppsArray: WritableArray = Arguments.createArray()

    for (map in installedApps) {
      val writableMap = Arguments.createMap()
      for ((key, value) in map) {
        when (value) {
          is String -> writableMap.putString(key, value)
          is Int -> writableMap.putInt(key, value)
          is Boolean -> writableMap.putBoolean(key, value)
          is Double -> writableMap.putDouble(key, value)
          else -> writableMap.putString(key, value.toString())
        }
      }
      installedAppsArray.pushMap(writableMap)
    }

    promise.resolve(installedAppsArray)
  }


  private fun isSystemApp(pInfo: PackageInfo): Boolean {
    return (pInfo.applicationInfo.flags and SYSTEM_APP_MASK) !== 0
  }
  private fun getAppData(
    packageManager: PackageManager,
    pInfo: PackageInfo,
    applicationInfo: ApplicationInfo,
    includeAppIcon: Boolean
): Map<String, Any> {
    return mutableMapOf<String, Any>().apply {
        this[AppDataConstants.APP_NAME] = pInfo.applicationInfo.loadLabel(packageManager).toString()
        this[AppDataConstants.APK_FILE_PATH] = applicationInfo.sourceDir
        this[AppDataConstants.PACKAGE_NAME] = pInfo.packageName
        this[AppDataConstants.VERSION_CODE] = pInfo.versionCode
        this[AppDataConstants.VERSION_NAME] = pInfo.versionName
        this[AppDataConstants.DATA_DIR] = applicationInfo.dataDir
        this[AppDataConstants.SYSTEM_APP] = isSystemApp(pInfo)
        this[AppDataConstants.INSTALL_TIME] = pInfo.firstInstallTime
        this[AppDataConstants.UPDATE_TIME] = pInfo.lastUpdateTime
        this[AppDataConstants.IS_ENABLED] = applicationInfo.enabled

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            this[AppDataConstants.CATEGORY] = pInfo.applicationInfo.category
        }

        if (includeAppIcon) {
            try {
                val icon = packageManager.getApplicationIcon(pInfo.packageName)
                val encodedImage = Base64Utils.encodeToBase64(DrawableUtils.getBitmapFromDrawable(icon), Bitmap.CompressFormat.PNG, 100)
                this[AppDataConstants.APP_ICON] = encodedImage
            } catch (e: PackageManager.NameNotFoundException) {
                // ignored
            }
        }
    }
  }

  companion object {
    const val NAME = "AlphadexScreentime"
  }
}
