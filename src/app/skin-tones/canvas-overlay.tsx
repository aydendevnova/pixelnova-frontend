import { useEffect, useRef, useState, Dispatch, SetStateAction } from "react";

interface CanvasOverlayProps {
  imageUrl: string;
  onMaskUpdate: Dispatch<SetStateAction<Set<string>>>;
  width: number;
  height: number;
}

export default function CanvasOverlay({
  imageUrl,
  onMaskUpdate,
  width,
  height,
}: CanvasOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(1);
  const maskedPixelsRef = useRef(new Set<string>());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // Set canvas dimensions to match actual image dimensions
    canvas.width = width;
    canvas.height = height;

    // Clear and setup canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw base image
    const img = new Image();
    img.onload = () => {
      ctx.imageSmoothingEnabled = false;

      // Draw at actual pixel size
      ctx.drawImage(img, 0, 0, width, height);
    };
    img.src = imageUrl;
  }, [imageUrl, width, height]);

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const mouseX = Math.floor((e.clientX - rect.left) * scaleX);
    const mouseY = Math.floor((e.clientY - rect.top) * scaleY);

    // Draw visual feedback - now using rectangles for pixel-perfect drawing
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    for (let y = -brushSize + 1; y <= brushSize - 1; y++) {
      for (let x = -brushSize + 1; x <= brushSize - 1; x++) {
        const px = mouseX + x;
        const py = mouseY + y;
        if (px >= 0 && px < width && py >= 0 && py < height) {
          ctx.fillRect(px, py, 1, 1);
          maskedPixelsRef.current.add(`${px},${py}`);
        }
      }
    }

    onMaskUpdate(maskedPixelsRef.current);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    maskedPixelsRef.current.clear();
    onMaskUpdate(maskedPixelsRef.current);

    // Redraw the original image
    const img = new Image();
    img.onload = () => {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, width, height);
    };
    img.src = imageUrl;
  };

  // Calculate aspect ratio and dimensions
  const containerSize = 600;
  const scale = Math.min(containerSize / width, containerSize / height);
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;

  return (
    <div className="relative mx-auto flex h-full max-w-[500px] items-center justify-center">
      <canvas
        ref={canvasRef}
        style={{
          width: `${scaledWidth}px`,
          height: `${scaledHeight}px`,
          imageRendering: "pixelated",
        }}
        className="cursor-crosshair border border-border"
        onClick={draw}
        onMouseDown={(e) => {
          setIsDrawing(true);
          draw(e);
        }}
        onMouseMove={(e) => isDrawing && draw(e)}
        onMouseUp={() => setIsDrawing(false)}
        onMouseLeave={() => setIsDrawing(false)}
      />
      <div className="absolute bottom-2 right-2 flex gap-2 rounded-md bg-background/80 p-2">
        <button
          onClick={clearCanvas}
          className="rounded-md bg-destructive px-2 py-1 text-sm text-destructive-foreground hover:bg-destructive/90"
        >
          Clear
        </button>
        <input
          type="range"
          min="1"
          max="5"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="w-24"
        />
        <span className="text-sm">{brushSize}px</span>
      </div>
    </div>
  );
}
