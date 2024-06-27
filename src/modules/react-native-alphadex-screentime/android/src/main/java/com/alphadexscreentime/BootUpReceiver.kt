package com.alphadexscreentime

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import com.alphadexscreentime.ForegroundService

class BootUpReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent?) {
        val saveAppData: SharedPreferences = context.getSharedPreferences("save_app_data", Context.MODE_PRIVATE)
        if(saveAppData.getString("is_stopped","STOP") =="1"){
            context.startService(Intent(context, ForegroundService::class.java))
        }
    }
}
