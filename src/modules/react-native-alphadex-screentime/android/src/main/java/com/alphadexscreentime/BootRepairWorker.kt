package com.alphadexscreentime

import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters

class BootRepairWorker(
  appContext: Context,
  params: WorkerParameters
) : CoroutineWorker(appContext, params) {

  override suspend fun doWork(): Result {
    Log.d("BootRepairWorker", "BootRepairWorker triggered do work.")
    val prefs = applicationContext.getSharedPreferences("save_app_data", Context.MODE_PRIVATE)
    val shouldRun = prefs.getString("is_stopped", "0") == "1" && prefs.getBoolean("blocked", false)
    if (!shouldRun) return Result.success()

    val serviceIntent = Intent(applicationContext, ForegroundService::class.java)
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      applicationContext.startForegroundService(serviceIntent)
    } else {
      applicationContext.startService(serviceIntent)
    }
    return Result.success()
  }
}
