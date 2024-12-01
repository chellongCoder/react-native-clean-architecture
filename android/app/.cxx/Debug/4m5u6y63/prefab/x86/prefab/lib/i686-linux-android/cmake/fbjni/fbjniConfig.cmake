if(NOT TARGET fbjni::fbjni)
add_library(fbjni::fbjni SHARED IMPORTED)
set_target_properties(fbjni::fbjni PROPERTIES
    IMPORTED_LOCATION "/Users/mac/.gradle/caches/transforms-4/94418d5f294e05e107dbb017cdf86589/transformed/jetified-fbjni-0.5.1/prefab/modules/fbjni/libs/android.x86/libfbjni.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/mac/.gradle/caches/transforms-4/94418d5f294e05e107dbb017cdf86589/transformed/jetified-fbjni-0.5.1/prefab/modules/fbjni/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

