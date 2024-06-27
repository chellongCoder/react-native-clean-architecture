package com.alphadexscreentime

import PinCodeActivity
import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.graphics.PixelFormat
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.WindowManager
import android.widget.Button
import android.widget.TextView
import androidx.core.content.ContextCompat
import com.andrognito.pinlockview.IndicatorDots
import com.andrognito.pinlockview.PinLockListener
import com.andrognito.pinlockview.PinLockView

class Window(
  private val context: Context
) {
  private val mView: View
  var pinCode: String = ""
  var txtView: TextView? = null
  var btnUnlock: Button? = null
  var btnClose: Button? = null
  private var mParams: WindowManager.LayoutParams? = null
  private val mWindowManager: WindowManager
  private val layoutInflater: LayoutInflater

  private var mPinLockView: PinLockView? = null
  private var mIndicatorDots: IndicatorDots? = null
  private val mPinLockListener: PinLockListener = object : PinLockListener {

    @SuppressLint("LogConditional")
    override fun onComplete(pin: String) {
      Log.d(PinCodeActivity.TAG, "Pin complete: $pin")
      pinCode = pin
      doneButton()
    }

    override fun onEmpty() {
      Log.d(PinCodeActivity.TAG, "Pin empty")
    }

    @SuppressLint("LogConditional")
    override fun onPinChange(pinLength: Int, intermediatePin: String) {}
  }

  fun open() {
    try {
      if (mView.windowToken == null) {
        if (mView.parent == null) {
          mWindowManager.addView(mView, mParams)
        }
      }
    } catch (e: Exception) {
      e.printStackTrace()
    }
  }

  fun isOpen():Boolean{
    return (mView.windowToken != null && mView.parent != null)
  }

  fun close() {
    try {
      Handler(Looper.getMainLooper()).postDelayed({
        if(mView.isAttachedToWindow) {
          (context.getSystemService(Context.WINDOW_SERVICE) as WindowManager).removeView(mView)
        }
        mView.invalidate()
      },500)

    } catch (e: Exception) {
      e.printStackTrace()
    }
  }

  fun doneButton() {
    try {
      mPinLockView!!.resetPinLockView()
      val saveAppData: SharedPreferences = context.getSharedPreferences("save_app_data", Context.MODE_PRIVATE)
      val dta: String = saveAppData.getString("password", "PASSWORD")!!
      if(pinCode == "000000"){
        println("$pinCode---------------pincode")
        close()
      }else{
        txtView!!.visibility = View.VISIBLE
      }
    } catch (e: Exception) {
      println("$e---------------doneButton")
    }
  }

  init {

    mParams = WindowManager.LayoutParams(
      WindowManager.LayoutParams.MATCH_PARENT,
      WindowManager.LayoutParams.MATCH_PARENT,
      WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
      WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
      PixelFormat.TRANSLUCENT
    )
    layoutInflater = context.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
    mView = layoutInflater.inflate(R.layout.pin_activity, null)

    mParams!!.gravity = Gravity.CENTER
    mWindowManager = context.getSystemService(Context.WINDOW_SERVICE) as WindowManager

    mPinLockView = mView.findViewById(R.id.pin_lock_view)
    mIndicatorDots = mView.findViewById(R.id.indicator_dots)
    txtView = mView.findViewById(R.id.alertError) as TextView
//		btnUnlock = mView.findViewById(R.id.btnUnLock) as Button
		btnClose = mView.findViewById(R.id.btn_close) as Button


    mPinLockView!!.attachIndicatorDots(mIndicatorDots)
    mPinLockView!!.setPinLockListener(mPinLockListener)
    mPinLockView!!.pinLength = 6
    mPinLockView!!.textColor = ContextCompat.getColor(context, R.color.ic_launcher_background)
    mIndicatorDots!!.indicatorType = IndicatorDots.IndicatorType.FILL_WITH_ANIMATION
//		btnUnlock!!.setOnClickListener {
//			 doneButton()
//		}
		btnClose!!.setOnClickListener {
			val intent = Intent(Intent.ACTION_MAIN).apply {
				addCategory(Intent.CATEGORY_HOME)
				flags = Intent.FLAG_ACTIVITY_NEW_TASK
			}
			context.startActivity(intent)
		}

    val saveAppData: SharedPreferences = context.getSharedPreferences("save_app_data", Context.MODE_PRIVATE)
    val dta: String = saveAppData.getString("password", "00000")!!
    pinCode = dta
  }

}
