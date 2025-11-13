# Add project specific ProGuard rules here.

# ============================================
# R8 Full Mode Configuration
# ============================================
-ignorewarnings
-dontusemixedcaseclassnames
-dontskipnonpubliclibraryclasses
-verbose

# Keep line numbers for debugging
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# ============================================
# React Native Core
# ============================================
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.proguard.** { *; }

# Keep all native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep React Native Bridge methods
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
    @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>;
}

# Keep JSIModule classes
-keep interface com.facebook.react.bridge.JSIModule { *; }
-keep class * implements com.facebook.react.bridge.JSIModule { *; }

# ============================================
# Google Cloud Speech API - CRITICAL FOR AUTHENTICATION
# ============================================
# Keep all Google Cloud Speech classes
-keep class com.google.cloud.speech.** { *; }
-keep interface com.google.cloud.speech.** { *; }
-keepclassmembers class com.google.cloud.speech.** { *; }

# Keep Google API client classes (required for authentication)
-keep class com.google.api.** { *; }
-keep interface com.google.api.** { *; }
-keepclassmembers class com.google.api.** { *; }

# Keep Google Auth classes (CRITICAL - this is where authentication happens)
-keep class com.google.auth.** { *; }
-keep interface com.google.auth.** { *; }
-keepclassmembers class com.google.auth.** { *; }
-keep class com.google.auth.oauth2.** { *; }
-keep class com.google.auth.Credentials { *; }
-keep class com.google.auth.oauth2.GoogleCredentials { *; }
-keep class com.google.auth.oauth2.ServiceAccountCredentials { *; }

# Keep Google API GAX classes (API framework)
-keep class com.google.api.gax.** { *; }
-keep interface com.google.api.gax.** { *; }
-keepclassmembers class com.google.api.gax.** { *; }
-keep class com.google.api.gax.core.** { *; }
-keep class com.google.api.gax.rpc.** { *; }

# Keep Protobuf classes (used for API communication)
-keep class com.google.protobuf.** { *; }
-keep interface com.google.protobuf.** { *; }
-keepclassmembers class com.google.protobuf.** { *; }
-keep class * extends com.google.protobuf.GeneratedMessageV3 { *; }
-keep class * extends com.google.protobuf.GeneratedMessageLite { *; }

# ============================================
# gRPC - CRITICAL FOR API COMMUNICATION
# ============================================
# Keep all gRPC classes
-keep class io.grpc.** { *; }
-keep interface io.grpc.** { *; }
-keepclassmembers class io.grpc.** { *; }

# Keep gRPC internal classes
-keep class io.grpc.internal.** { *; }
-keep class io.grpc.netty.** { *; }
-keep class io.grpc.stub.** { *; }
-keep class io.grpc.okhttp.** { *; }

# Keep gRPC metadata (used for authentication headers)
-keep class io.grpc.Metadata { *; }
-keep class io.grpc.Metadata$Key { *; }
-keepclassmembers class io.grpc.Metadata { *; }

# Keep gRPC channel and call credentials
-keep class io.grpc.CallCredentials { *; }
-keep class io.grpc.CallCredentials$* { *; }
-keep class io.grpc.auth.MoreCallCredentials { *; }

# ============================================
# Netty (used by gRPC)
# ============================================
-keep class io.netty.** { *; }
-keepclassmembers class io.netty.** { *; }
-dontwarn io.netty.**

# ============================================
# Google Common (Guava)
# ============================================
-keep class com.google.common.** { *; }
-keepclassmembers class com.google.common.** { *; }
-dontwarn com.google.common.**

# ============================================
# OpenCensus (used for tracing/monitoring)
# ============================================
-keep class io.opencensus.** { *; }
-dontwarn io.opencensus.**

# ============================================
# Conscrypt (SSL/TLS provider)
# ============================================
-keep class org.conscrypt.** { *; }
-keepclassmembers class org.conscrypt.** { *; }
-dontwarn org.conscrypt.**

# ============================================
# JSON Processing (for credentials parsing)
# ============================================
-keep class com.google.gson.** { *; }
-keep class org.json.** { *; }

# Keep JSON annotations
-keepattributes *Annotation*
-keep class com.google.gson.annotations.** { *; }

# ============================================
# Java Security and Crypto
# ============================================
-keep class javax.crypto.** { *; }
-keep class javax.security.** { *; }
-keep class java.security.** { *; }
-dontwarn javax.crypto.**
-dontwarn javax.security.**

# ============================================
# Reflection (needed by Google Cloud SDK)
# ============================================
-keepattributes Signature
-keepattributes *Annotation*
-keepattributes InnerClasses
-keepattributes EnclosingMethod

# Keep classes that use reflection
-keepclassmembers class * {
    public <init>(...);
}

