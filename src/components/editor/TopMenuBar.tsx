"use client";

import { useCallback } from "react";
import {
  FolderOpenIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  SwatchIcon,
} from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/input";
import { Grid2X2 } from "lucide-react";
import ApiTestDialog from "../modals/api-modal";
import AiPixelArtModal from "../modals/ai-pixel-art";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface TopMenuBarProps {
  onClearCanvas: () => void;
  onImportImage: (imageData: ImageData) => void;
  onGeneratePalette: (colors: string[]) => void;
  selectedTool: string;
  bucketTolerance: number;
  onBucketToleranceChange: (value: number) => void;
  brushSize: number;
  onBrushSizeChange: (value: number) => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  layers: any[];
}

export default function TopMenuBar({
  onClearCanvas,
  onImportImage,
  onGeneratePalette,
  selectedTool,
  bucketTolerance,
  onBucketToleranceChange,
  brushSize,
  onBrushSizeChange,
  showGrid,
  onToggleGrid,
  layers,
}: TopMenuBarProps) {
  const handleToleranceChange = (value: string) => {
    const numValue = Math.max(1, Math.min(10, Number(value) || 1));
    onBucketToleranceChange(numValue);
  };

  const handleBrushSizeChange = (value: string) => {
    const numValue = Math.max(1, Math.min(32, Number(value) || 1));
    onBrushSizeChange(numValue);
  };

  // Function to handle file import
  const handleFileImport = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          onImportImage(imageData);

          // Reset and generate new color palette from the image
          const colors = extractColors(imageData);
          onGeneratePalette(colors);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    },
    [onImportImage, onGeneratePalette],
  );

  // Function to handle file export
  const handleExport = useCallback(async () => {
    const zip = new JSZip();

    // Get the drawing canvas
    const drawingCanvas = document.querySelector(
      'canvas[data-canvas="drawing"]',
    ) as HTMLCanvasElement | null;

    if (!drawingCanvas) {
      console.error("Drawing canvas not found");
      return;
    }

    try {
      // Export each layer individually
      layers.forEach((layer, index) => {
        if (!layer.imageData) return;

        // Create a temporary canvas for this layer
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = drawingCanvas.width;
        tempCanvas.height = drawingCanvas.height;
        const tempCtx = tempCanvas.getContext("2d", {
          willReadFrequently: true,
        });

        if (tempCtx) {
          // Set composite operation to ensure proper transparency
          tempCtx.globalCompositeOperation = "source-over";

          // Only export if layer is visible
          if (layer.visible) {
            tempCtx.putImageData(layer.imageData, 0, 0);

            // Convert to base64 and add to zip
            const imageData = tempCanvas.toDataURL("image/png");
            if (!imageData) {
              console.error("Image data not found");
              return;
            }
            zip.file(`${layer.name}.png`, imageData.split(",")[1]!, {
              base64: true,
            });
          }
        }
      });

      // For combined image, create a new canvas and compose all visible layers
      const combinedCanvas = document.createElement("canvas");
      combinedCanvas.width = drawingCanvas.width;
      combinedCanvas.height = drawingCanvas.height;
      const combinedCtx = combinedCanvas.getContext("2d", {
        willReadFrequently: true,
      });

      if (combinedCtx) {
        // Draw all visible layers in order
        layers.forEach((layer) => {
          if (layer.visible && layer.imageData) {
            const layerCanvas = document.createElement("canvas");
            layerCanvas.width = drawingCanvas.width;
            layerCanvas.height = drawingCanvas.height;
            const layerCtx = layerCanvas.getContext("2d");

            if (layerCtx) {
              layerCtx.putImageData(layer.imageData, 0, 0);
              combinedCtx.drawImage(layerCanvas, 0, 0);
            }
          }
        });

        const combinedImageData = combinedCanvas.toDataURL("image/png");
        if (!combinedImageData) {
          console.error("Combined image data not found");
          return;
        }
        zip.file("combined_image.png", combinedImageData.split(",")[1]!, {
          base64: true,
        });
      }

      // Generate and save zip file
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `pixel_art_layers_${Date.now()}.zip`);
    } catch (error) {
      console.error("Export failed:", error);
    }
  }, [layers]);

  // Function to extract unique colors from image data
  const extractColors = useCallback((imageData: ImageData) => {
    const colorSet = new Set<string>();
    const { data } = imageData;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // Skip fully transparent pixels
      if (a === 0) continue;

      // Convert to hex color
      const color = `#${(
        (1 << 24) +
        ((r ?? 0) << 16) +
        ((g ?? 0) << 8) +
        (b ?? 0)
      )
        .toString(16)
        .slice(1)
        .toUpperCase()}`;
      colorSet.add(color);
    }

    return Array.from(colorSet);
  }, []);

  return (
    <div className="z-10 flex h-[54px] items-center gap-2 border-b border-gray-700 bg-gray-800 px-4 py-2">
      {/* File Import */}
      <div className="group relative hover:cursor-pointer">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileImport}
          className="absolute inset-0 z-10 cursor-pointer opacity-0"
        />
        <button className="flex cursor-pointer items-center gap-2 rounded bg-blue-500 px-3 py-1.5 text-sm text-white transition-colors duration-200 group-hover:cursor-pointer group-hover:bg-blue-600">
          <FolderOpenIcon className="h-4 w-4" />
          Open
        </button>
      </div>

      {/* Export Button */}
      <button
        onClick={handleExport}
        className="flex items-center gap-2 rounded bg-green-500 px-3 py-1.5 text-sm text-white hover:bg-green-600"
      >
        <ArrowDownTrayIcon className="h-4 w-4" />
        Export
      </button>

      {/* Clear Canvas Button */}
      <button
        onClick={onClearCanvas}
        className="flex items-center gap-2 rounded bg-red-500 px-3 py-1.5 text-sm text-white hover:bg-red-600"
      >
        <TrashIcon className="h-4 w-4" />
        Clear
      </button>

      {/* Generate Palette Button */}
      {/* Hiding for now as it is done automatically */}
      {/* <button
        onClick={() => {
          const canvas = document.querySelector(
            "canvas[data-canvas='drawing']",
          ) as HTMLCanvasElement;
          if (!canvas) return;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const colors = extractColors(imageData);

          const usedColors = colors.filter(
            (color) => color !== "#FFFFFF" && color !== "#000000",
          );
          onGeneratePalette(usedColors);
        }}
        className="flex items-center gap-2 rounded bg-purple-500 px-3 py-1.5 text-sm text-white hover:bg-purple-600"
      >
        <SwatchIcon className="h-4 w-4" />
        Generate Palette
      </button> */}

      {/* Show brush size input for pencil and eraser */}
      {(selectedTool === "pencil" || selectedTool === "eraser") && (
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-400">Size:</label>
          <Input
            type="number"
            min={1}
            max={32}
            value={brushSize}
            onChange={(e) => handleBrushSizeChange(e.target.value)}
            className="w-20 bg-gray-700 text-white"
          />
        </div>
      )}

      {/* Show tolerance input only when bucket tool is selected */}
      {selectedTool === "bucket" && (
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-400">Tolerance:</label>
          <Input
            type="number"
            min={1}
            max={10}
            value={bucketTolerance}
            onChange={(e) => handleToleranceChange(e.target.value)}
            className="w-20 bg-gray-700 text-white"
          />
        </div>
      )}

      {/* Add grid toggle button */}
      <button
        onClick={onToggleGrid}
        className={`flex items-center gap-1 rounded px-2 py-1 text-sm ${
          showGrid ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"
        }`}
        title="Toggle Grid"
      >
        <Grid2X2 className="h-4 w-4" />
      </button>
      <AiPixelArtModal
        onFinish={(img) => {
          const image = new Image();
          image.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            ctx.drawImage(image, 0, 0);
            const imageData = ctx.getImageData(
              0,
              0,
              canvas.width,
              canvas.height,
            );
            onImportImage(imageData);

            // Generate new color palette from the image
            const colors = extractColors(imageData);
            onGeneratePalette(colors);
          };
          image.src = img;
        }}
      />
      {/* <ApiTestDialog /> */}
    </div>
  );
}
