#include "main.hpp"
#include <algorithm>
#include <cmath>
#include <vector>

namespace {
    // Helper function to calculate absolute difference between two uint8_t values
    uint8_t absDiff(uint8_t a, uint8_t b) {
        return a > b ? a - b : b - a;
    }

    // Convert RGB to grayscale
    uint8_t rgbToGray(uint8_t r, uint8_t g, uint8_t b) {
        return static_cast<uint8_t>((0.299 * r + 0.587 * g + 0.114 * b));
    }
}

int estimateGridSizeImpl(const std::string& base64Image) {
    try {
        // Decode base64 image
        Image img = decodeBase64Image(base64Image);
        
        int width = img.width;
        int height = img.height;

        // Convert to grayscale and get raw pixel data
        std::vector<uint8_t> grayData(width * height);
        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                const Color& pixel = img.pixels[y * width + x];
                grayData[y * width + x] = rgbToGray(pixel.r, pixel.g, pixel.b);
            }
        }

        // Edge detection
        int edgeCount = 0;
        const uint8_t threshold = 24;

        // Iterate through pixels (excluding borders)
        for (int y = 1; y < height - 1; y++) {
            for (int x = 1; x < width - 1; x++) {
                uint8_t up = grayData[(y - 1) * width + x];
                uint8_t down = grayData[(y + 1) * width + x];
                uint8_t left = grayData[y * width + (x - 1)];
                uint8_t right = grayData[y * width + (x + 1)];

                uint8_t verticalGradient = absDiff(up, down);
                uint8_t horizontalGradient = absDiff(left, right);

                if (verticalGradient > threshold || horizontalGradient > threshold) {
                    edgeCount++;
                }
            }
        }

        // Calculate edge density
        double totalPixels = width * height;
        double edgeDensity = static_cast<double>(edgeCount) / totalPixels;

        // Base grid size
        const double baseGridSize = 12.0;

        // Calculate density factor
        double densityFactor = std::pow(edgeDensity * 100, 0.6);

        // Calculate suggested grid size
        double maxDimension = std::max(width, height);
        double suggestedGrid = std::round(
            baseGridSize * 
            (1 + densityFactor) * 
            std::log10(maxDimension / 200)
        );

        // Clamp and double the grid size
        int finalGrid = static_cast<int>(
            std::max(8.0, std::min(512.0, suggestedGrid * 2))
        );

        return finalGrid;

    } catch (const std::exception& e) {
        // In case of any error, return a reasonable default
        return 32;
    }
}

// Structure definitions for the request/response if needed externally
struct EstimateGridRequest {
    std::string image;
};

struct EstimateGridResponse {
    int gridSize;
};
