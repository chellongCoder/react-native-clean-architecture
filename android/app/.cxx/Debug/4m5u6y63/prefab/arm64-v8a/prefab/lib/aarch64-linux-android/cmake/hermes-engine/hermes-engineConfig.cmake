if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/mac/.gradle/caches/transforms-4/641e4e84c9857c6d3e8fcee57c5ab875/transformed/jetified-hermes-android-0.73.6-debug/prefab/modules/libhermes/libs/android.arm64-v8a/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/mac/.gradle/caches/transforms-4/641e4e84c9857c6d3e8fcee57c5ab875/transformed/jetified-hermes-android-0.73.6-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

