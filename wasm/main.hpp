#pragma once

#include <string>
#include <vector>
#include <ctime>
#include <stdexcept>
#include <memory>
#include <cstdint>
#include <emscripten/val.h>

// Basic types and structures
struct Color {
    uint8_t r;
    uint8_t g;
    uint8_t b;
    uint8_t a;

    bool operator==(const Color& other) const {
        return r == other.r && g == other.g && b == other.b && a == other.a;
    }
};

struct ProcessImageResult {
    int grid;
    std::string image;
};

struct Image {
    std::vector<Color> pixels;
    int width;
    int height;
};

// Main WASM-exposed functions
emscripten::val downscaleImage(std::string base64Image, int gridSize, 
                              std::string key, std::string userId, 
                              int64_t timestamp, std::string serverNonce);

emscripten::val estimateGridSize(std::string base64Image, std::string key,
                                std::string userId, int64_t timestamp, 
                                std::string serverNonce);

// Helper functions
std::pair<std::string, std::string> parseBase64Image(const std::string& base64Image);
Image decodeBase64Image(const std::string& base64Data);
std::string encodeImageToBase64(const Image& image);

// Core processing functions
ProcessImageResult processImage(const std::string& base64Image, int gridSize, 
                              int colorTolerance = 32, bool colorQuantization = true, 
                              int maxColors = 32, const std::string& quantizationType = "kmeans");

ProcessImageResult downscaleImageUtil(const Image& img, int grid, 
                                    int colorTolerance, bool colorQuantization,
                                    int maxColors, const std::string& quantizationType);


