'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import type { ChangeEvent } from 'react';
import { estimateGridSize, downscaleImage } from './wasm-loader';

// Helper function to convert any image to PNG format
const convertToPng = async (imageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
};

export default function CppFrontPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [gridSize, setGridSize] = useState<number>(32);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [estimating, setEstimating] = useState(false);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  // Handle file selection
  const handleFileSelect = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        try {
          // Convert to PNG format
          const pngImage = await convertToPng(result);
          setSelectedImage(pngImage);
          setProcessedImage(null);
          setError(null);
          
          // Get original image dimensions
          const img = new Image();
          img.onload = () => {
            setDimensions({ width: img.width, height: img.height });
          };
          img.src = pngImage;
        } catch (err) {
          setError('Failed to convert image format');
          console.error('Image conversion error:', err);
        }
      }
    };
    reader.readAsDataURL(file);
  }, []);

  // Estimate grid size
  const handleEstimateGridSize = useCallback(async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setEstimating(true);
    setError(null);

    try {
      const mockUserId = "test-user";
      const mockKey = "test-key";
      const timestamp = Math.floor(Date.now() / 1000);
      const mockServerNonce = "test-nonce";

      const result = await estimateGridSize(
        selectedImage,
        mockKey,
        mockUserId,
        timestamp,
        mockServerNonce
      );

      setGridSize(result.gridSize);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to estimate grid size');
      console.error('Estimation error:', err);
    } finally {
      setEstimating(false);
    }
  }, [selectedImage]);

  // Process image
  const processImage = useCallback(async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Mock values for testing - in production these would come from your auth system
      const mockUserId = "test-user";
      const mockKey = "test-key";
      const timestamp = Math.floor(Date.now() / 1000);
      const mockServerNonce = "test-nonce";

      // Process the image
      const result = await downscaleImage(
        selectedImage,
        gridSize,
        mockKey,
        mockUserId,
        timestamp,
        mockServerNonce
      );

      if (!result.results?.[0]?.image) {
        throw new Error('No processed image received');
      }

      console.log("Processed image data:", {
        resultLength: result.results[0].image.length,
        startsWith: result.results[0].image.substring(0, 30),
        isBase64: result.results[0].image.startsWith('data:image/')
      });

      setProcessedImage(result.results[0].image);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image');
      console.error('Processing error:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedImage, gridSize]);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">PixelNova C++ Image Processor</h1>

      <Card className="p-6 space-y-6">
        <div className="flex gap-4">
          <div className="space-y-2 flex-1">
            <Label htmlFor="image-upload">Select Image</Label>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="w-full"
            />
            <p className="text-sm text-gray-500">
              Supports PNG, JPEG, WebP, and other common image formats
            </p>
          </div>

          <div className="space-y-2 w-64">
            <Label htmlFor="grid-size">Grid Size</Label>
            <div className="flex gap-2">
              <Input
                id="grid-size"
                type="number"
                value={gridSize}
                onChange={(e) => setGridSize(Number(e.target.value))}
                min={8}
                max={512}
                className="flex-1"
              />
              <Button
                onClick={handleEstimateGridSize}
                disabled={!selectedImage || estimating}
                variant="outline"
                className="whitespace-nowrap"
              >
                {estimating ? 'Estimating...' : 'Estimate'}
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Grid size determines the pixel art resolution
            </p>
          </div>
        </div>
      

        <Button
          onClick={processImage}
          disabled={!selectedImage || loading}
          className="w-full"
        >
          {loading ? 'Processing...' : 'Process Image'}
        </Button>

        {error && (
          <div className="text-red-500 text-sm mt-2">{error}</div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {selectedImage && (
            <div>
              <h3 className="font-semibold mb-2">Original Image</h3>
              <div className="relative border rounded-lg overflow-hidden">
                <img
                  src={selectedImage}
                  alt="Original"
                  className="w-full h-auto"
                  style={{
                    imageRendering: 'auto',
                    maxWidth: '100%'
                  }}
                />
                {dimensions && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 text-xs rounded">
                    {dimensions.width} × {dimensions.height}
                  </div>
                )}
              </div>
            </div>
          )}
          {processedImage && (
            <div>
              <h3 className="font-semibold mb-2">Processed Image</h3>
              <div className="relative border rounded-lg overflow-hidden">
                <img
                  src={processedImage}
                  alt="Processed"
                  className="w-full h-auto"
                  style={{
                    imageRendering: 'pixelated',
                    maxWidth: '100%'
                  }}
                />
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 text-xs rounded">
                  {gridSize} × {Math.round(gridSize * (dimensions?.height ?? 1) / (dimensions?.width ?? 1))}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
