package com.alphadexscreentime

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.app.usage.UsageEvents
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
  private var currentAppActivityList = arrayListOf<String>()
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
    (getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager).createNotificationChannel(channel)
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
    currentAppActivityList.clear()
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
    val saveAppData: SharedPreferences = this.getSharedPreferences("save_app_data", Context.MODE_PRIVATE)
    val lockedAppList: List<*> = saveAppData.getString("app_data", "AppList")!!.replace("[", "").replace("]", "").split(",")

    val mUsageStatsManager = getSystemService(USAGE_STATS_SERVICE) as UsageStatsManager
    val time = System.currentTimeMillis()
    val usageEvents = mUsageStatsManager.queryEvents(time - timerReload, time)
    val event = UsageEvents.Event()

    run breaking@{
      while (usageEvents.hasNextEvent()) {
        usageEvents.getNextEvent(event)
        for (element in lockedAppList) {
          if (event.packageName.toString().trim() == element.toString().trim()) {
            handleUsageEvent(event, window)
            return@breaking
          }
        }
      }
    }
  }

  private fun handleUsageEvent(event: UsageEvents.Event, window: Window) {
    when (event.eventType) {
      UsageEvents.Event.ACTIVITY_RESUMED -> {
        if (currentAppActivityList.isEmpty()) {
          currentAppActivityList.add(event.className)
          println("$currentAppActivityList-----List--added")
          Handler(Looper.getMainLooper()).post { window.open() }
        } else if (!currentAppActivityList.contains(event.className)) {
          currentAppActivityList.add(event.className)
          println("$currentAppActivityList-----List--added")
        }
      }
//      UsageEvents.Event.ACTIVITY_PAUSED -> {
//        if (currentAppActivityList.isEmpty()) {
//          currentAppActivityList.add(event.className)
//          println("$currentAppActivityList-----List--added")
//          Handler(Looper.getMainLooper()).post { window.open() }
//        } else if (!currentAppActivityList.contains(event.className)) {
//          currentAppActivityList.add(event.className)
//          println("$currentAppActivityList-----List--added")
//        }
//      }
      UsageEvents.Event.ACTIVITY_STOPPED -> {
        if (currentAppActivityList.contains(event.className)) {
          currentAppActivityList.remove(event.className)
          println("$currentAppActivityList-----List--remained")
        }
      }
    }
  }
}
