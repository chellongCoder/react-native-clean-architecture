# Log - Thay đổi project

## 2026-03-17

### 1. CodePush: Sửa crash "Error in getting binary resources modified time" trên bản release (Samsung A73 5G và thiết bị khác)

**Nguyên nhân:** Với Android Gradle Plugin (AGP) 4.2+, resource `CODE_PUSH_APK_BUILD_TIME` đôi khi không được tạo đúng thời điểm khi chỉ khai báo trong `defaultConfig`, dẫn tới `Resources$NotFoundException` (resource ID #0x0) khi CodePush gọi `getBinaryResourcesModifiedTime()` → crash khi mở app release.

**Thay đổi:**

1. **android/app/build.gradle**
   - Thêm block `android.buildTypes.each { ... }` sau block `android { }` để gán `resValue "string", "CODE_PUSH_APK_BUILD_TIME"` cho **từng** buildType (debug, release). Cách này đảm bảo resource được tạo ở evaluation time cho mọi variant (kể cả khi dùng productFlavors dev/prod), khắc phục lỗi trên AGP 4.2+.

2. **android/app/src/main/java/com/algorz/abeeci/app/MainApplication.kt**
   - Trong `getJSBundleFile()`, đổi `catch (e: Exception)` thành `catch (e: Throwable)` để bắt mọi lỗi từ CodePush và fallback về bundle mặc định (tránh crash trên thiết bị cũ hoặc edge case).

---

### 2. Sửa lỗi OutOfMemoryError khi build release (`:app:mergeDexProdRelease FAILED`)

**Nguyên nhau:** JVM heap space không đủ khi merge DEX trong bản release (đặc biệt khi build với nhiều ABI architectures).

**Thay đổi:**

- **android/gradle.properties**
  - Tăng JVM heap size từ `-Xmx2048m` lên `-Xmx4096m`
  - Tăng MaxMetaspaceSize từ `-XX:MaxMetaspaceSize=512m` lên `-XX:MaxMetaspaceSize=1024m`
  - Thêm `-XX:+HeapDumpOnOutOfMemoryError` để debug nếu cần
  - Thêm `-Dfile.encoding=UTF-8` để tránh encoding issues

**Sau khi sửa:** Chạy lại `./gradlew clean` rồi build lại.
