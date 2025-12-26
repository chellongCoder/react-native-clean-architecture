package com.alphadexscreentime

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build

class BootReceiver: BroadcastReceiver() {
  override fun onReceive(context: Context?, intent: Intent?) {
    TODO("Not yet implemented")
    if (intent?.action == Intent.ACTION_BOOT_COMPLETED ||
      intent?.action == Intent.ACTION_LOCKED_BOOT_COMPLETED
    ) {

      // Check if service was running before reboot
      val saveAppData = context?.getSharedPreferences("save_app_data", Context.MODE_PRIVATE)
      val wasServiceRunning = saveAppData?.getString("is_stopped", "0") == "1"
      val isBlocked = saveAppData?.getBoolean("blocked", false)

      if (wasServiceRunning && isBlocked == true) {
        val serviceIntent = Intent(context, ForegroundService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
          context.startForegroundService(serviceIntent)
        } else {
          context.startService(serviceIntent)
        }
      }
    }
  }
}