# Keep all methods that might be called via reflection
-keepclassmembers class * {
    @com.google.api.gax.rpc.ApiCallable *;
}

# ============================================
# React Native Reanimated
# ============================================
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# ============================================
# Fast Image (Glide & Fresco)
# ============================================
-keep public class com.dylanvann.fastimage.* {*;}
-keep public class com.dylanvann.fastimage.** {*;}
-keep public class * implements com.bumptech.glide.module.GlideModule
-keep public class * extends com.bumptech.glide.module.AppGlideModule
-keep public enum com.bumptech.glide.load.ImageHeaderParser$** {
  **[] $VALUES;
  public *;
}

# Fresco
-keep class com.facebook.fresco.** { *; }
-keep class com.facebook.imagepipeline.** { *; }
-keep class com.facebook.animated.** { *; }
-dontwarn com.facebook.fresco.**

# ============================================
# Google Mobile Ads
# ============================================
-keep class com.google.android.gms.ads.** { *; }
-keep class com.google.ads.** { *; }
-keep class com.google.android.gms.common.** { *; }
-dontwarn com.google.android.gms.**

# ============================================
# Firebase & Google Play Services
# ============================================
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**

# Firebase - gRPC and Netty
-dontwarn io.grpc.**
-dontwarn io.netty.**
-dontwarn com.google.common.**
-dontwarn javax.annotation.**
-dontwarn org.codehaus.mojo.animal_sniffer.**

# Firebase - Optional dependencies
-dontwarn org.apache.log4j.**
-dontwarn org.apache.logging.log4j.**
-dontwarn org.slf4j.**
-dontwarn org.eclipse.jetty.alpn.**
-dontwarn org.eclipse.jetty.npn.**
-dontwarn reactor.blockhound.**
-dontwarn sun.security.x509.**
-dontwarn com.google.api.client.**
-dontwarn com.google.protobuf.**

# Conscrypt
-dontwarn org.conscrypt.**
-keep class org.conscrypt.** { *; }

# ============================================
# CodePush
# ============================================
-keep class com.microsoft.codepush.** { *; }
-dontwarn com.microsoft.codepush.**

# ============================================
# React Native IAP
# ============================================
-keep class com.android.vending.billing.** { *; }
-keep class com.android.billingclient.api.** { *; }

# ============================================
# Gson (used by many libraries)
# ============================================
-keepattributes Signature
-keepattributes *Annotation*
-keep class sun.misc.Unsafe { *; }
-keep class com.google.gson.** { *; }
-keep class * implements com.google.gson.TypeAdapter
-keep class * implements com.google.gson.TypeAdapterFactory
-keep class * implements com.google.gson.JsonSerializer
-keep class * implements com.google.gson.JsonDeserializer
-keepclassmembers,allowobfuscation class * {
  @com.google.gson.annotations.SerializedName <fields>;
}

# ============================================
# OkHttp & Retrofit
# ============================================
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn javax.annotation.**
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }
-keep class okio.** { *; }

# ============================================
# Kotlin
# ============================================
-keep class kotlin.** { *; }
-keep class kotlin.Metadata { *; }
-dontwarn kotlin.**
-keepclassmembers class **$WhenMappings {
    <fields>;
}
-keepclassmembers class kotlin.Metadata {
    public <methods>;
}
-assumenosideeffects class kotlin.jvm.internal.Intrinsics {
    static void checkParameterIsNotNull(java.lang.Object, java.lang.String);
}

# ============================================
# AndroidX
# ============================================
-keep class androidx.** { *; }
-dontwarn androidx.**

# ============================================
# General Android
# ============================================
-keepattributes SourceFile,LineNumberTable
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes Exceptions
-keepattributes InnerClasses
-keepattributes EnclosingMethod

# Keep serializable classes
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

-keep class com.wenkesj.voice.VoiceRecorder { *; }
-keep class com.wenkesj.voice.VoiceRecorder$Callback { *; }

# ============================================
# Keep Raw Resources (credentials file)
# ============================================
-keepclassmembers class **.R$* {
    public static <fields>;
}
-keep class **.R$raw { *; }
-keep class **.R { *; }

-keep class com.appsflyer.** { *; } 
-keep class kotlin.jvm.internal.** { *; }

# ============================================
# Warnings to suppress
# ============================================
-dontwarn java.lang.management.**
-dontwarn java.beans.**
-dontwarn javax.lang.model.**
-dontwarn javax.tools.**
-dontwarn org.checkerframework.**
-dontwarn afu.org.checkerframework.**
-dontwarn com.google.errorprone.**
-dontwarn java.lang.instrument.**
-dontwarn sun.misc.**
-dontwarn javax.naming.**
-dontwarn javax.annotation.**
-dontwarn org.codehaus.mojo.animal_sniffer.**
