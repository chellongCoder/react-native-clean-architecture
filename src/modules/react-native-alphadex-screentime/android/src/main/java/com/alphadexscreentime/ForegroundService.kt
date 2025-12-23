package com.alphadexscreentime

import android.app.ActivityManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.app.usage.UsageStatsManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.SharedPreferences
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import androidx.core.app.NotificationCompat
import java.util.Timer
import java.util.TimerTask

class ForegroundService : Service(), Window.HomeButtonListener {
  private var timer: Timer = Timer()
  private var isTimerStarted = false
  private var timerReload: Long = 500
  private var mHomeWatcher = HomeWatcher(this)
  private lateinit var window: Window
  private var lastForegroundApp: String? = null
  private var isFromRecentApps = false
  private var isOwnAppInForeground = false

  /**
    * BroadcastReceiver to detect when user interacts with recent apps
    * or home button, and when own app goes to foreground/background
    * 
   */
  // BroadcastReceiver to detect when user interacts with recent apps
  private val taskChangeReceiver = object : BroadcastReceiver() {
    override fun onReceive(context: Context?, intent: Intent?) {
      when (intent?.action) {
        Intent.ACTION_CLOSE_SYSTEM_DIALOGS -> {
          val reason = intent.getStringExtra("reason")
          if (reason == "recentapps" || reason == "homekey") {
            // User opened recent apps or pressed home
            println("Recent apps or home pressed: $reason")
            if (reason == "recentapps") {
              isFromRecentApps = true
              // Close window if open
              if (window.isOpen()) {
                window.close()
              }
            }
          }
        }
        "$packageName.APP_FOREGROUND" -> {
          isOwnAppInForeground = true
          println("Own app moved to FOREGROUND")
          // Close window when own app comes to foreground
          if (window.isOpen()) {
            Handler(Looper.getMainLooper()).post {
              window.close()
              println("Window closed due to app foreground")
            }
          }
        }
        "$packageName.APP_BACKGROUND" -> {
          isOwnAppInForeground = false
          println("Own app moved to BACKGROUND")
        }
      }
    }
  }

  override fun onBind(intent: Intent): IBinder? {
    throw UnsupportedOperationException("")
  }

