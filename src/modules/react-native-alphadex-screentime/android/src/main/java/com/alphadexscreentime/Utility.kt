package com.alphadexscreentime

import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.util.Base64
import java.io.ByteArrayOutputStream


object Utility {
  fun convert(drawable: Drawable): String {
    try {
      return convert(drawableToBitmap(drawable))
    } catch (e: Exception) {
      e.printStackTrace()
    }
    return ""
  }

  fun convert(bitmap: Bitmap): String {
    val outputStream = ByteArrayOutputStream()
    bitmap.compress(Bitmap.CompressFormat.PNG, 100, outputStream)

    return Base64.encodeToString(outputStream.toByteArray(), Base64.DEFAULT)
  }

  fun drawableToBitmap(drawable: Drawable): Bitmap {
    var bitmap: Bitmap? = null

    if (drawable is BitmapDrawable) {
      val bitmapDrawable = drawable
      if (bitmapDrawable.bitmap != null) {
        return bitmapDrawable.bitmap
      }
    }

    bitmap = if (drawable.intrinsicWidth == 0 || drawable.intrinsicHeight == 0) {
      Bitmap.createBitmap(
        1,
        1,
        Bitmap.Config.ARGB_8888
      ) // Single color bitmap will be created of 1x1
      // pixel
    } else {
      Bitmap.createBitmap(
        drawable.intrinsicWidth, drawable.intrinsicHeight,
        Bitmap.Config.ARGB_8888
      )
    }

    val canvas = Canvas(bitmap)
    drawable.setBounds(0, 0, canvas.width, canvas.height)
    drawable.draw(canvas)
    return bitmap
  }
}
