export interface PixelNovaModule {
  downscaleImage: (
    base64Image: string,
    gridSize: number,
    key: string,
    userId: string,
    timestamp: number,
    serverNonce: string
  ) => Promise<{
    results: Array<{
      image: string;
      grid: number;
    }>;
    error?: string;
  }>;
  estimateGridSize: (
    base64Image: string,
    key: string,
    userId: string,
    timestamp: number,
    serverNonce: string
  ) => Promise<{
    gridSize: number;
    error?: string;
  }>;
} 