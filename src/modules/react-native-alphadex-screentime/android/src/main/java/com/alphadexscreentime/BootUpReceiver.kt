package com.alphadexscreentime

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.os.SystemClock
import android.util.Log

class BootUpReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent?) {
    Log.d("BootUpReceiver context", "BootUpReceiver received intent: $intent, ${intent?.action}")

    val prefs = context.getSharedPreferences("save_app_data", Context.MODE_PRIVATE)
    val shouldRun = prefs.getString("is_stopped", "0") == "1" && prefs.getBoolean("blocked", false)
    Log.d("BootUpReceiver", "BootUpReceiver triggered. shouldRun=$shouldRun, is_stopped=${prefs.getString("is_stopped", "0")}, blocked=${prefs.getBoolean("blocked", false)}")
    if (!shouldRun) return

    // Tiny delay to avoid early-unlock race conditions
    Thread {
      SystemClock.sleep(1000L)
      val serviceIntent = Intent(context, ForegroundService::class.java)

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        context.startForegroundService(serviceIntent)
      } else {
        context.startService(serviceIntent)
      }
    }.start()
  }
}
