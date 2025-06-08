#!/bin/bash

# Exit on error
set -e

# Check if EMSDK is set
if [ -z "${EMSDK}" ]; then
    echo "Error: EMSDK environment variable is not set"
    echo "Please source the emsdk_env.sh script first:"
    echo "source /path/to/emsdk/emsdk_env.sh"
    exit 1
fi

# Ensure we're in the right directory
cd "$(dirname "$0")"

# Create build directory if it doesn't exist
mkdir -p build
cd build

# Configure with Emscripten
emcmake cmake ..

# Build
emmake make

# Copy the built files to public directory
echo "Copying WebAssembly files to public directory..."
mkdir -p ../../public
cp CppWasm.* ../../public/

# Copy the Emscripten JavaScript support file if needed
if [ -f "${EMSDK}/upstream/emscripten/cache/sysroot/lib/wasm32-emscripten/lib.js" ]; then
    echo "Copying Emscripten support files..."
    cp "${EMSDK}/upstream/emscripten/cache/sysroot/lib/wasm32-emscripten/lib.js" ../../public/
fi

echo "Build complete! Files copied to public directory."