  override fun onCreate() {
    super.onCreate()
    window = Window(this)
    createNotificationChannel()
    startForegroundService()
    startMyOwnForeground()
    window.setHomeButtonListener(this)
    registerTaskChangeReceiver()
  }

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    if (intent == null) {
      // Handle the null intent case
      return START_NOT_STICKY
    }
    return super.onStartCommand(intent, flags, startId)
  }

  override fun onDestroy() {
    timer.cancel()
    mHomeWatcher.stopWatch()
    unregisterTaskChangeReceiver()
    super.onDestroy()
  }

  private fun createNotificationChannel() {
    val channelId = "AppLock-10"
    val channel = NotificationChannel(
      channelId,
      "Channel human readable title",
      NotificationManager.IMPORTANCE_DEFAULT
    )
    (getSystemService(NOTIFICATION_SERVICE) as NotificationManager).createNotificationChannel(channel)
  }

  private fun startForegroundService() {
    val channelId = "AppLock-10"
    val notification = NotificationCompat.Builder(this, channelId)
      .setContentTitle("")
      .setContentText("")
      .build()
    startForeground(1, notification)
  }

  private fun startMyOwnForeground() {
    val window = Window(this)
    setupHomeWatcher(window)
    mHomeWatcher.startWatch()
    timerRun(window)
  }

  private fun setupHomeWatcher(window: Window) {
    mHomeWatcher.setOnHomePressedListener(object : HomeWatcher.OnHomePressedListener {
      override fun onHomePressed() {
        handleHomePressed(window)
      }

      override fun onHomeLongPressed() {
        handleHomePressed(window)
      }
    })
  }

  override fun onHomeButtonPressed() {
      handleHomePressed(window)
  }

  private fun handleHomePressed(window: Window) {
    println("Home button pressed")
    if (window.isOpen()) {
      window.close()
    }
  }

  private fun timerRun(window: Window) {
    timer.schedule(object : TimerTask() {
      override fun run() {
        isTimerStarted = true
        isServiceRunning(window)
      }
    }, 0, timerReload)
  }

  /**
    * Check the currently foreground app and lock if necessary
    * @param window The Window instance to manage app locking
    * @return Unit
    * 
   */
  private fun isServiceRunning(window: Window) {
    val saveAppData: SharedPreferences = getSharedPreferences("save_app_data", MODE_PRIVATE)
    val lockedAppList: List<*> = saveAppData.getString("app_data", "AppList")!!.replace("[", "").replace("]", "").split(",")

    val foregroundApp = getForegroundApp()

    // MAIN LOGIC: Detect app switching and trigger lock mechanism
    // This runs every 500ms (timerReload) to continuously monitor which app is in foreground
    
    // CASE 1: App has CHANGED (user switched to a different app)
    if (foregroundApp != null && foregroundApp != lastForegroundApp) {
      
      // SUBCASE 1A: App was opened from RECENT APPS menu
      // This requires special handling because the recent apps dialog needs to close first
      if (isFromRecentApps) {
        println("App opened from recent apps: $foregroundApp")
        isFromRecentApps = false // Reset flag after handling
        
        // Post to main thread to ensure UI operations happen on correct thread
        // This prevents race conditions where window might try to open before recents menu closes
        Handler(Looper.getMainLooper()).post {
          checkAndLockApp(foregroundApp, lockedAppList, window)
        }
      } 
      // SUBCASE 1B: App was opened NORMALLY (not from recents)
      // Direct switch between apps - can check immediately without Handler
      else {
        checkAndLockApp(foregroundApp, lockedAppList, window)
      }
      
      // Update tracking variable to detect future app switches
      lastForegroundApp = foregroundApp
    } 
    // CASE 2: SAME app is still in foreground (no app switch)
    // Continue checking to ensure lock window stays open if app is locked
    // This handles cases where user might try to close the lock window
    else if (foregroundApp != null) {
      checkAndLockApp(foregroundApp, lockedAppList, window)
    }
    // CASE 3: foregroundApp is null (no app detected or error)
    // Do nothing - implicitly handled by not entering either condition
  }

  private fun checkAndLockApp(foregroundApp: String, lockedAppList: List<*>, window: Window) {
    // Check if foreground app is own app package
    if (foregroundApp.trim() == packageName) {
      if (window.isOpen()) {
        println("Own app is in foreground, closing window")
        Handler(Looper.getMainLooper()).post { window.close() }
      }
      return
    }

    for (element in lockedAppList) {
      if (foregroundApp.trim() == element.toString().trim()) {
        if (window.isOpen()) {
          // Already locked
        } else {
          // Set the current locked app before opening window
          window.setCurrentLockedApp(foregroundApp.trim())
          Handler(Looper.getMainLooper()).post { window.open() }
        }
        return
      }
    }
  }

  private fun getForegroundApp(): String? {
    var currentApp: String? = null
    val mUsageStatsManager = getSystemService(USAGE_STATS_SERVICE) as UsageStatsManager
    val time = System.currentTimeMillis()
    // We get usage stats for the last 10 seconds
    val stats = mUsageStatsManager.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, time - 1000 * 10, time)
    // Sort the stats by the last time used
    if (stats != null) {
      val sortedStats = stats.sortedByDescending { it.lastTimeUsed }
      if (sortedStats.isNotEmpty()) {
        currentApp = sortedStats[0].packageName
      }
    }
    return currentApp
  }

  private fun registerTaskChangeReceiver() {
    val filter = IntentFilter()
    filter.addAction(Intent.ACTION_CLOSE_SYSTEM_DIALOGS)
    filter.addAction("$packageName.APP_FOREGROUND")
    filter.addAction("$packageName.APP_BACKGROUND")
    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
      registerReceiver(taskChangeReceiver, filter, Context.RECEIVER_NOT_EXPORTED)
    } else {
      registerReceiver(taskChangeReceiver, filter)
    }
  }

  private fun unregisterTaskChangeReceiver() {
    try {
      unregisterReceiver(taskChangeReceiver)
    } catch (e: Exception) {
      e.printStackTrace()
    }
  }
}
