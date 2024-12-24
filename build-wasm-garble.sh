#!/bin/bash

# Create directories if they don't exist
mkdir -p public

cd wasm

# Set Go environment variables for WebAssembly compilation
export GOOS=js
export GOARCH=wasm

# Get GOPATH and ensure garble is installed
GOPATH=$(go env GOPATH)
GARBLE_PATH="$GOPATH/bin/garble"

# Check if garble exists, if not install it
if [ ! -f "$GARBLE_PATH" ]; then
    echo "Installing garble..."
    go install mvdan.cc/garble@latest
fi

# Add GOPATH/bin to PATH temporarily
export PATH="$GOPATH/bin:$PATH"

# Build the WebAssembly module using garble with full path
echo "Building WebAssembly module with garble..."
"$GARBLE_PATH" -seed=random -tiny -literals build -o ../public/main.wasm

# Copy the WebAssembly support JavaScript file
echo "Copying WebAssembly support files..."
cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" ../public/

echo "Build complete! Check the public directory for main.wasm and wasm_exec.js"