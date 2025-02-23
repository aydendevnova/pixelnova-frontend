#include <emscripten/bind.h>
#include <emscripten/emscripten.h>
#include <string>
#include <emscripten/val.h>
#include <vector>
#include <ctime>
#include <regex>
#include <memory>
#include <array>
#include "main.hpp"
#include "estimate-grid.hpp"

using namespace emscripten;

// Debug logging function
void debug_log(const std::string& message) {
    val console = val::global("console");
    console.call<void>("log", std::string("[WASM] ") + message);
}

namespace {
    // Internal validation function - matches server implementation exactly
    bool validateRequest(const std::string& userId, int64_t timestamp, const std::string& serverNonce, const std::string& key) {
        // Basic validation
        if (userId.empty() || serverNonce.empty() || key.empty()) {
            debug_log("Empty parameters");
            return false;
        }
        
        // Get current time and validate timestamp
        auto currentTime = std::time(nullptr);
        if (std::abs(currentTime - timestamp) > 30) {
            return false;
        }
        
        // Recreate the key using the exact same logic as the server
        std::string data = userId + ":" + std::to_string(timestamp) + ":" + serverNonce;
        
        int32_t hash = 0;
        for (char c : data) {
            hash = ((hash << 5) - hash) + c;
            hash = hash & hash; // Convert to 32-bit integer
        }
        
        // Convert to hex string, padded to 8 characters
        char hashStr[9];
        snprintf(hashStr, sizeof(hashStr), "%08x", std::abs(hash));
        std::string generatedKey(hashStr);
        
        return key == generatedKey;
    }
}

// Helper function to validate image format and extract base64 data
std::pair<std::string, std::string> parseBase64Image(const std::string& base64Image) {
    debug_log("Parsing base64 image");
    debug_log("Input length: " + std::to_string(base64Image.length()));

    // Since we only use PNGs, we can use a simple string search instead of regex
    const char* PREFIX = "data:image/png;base64,";
    const size_t PREFIX_LEN = 22; // Length of "data:image/png;base64,"
    
    if (base64Image.compare(0, PREFIX_LEN, PREFIX) != 0) {
        debug_log("Error: Not a PNG image");
        throw std::runtime_error("Not a PNG image");
    }
    
    // Avoid string copy by using string_view for the data portion
    std::string_view data_view(base64Image);
    data_view.remove_prefix(PREFIX_LEN);
    
    debug_log("Extracted data length: " + std::to_string(data_view.length()));
    return {"png", std::string(data_view)};
}

// Main processing functions
val downscaleImage(std::string base64Image, int gridSize, 
                  std::string key, std::string userId, 
                  int64_t timestamp, std::string serverNonce) {
    try {
        // Validate request with the key
        if (!validateRequest(userId, timestamp, serverNonce, key)) {
            debug_log("Error: Invalid request validation");
            val error = val::object();
            error.set("error", std::string("Invalid request"));
            return error;
        }
        
        // Parse and validate base64 image
        auto [format, imageData] = parseBase64Image(base64Image);
        
        debug_log("Processing image with gridSize: " + std::to_string(gridSize));
        // Process image with parameters matching Go implementation
        auto result = processImage(imageData, gridSize, 32, true, 32, "kmeans");
        
        debug_log("Image processing completed");
        
        // Return result as JavaScript object
        val resultObj = val::object();
        resultObj.set("results", val::array());
        val results = resultObj["results"];
        
        val item = val::object();
        item.set("image", result.image);
        item.set("grid", result.grid);
        results.call<void>("push", item);
        
        debug_log("Returning result object");
        return resultObj;
    } catch (const std::exception& e) {
        debug_log("Error in downscaleImage: " + std::string(e.what()));
        val error = val::object();
        error.set("error", std::string(e.what()));
        return error;
    }
}

val estimateGridSize(std::string base64Image, std::string key,
                    std::string userId, int64_t timestamp, 
                    std::string serverNonce) {
    try {
        debug_log("Starting estimateGridSize");
        
        // Validate request with the key
        if (!validateRequest(userId, timestamp, serverNonce, key)) {
            debug_log("Error: Invalid request validation");
            val error = val::object();
            error.set("error", std::string("Invalid request"));
            return error;
        }

        // Parse and validate base64 image
        auto [format, imageData] = parseBase64Image(base64Image);
        
        debug_log("Estimating grid size");
        // Estimate grid size
        int gridSize = estimateGridSizeImpl(imageData);
        debug_log("Estimated grid size: " + std::to_string(gridSize));
        
        val result = val::object();
        result.set("gridSize", gridSize);
        return result;
    } catch (const std::exception& e) {
        debug_log("Error in estimateGridSize: " + std::string(e.what()));
        val error = val::object();
        error.set("error", std::string(e.what()));
        return error;
    }
}

// Initialize WASM module
int main() {
    debug_log("Initializing WASM module");
    val global = val::global();
    global.set("wasmInitialized", true);
    debug_log("WASM module initialized successfully");
    return 0;
}

// Bind functions to JavaScript
EMSCRIPTEN_BINDINGS(module) {
    function("downscaleImage", &downscaleImage);
    function("estimateGridSize", &estimateGridSize);
} 