cmake_minimum_required(VERSION 3.10)
project(CppWasm)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Emscripten specific settings
set(CMAKE_EXECUTABLE_SUFFIX ".js")

# Add source files
set(SOURCES
    main.cpp
    downscale-image.cpp
    estimate-grid.cpp
    kmeans_quantization.cpp
    lodepng.cpp
    base64.cpp
)

# Create WebAssembly module
add_executable(${PROJECT_NAME} ${SOURCES})

# Include directories
target_include_directories(${PROJECT_NAME} PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}
)

# Emscripten link flags
set_target_properties(${PROJECT_NAME} PROPERTIES
    LINK_FLAGS "\
    -s WASM=1 \
    -s EXPORTED_RUNTIME_METHODS=['ccall','cwrap'] \
    -s EXPORTED_FUNCTIONS=['_malloc','_free'] \
    -s ALLOW_MEMORY_GROWTH=1 \
    -s MODULARIZE=1 \
    -s EXPORT_NAME='createCppWasmModule' \
    --bind \
    -msimd128 \
    -O3"
) 