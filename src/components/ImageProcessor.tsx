import { useImageProcessor } from "../hooks/useImageProcessor";

export function ImageProcessor() {
  const { processImage, isProcessing, error } = useImageProcessor();

  const handleImageProcess = async (image: HTMLImageElement) => {
    // Create canvas to get image data
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    try {
      const processedData = await processImage(imageData, "someOperation");
      // Handle the processed image data
    } catch (err) {
      console.error("Processing failed:", err);
    }
  };

  return (
    <div>
      {isProcessing && <div>Processing image...</div>}
      {error && <div>Error: {error}</div>}
      {/* Your image upload/display UI */}
    </div>
  );
}
