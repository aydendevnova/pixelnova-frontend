#include "base64.hpp" // Using a C++ base64 library
#include "kmeans_quantization.hpp"
#include "main.hpp"
#include <algorithm>
#include <cmath>
#include <lodepng.h> // Using lodepng for PNG encoding/decoding
#include <vector>

void debug_log(const std::string& message); // Forward declaration

ProcessImageResult downscaleImageUtil(const Image& img, int grid,
                                      int colorTolerance,
                                      bool colorQuantization, int maxColors,
                                      const std::string& quantizationType) {
    int width = img.width;
    int height = img.height;

    debug_log("Input image dimensions: " + std::to_string(width) + "x" +
              std::to_string(height));
    debug_log("Input pixel count: " + std::to_string(img.pixels.size()));

    // Calculate grid dimensions
    int gridWidth = grid;
    int gridHeight = static_cast<int>(
        std::round(static_cast<double>(height) * gridWidth / width));
    double cellWidth = static_cast<double>(width) / gridWidth;
    double cellHeight = static_cast<double>(height) / gridHeight;

    debug_log("Output grid dimensions: " + std::to_string(gridWidth) + "x" +
              std::to_string(gridHeight));
    debug_log("Cell dimensions: " + std::to_string(cellWidth) + "x" +
              std::to_string(cellHeight));

    // Initialize color quantizer only if color quantization is enabled and type
    // is specified
    std::unique_ptr<kmeans::KMeansColorQuantizer> kmeans;
    std::vector<Color> dominantColors;
    if (colorQuantization && !quantizationType.empty() &&
        quantizationType == "kmeans") {
        kmeans = std::make_unique<kmeans::KMeansColorQuantizer>(maxColors, 20);
        dominantColors = kmeans->findDominantColors(img);
        debug_log("Found " + std::to_string(dominantColors.size()) +
                  " dominant colors");
    }

    // Create output image
    Image output;
    output.width = gridWidth;
    output.height = gridHeight;
    output.pixels.resize(gridWidth * gridHeight);

    // Process each cell
    for (int y = 0; y < gridHeight; y++) {
        int startY = static_cast<int>(std::floor(y * cellHeight));
        int endY = static_cast<int>(std::floor((y + 1) * cellHeight));

        for (int x = 0; x < gridWidth; x++) {
            int startX = static_cast<int>(std::floor(x * cellWidth));
            int endX = static_cast<int>(std::floor((x + 1) * cellWidth));

            // Collect colors from cell
            std::vector<uint32_t> rs, gs, bs, as;
            for (int cy = startY; cy < endY; cy++) {
                for (int cx = startX; cx < endX; cx++) {
                    const Color& pixel = img.pixels[cy * width + cx];
                    rs.push_back(pixel.r);
                    gs.push_back(pixel.g);
                    bs.push_back(pixel.b);
                    as.push_back(pixel.a);
                }
            }

            if (rs.empty()) {
                debug_log("Warning: Empty cell at " + std::to_string(x) + "," +
                          std::to_string(y));
                continue;
            }

            // Find median color
            size_t medianIndex = rs.size() / 2;
            std::nth_element(rs.begin(), rs.begin() + medianIndex, rs.end());
            std::nth_element(gs.begin(), gs.begin() + medianIndex, gs.end());
            std::nth_element(bs.begin(), bs.begin() + medianIndex, bs.end());
            std::nth_element(as.begin(), as.begin() + medianIndex, as.end());

            Color medianColor = {static_cast<uint8_t>(rs[medianIndex]),
                                 static_cast<uint8_t>(gs[medianIndex]),
                                 static_cast<uint8_t>(bs[medianIndex]),
                                 static_cast<uint8_t>(as[medianIndex])};

            // Apply color quantization only if enabled and type is specified
            if (colorQuantization && !quantizationType.empty() &&
                !dominantColors.empty() && quantizationType == "kmeans") {
                medianColor =
                    kmeans->findClosestColor(medianColor, dominantColors);
            }

            output.pixels[y * gridWidth + x] = medianColor;
        }
    }

    debug_log("Output image dimensions: " + std::to_string(output.width) + "x" +
              std::to_string(output.height));
    debug_log("Output pixel count: " + std::to_string(output.pixels.size()));

    // Encode output image to base64
    std::string base64Image = encodeImageToBase64(output);
    debug_log("Base64 output length: " + std::to_string(base64Image.length()));

    return ProcessImageResult{grid, "data:image/png;base64," + base64Image};
}

ProcessImageResult processImage(const std::string& base64Image, int gridSize,
                                int colorTolerance, bool colorQuantization,
                                int maxColors,
                                const std::string& quantizationType) {
    // Decode base64 image
    Image img = decodeBase64Image(base64Image);
    debug_log("Decoded input image");

    // Process the image
    return downscaleImageUtil(img, gridSize, colorTolerance, colorQuantization,
                              maxColors, quantizationType);
}

// Helper function implementations for base64 and image encoding/decoding
Image decodeBase64Image(const std::string& base64Data) {
    // Implementation using lodepng and base64 libraries
    std::vector<unsigned char> decodedData = base64::base64_decode(base64Data);
    debug_log("Decoded base64 data size: " +
              std::to_string(decodedData.size()));

    std::vector<unsigned char> pixels;
    unsigned width, height;
    auto error = lodepng::decode(pixels, width, height, decodedData);

    if (error) {
        debug_log("LodePNG decode error: " +
                  std::string(lodepng_error_text(error)));
        throw std::runtime_error("Failed to decode image: " +
                                 std::string(lodepng_error_text(error)));
    }

    debug_log("Decoded image dimensions: " + std::to_string(width) + "x" +
              std::to_string(height));
    debug_log("Decoded pixel data size: " + std::to_string(pixels.size()));

    Image img;
    img.width = width;
    img.height = height;
    img.pixels.resize(width * height);

    for (size_t i = 0; i < pixels.size(); i += 4) {
        Color color = {pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]};
        img.pixels[i / 4] = color;
    }

    return img;
}

std::string encodeImageToBase64(const Image& image) {
    // Convert image to PNG format
    std::vector<unsigned char> png;
    std::vector<unsigned char> pixels;
    pixels.reserve(image.width * image.height * 4);

    debug_log("Encoding image dimensions: " + std::to_string(image.width) +
              "x" + std::to_string(image.height));

    for (const auto& color : image.pixels) {
        pixels.push_back(color.r);
        pixels.push_back(color.g);
        pixels.push_back(color.b);
        pixels.push_back(color.a);
    }

    debug_log("Raw pixel data size: " + std::to_string(pixels.size()));

    auto error = lodepng::encode(png, pixels, image.width, image.height);
    if (error) {
        debug_log("LodePNG encode error: " +
                  std::string(lodepng_error_text(error)));
        throw std::runtime_error("Failed to encode image: " +
                                 std::string(lodepng_error_text(error)));
    }

    debug_log("Encoded PNG size: " + std::to_string(png.size()));

    // Convert to base64
    auto base64 = base64::base64_encode(png.data(), png.size());
    debug_log("Final base64 size: " + std::to_string(base64.length()));

    return base64;
}
