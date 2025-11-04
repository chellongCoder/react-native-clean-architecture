package com.alphadexscreentime

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
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

  private fun isServiceRunning(window: Window) {
    val saveAppData: SharedPreferences = getSharedPreferences("save_app_data", MODE_PRIVATE)
    val lockedAppList: List<*> = saveAppData.getString("app_data", "AppList")!!.replace("[", "").replace("]", "").split(",")

    val foregroundApp = getForegroundApp()
    if (foregroundApp != null) {
      for (element in lockedAppList) {
        if (foregroundApp.trim() == element.toString().trim()) {
          if (window.isOpen()) {
            // Already locked
          } else {
            Handler(Looper.getMainLooper()).post { window.open() }
          }
          return
        }
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
}
