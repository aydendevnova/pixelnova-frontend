#include "kmeans_quantization.hpp"
#include <cmath>
#include <algorithm>
#include <limits>

namespace kmeans {

KMeansColorQuantizer::KMeansColorQuantizer(int maxColors, int maxIterations)
    : maxColors(maxColors)
    , maxIterations(maxIterations)
    , rngSeed(1234) // Initial seed
{}

double KMeansColorQuantizer::random() {
    rngSeed = (rngSeed * 9301 + 49297) % 233280;
    return static_cast<double>(rngSeed) / 233280;
}

bool KMeansColorQuantizer::arraysEqual(const std::vector<int>& a1, const std::vector<int>& a2) {
    return a1 == a2; // std::vector already implements comparison
}

std::vector<int> KMeansColorQuantizer::calculateCentroid(const std::vector<std::vector<int>>& cluster) {
    if (cluster.empty() || cluster[0].empty()) {
        return std::vector<int>();
    }

    size_t dimensions = cluster[0].size();
    std::vector<double> centroid(dimensions, 0.0);

    for (size_t i = 0; i < cluster.size(); i++) {
        const auto& point = cluster[i];
        for (size_t j = 0; j < dimensions; j++) {
            centroid[j] += (static_cast<double>(point[j]) - centroid[j]) / static_cast<double>(i + 1);
        }
    }

    std::vector<int> result(dimensions);
    for (size_t i = 0; i < dimensions; i++) {
        result[i] = static_cast<int>(std::round(centroid[i]));
    }
    return result;
}

int KMeansColorQuantizer::nearestNeighbor(const std::vector<int>& point,
                                        const std::vector<std::vector<int>>& neighbors) {
    double bestDist = std::numeric_limits<double>::max();
    int bestIndex = -1;

    for (size_t i = 0; i < neighbors.size(); i++) {
        const auto& neighbor = neighbors[i];
        double dist = 0.0;
        for (size_t j = 0; j < point.size(); j++) {
            double diff = static_cast<double>(point[j] - neighbor[j]);
            dist += diff * diff;
        }
        if (dist < bestDist) {
            bestDist = dist;
            bestIndex = static_cast<int>(i);
        }
    }

    return bestIndex;
}

std::vector<Color> KMeansColorQuantizer::findDominantColors(const Image& image) {
    // Convert image to RGB points
    std::vector<std::vector<int>> dataset;
    dataset.reserve(image.width * image.height);

    for (const auto& pixel : image.pixels) {
        dataset.push_back({
            static_cast<int>(pixel.r),
            static_cast<int>(pixel.g),
            static_cast<int>(pixel.b)
        });
    }

    // Subsample if dataset is too large
    if (dataset.size() > MAX_K_MEANS_PIXELS) {
        int stride = static_cast<int>(std::ceil(static_cast<double>(dataset.size()) / MAX_K_MEANS_PIXELS));
        std::vector<std::vector<int>> sampledDataset;
        sampledDataset.reserve(MAX_K_MEANS_PIXELS);
        
        for (size_t i = 0; i < dataset.size(); i += stride) {
            sampledDataset.push_back(dataset[i]);
        }
        dataset = std::move(sampledDataset);
    }

    // Initialize centroids randomly
    int kk = std::min(maxColors, static_cast<int>(dataset.size()));
    std::vector<std::vector<int>> centroids(kk);
    
    for (int i = 0; i < kk; i++) {
        int idx = static_cast<int>(random() * dataset.size());
        centroids[i] = dataset[idx];
    }

    // K-means iteration
    for (int iteration = 0; iteration < maxIterations; iteration++) {
        std::vector<std::vector<std::vector<int>>> clusters(kk);

        // Assign points to nearest centroid
        for (const auto& point : dataset) {
            int nearestCentroidIndex = nearestNeighbor(point, centroids);
            clusters[nearestCentroidIndex].push_back(point);
        }

        // Update centroids
        bool converged = true;
        for (int i = 0; i < kk; i++) {
            auto& cluster = clusters[i];
            std::vector<int> newCentroid;
            
            if (!cluster.empty()) {
                newCentroid = calculateCentroid(cluster);
            } else {
                int idx = static_cast<int>(random() * dataset.size());
                newCentroid = dataset[idx];
            }

            converged = converged && arraysEqual(newCentroid, centroids[i]);
            centroids[i] = std::move(newCentroid);
        }

        if (converged) {
            break;
        }
    }

    // Convert centroids to Colors
    std::vector<Color> colors;
    colors.reserve(centroids.size());
    
    for (const auto& c : centroids) {
        colors.push_back(Color{
            static_cast<uint8_t>(c[0]),
            static_cast<uint8_t>(c[1]),
            static_cast<uint8_t>(c[2]),
            255
        });
    }

    return colors;
}

Color KMeansColorQuantizer::findClosestColor(const Color& color,
                                           const std::vector<Color>& dominantColors) {
    std::vector<int> c1 = {
        static_cast<int>(color.r),
        static_cast<int>(color.g),
        static_cast<int>(color.b)
    };

    double minDistance = std::numeric_limits<double>::max();
    Color closestColor = dominantColors[0];

    for (const auto& dc : dominantColors) {
        std::vector<int> c2 = {
            static_cast<int>(dc.r),
            static_cast<int>(dc.g),
            static_cast<int>(dc.b)
        };

        double distance = colorDistance(c1, c2);
        if (distance < minDistance) {
            minDistance = distance;
            closestColor = dc;
        }
    }

    return closestColor;
}

double KMeansColorQuantizer::colorDistance(const std::vector<int>& color1,
                                         const std::vector<int>& color2) {
    double distance = 0.0;
    for (size_t i = 0; i < color1.size(); i++) {
        double diff = static_cast<double>(color1[i] - color2[i]);
        distance += diff * diff;
    }
    return distance;
}

} // namespace kmeans 