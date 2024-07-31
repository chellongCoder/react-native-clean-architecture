package com.alphadexscreentime

import android.Manifest
import android.app.Activity
import android.app.AlertDialog
import android.app.AppOpsManager
import android.app.NotificationManager
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.content.pm.ApplicationInfo
import android.content.pm.PackageInfo
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.os.Build
import android.provider.Settings
import androidx.core.app.ActivityCompat
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableType
import com.facebook.react.bridge.WritableArray
import com.facebook.react.modules.core.PermissionListener


class AlphadexScreentimeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), ActivityEventListener, PermissionListener {
  val SYSTEM_APP_MASK = ApplicationInfo.FLAG_SYSTEM or ApplicationInfo.FLAG_UPDATED_SYSTEM_APP

  private var lockedAppList: List<ApplicationInfo> = emptyList()
  private var saveAppData: SharedPreferences? = null
  private var appInfo: List<ApplicationInfo>? = null


  override fun getName(): String {

    return NAME
  }

  init {
    reactContext.addActivityEventListener(this)
    saveAppData = reactContext.getSharedPreferences("save_app_data", Context.MODE_PRIVATE)
  }


  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  fun multiply(a: Double, b: Double, promise: Promise) {
    promise.resolve(a * b)
  }

  // code to post/handler request for permission
  val REQUEST_CODE: Int = -1010101

  @ReactMethod
  private fun askOverlayPermission(promise: Promise) {
    if (!Settings.canDrawOverlays(reactApplicationContext)) {
      val myIntent = Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION)
      myIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      ActivityCompat.startActivityForResult(reactApplicationContext.currentActivity!!, myIntent, REQUEST_CODE, null)
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
    ActivityCompat.requestPermissions(reactApplicationContext.currentActivity!!, arrayOf(Manifest.permission.POST_NOTIFICATIONS), 1)
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
     // Permission was denied
     val builder = AlertDialog.Builder(reactApplicationContext.currentActivity)
     builder.setTitle("Enable Notifications")
     builder.setMessage("Please enable notifications for better app experience.")
     builder.setPositiveButton("Enable") { dialog, _ ->
       dialog.dismiss()
       val intent = Intent()
       intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)

       intent.action = "android.settings.APP_NOTIFICATION_SETTINGS"

       //for Android 5-7
       intent.putExtra("app_package", reactApplicationContext.packageName)
       intent.putExtra("app_uid", reactApplicationContext.applicationInfo.uid)

       // for Android 8 and above
       intent.putExtra("android.provider.extra.APP_PACKAGE", reactApplicationContext.packageName)

       reactApplicationContext.startActivity(intent)
     }
     builder.setNegativeButton("Cancel") { dialog, _ -> dialog.dismiss() }
     builder.show()
     promise.resolve(true)
  }

  override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<String>, grantResults: IntArray): Boolean {
    when (requestCode) {
      REQUEST_CODE -> {
        if ((grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED)) {
          // Permission was granted
        } else {
          // Permission was denied
          val builder = AlertDialog.Builder(reactApplicationContext.currentActivity)
          builder.setTitle("Enable Notifications")
          builder.setMessage("Please enable notifications for better app experience.")
          builder.setPositiveButton("Enable") { dialog, _ ->
            dialog.dismiss()
            val intent = Intent()
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)

            intent.action = "android.settings.APP_NOTIFICATION_SETTINGS"

            //for Android 5-7
            intent.putExtra("app_package", reactApplicationContext.packageName)
            intent.putExtra("app_uid", reactApplicationContext.applicationInfo.uid)

            // for Android 8 and above
            intent.putExtra("android.provider.extra.APP_PACKAGE", reactApplicationContext.packageName)

            reactApplicationContext.startActivity(intent)
          }
          builder.setNegativeButton("Cancel") { dialog, _ -> dialog.dismiss() }
          builder.show()
        }
        return true
      }

      else -> {
        // Ignore all other requests
        return false
      }
    }
  }


  @ReactMethod
  fun unLockedApps(promise : Promise) {
    setIfServiceClosed("0")
    reactApplicationContext.stopService(Intent(reactApplicationContext, ForegroundService::class.java))
    val editor: SharedPreferences.Editor =  saveAppData!!.edit()
    editor.putBoolean("blocked", false)
    promise.resolve(true)
  }
  @ReactMethod
  fun addToLockedApps(array: ReadableArray, promise : Promise) {
    lockedAppList = emptyList()
//        val mContentView = RemoteViews(packageName, R.layout.list_view)
    val applicationContext = reactApplicationContext.applicationContext
    val packageManager = applicationContext.getPackageManager()
    appInfo  = packageManager.getInstalledApplications(PackageManager.GET_META_DATA)

    val arrayList = ArrayList<Map<String, *>>()

    for (i in 0 until array.size()) {
      when (array.getType(i)) {
        ReadableType.Map -> {
          val readableMap = array.getMap(i)
          val map = readableMap.toHashMap()
          arrayList.add(map)
        }
        else -> {
          // Handle other types if necessary
        }
      }
    }
    val arr : ArrayList<Map<String,*>> = arrayList  as ArrayList<Map<String,*>>

    for (element in arr){
      run breaking@{
        for (i in appInfo!!.indices){
          if(appInfo!![i].packageName.toString() == element["package_name"].toString()){
            val ogList = lockedAppList
            lockedAppList = ogList + appInfo!![i]
            return@breaking
          }
        }
      }
    }


    var packageData:List<String> = emptyList()

    for(element in lockedAppList){
      val ogList = packageData
      packageData = ogList + element.packageName
    }

    val editor: SharedPreferences.Editor =  saveAppData!!.edit()
    editor.remove("app_data")
    editor.putString("app_data", "$packageData")
    editor.putBoolean("blocked", true)
    editor.apply()

    startForegroundService()
  }

  private fun setIfServiceClosed(data:String){
    val editor: SharedPreferences.Editor =  saveAppData!!.edit()
    editor.putString("is_stopped",data)
    editor.apply()
  }

  private fun startForegroundService() {
    if (Settings.canDrawOverlays(reactApplicationContext)) {
      setIfServiceClosed("1")
      val serviceIntent = Intent(reactApplicationContext, ForegroundService::class.java)
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        reactApplicationContext.startForegroundService(serviceIntent)
      } else {
        reactApplicationContext.startService(serviceIntent)
      }
    }
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

  @ReactMethod
  fun getStateBlocking(promise: Promise) {
    val editor: SharedPreferences.Editor =  saveAppData!!.edit()
    val blocked = saveAppData!!.getBoolean("blocked", false)
    promise.resolve(blocked)
  }

  companion object {
    const val NAME = "AlphadexScreentime"
  }


  override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent?) {
    if (requestCode == REQUEST_CODE) {
      // Handle the result here
    }
  }

  override fun onNewIntent(p0: Intent?) {

  }
}
