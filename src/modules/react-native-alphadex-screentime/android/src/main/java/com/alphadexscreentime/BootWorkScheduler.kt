package com.alphadexscreentime

import android.content.Context
import androidx.work.Constraints
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import java.util.concurrent.TimeUnit

object BootWorkScheduler {
  private val UNIQUE_NAME = "boot_repair_work"

  fun schedule(context: Context) {
    val constraints = Constraints.Builder()
      .build()

    val request = PeriodicWorkRequestBuilder<BootRepairWorker>(15, TimeUnit.MINUTES)
      .setConstraints(constraints)
      .build()

    WorkManager.getInstance(context)
      .enqueueUniquePeriodicWork(UNIQUE_NAME, ExistingPeriodicWorkPolicy.UPDATE, request)
  }

  fun cancel(context: Context) {
    WorkManager.getInstance(context).cancelUniqueWork(UNIQUE_NAME)
  }
}
