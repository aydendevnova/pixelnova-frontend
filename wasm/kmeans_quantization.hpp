#pragma once

#include "main.hpp"
#include <vector>
#include <cstdint>

namespace kmeans {

constexpr int MAX_K_MEANS_PIXELS = 50000;

class KMeansColorQuantizer {
public:
    KMeansColorQuantizer(int maxColors, int maxIterations);
    
    // Main color quantization functions
    std::vector<Color> findDominantColors(const Image& image);
    Color findClosestColor(const Color& color, const std::vector<Color>& dominantColors);

private:
    int maxColors;
    int maxIterations;
    int64_t rngSeed;

    // Helper functions
    double random();
    bool arraysEqual(const std::vector<int>& a1, const std::vector<int>& a2);
    std::vector<int> calculateCentroid(const std::vector<std::vector<int>>& cluster);
    int nearestNeighbor(const std::vector<int>& point, 
                       const std::vector<std::vector<int>>& neighbors);
    double colorDistance(const std::vector<int>& color1, 
                        const std::vector<int>& color2);
}; 

} // namespace kmeans