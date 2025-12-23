package com.alphadex.tbd.app

import android.app.Application
import android.content.res.Configuration
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleObserver
import androidx.lifecycle.OnLifecycleEvent
import androidx.lifecycle.ProcessLifecycleOwner
import com.alphadexscreentime.ViewModulePackage
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader
import expo.modules.ApplicationLifecycleDispatcher
import expo.modules.ReactNativeHostWrapper
import com.microsoft.codepush.react.CodePush
import android.util.Log

class MainApplication : Application(), ReactApplication, LifecycleObserver {

  companion object {
    private const val TAG = "MainApplication"
    var isAppInForeground = false
    private set
  }

  override val reactNativeHost: ReactNativeHost =
      ReactNativeHostWrapper(this, object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              // Packages that cannot be autolinked yet can be added manually here, for example:
              // add(MyReactNativePackage())
              add(ViewModulePackage())
            }

        override fun getJSMainModuleName(): String = "index"


        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED

        override fun getJSBundleFile(): String? {
          return CodePush.getJSBundleFile()
        }
      })

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    SoLoader.init(this, false)
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      load()
    }
    ApplicationLifecycleDispatcher.onApplicationCreate(this)

    // Register lifecycle observer to detect foreground/background changes
    ProcessLifecycleOwner.get().lifecycle.addObserver(this)
  }

  @OnLifecycleEvent(Lifecycle.Event.ON_START)
  fun onAppForegrounded() {
    isAppInForeground = true
    Log.d(TAG, "App moved to FOREGROUND")
    // Notify that app is in foreground
    sendBroadcast(android.content.Intent("$packageName.APP_FOREGROUND"))
  }

  @OnLifecycleEvent(Lifecycle.Event.ON_STOP)
  fun onAppBackgrounded() {
    isAppInForeground = false
    Log.d(TAG, "App moved to BACKGROUND")
    // Notify that app is in background
    sendBroadcast(android.content.Intent("$packageName.APP_BACKGROUND"))
  }

   override fun onConfigurationChanged(newConfig: Configuration) {
    super.onConfigurationChanged(newConfig)
    ApplicationLifecycleDispatcher.onConfigurationChanged(this, newConfig)
  }

}
