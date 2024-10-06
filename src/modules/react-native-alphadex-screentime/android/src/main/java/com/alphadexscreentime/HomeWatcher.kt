package com.alphadexscreentime

import android.accessibilityservice.AccessibilityService
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.Intent.ACTION_CLOSE_SYSTEM_DIALOGS
import android.content.IntentFilter
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import androidx.core.content.ContextCompat

class HomeWatcher(private val mContext: Context) {
  private val mFilter = IntentFilter(ACTION_CLOSE_SYSTEM_DIALOGS)
  private var mListener: OnHomePressedListener? = null
  private var mReceiver: InnerReceiver? = null

  fun setOnHomePressedListener(listener: OnHomePressedListener?) {
    mListener = listener
     mReceiver = InnerReceiver()
  }

  inner class HomeWatcherAccessibilityService : AccessibilityService() {
      override fun onAccessibilityEvent(event: AccessibilityEvent) {
          if (event.eventType == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
              if (event.packageName != mContext.packageName) {
                  Log.d(TAG, "Window State Changed: ${event.packageName}")
                  mListener?.onHomePressed()
              }
          }
      }

      override fun onInterrupt() {
          // Handle interruptions here
      }
  }

   fun startWatch() {
     mReceiver?.let {
       ContextCompat.registerReceiver(
         mContext,
         it,
         mFilter,
         ContextCompat.RECEIVER_NOT_EXPORTED
       )
     }
   }

   fun stopWatch() {
     mReceiver?.let {
       mContext.unregisterReceiver(it)
     }
   }

  interface OnHomePressedListener {
    fun onHomePressed()
    fun onHomeLongPressed()
  }

   inner class InnerReceiver : BroadcastReceiver() {
     override fun onReceive(context: Context, intent: Intent) {
       intent.getStringExtra(SYSTEM_DIALOG_REASON_KEY)?.let { reason ->
         Log.e(TAG, "action: ${intent.action}, reason: $reason")
         when (reason) {
           SYSTEM_DIALOG_REASON_HOME_KEY -> mListener?.onHomePressed()
           SYSTEM_DIALOG_REASON_RECENT_APPS -> mListener?.onHomeLongPressed()
           else -> {}
         }
       }
     }
   }

  companion object {
    private const val TAG = "HomeWatcher"
    private const val SYSTEM_DIALOG_REASON_KEY = "reason"
    private const val SYSTEM_DIALOG_REASON_RECENT_APPS = "recentapps"
    private const val SYSTEM_DIALOG_REASON_HOME_KEY = "homekey"
  }
}
