"use client";

import { useCallback, useEffect, useState } from "react";
import {
  FolderOpenIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  SwatchIcon,
} from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/input";
import { Grid2X2, Menu } from "lucide-react";
import ApiTestDialog from "../modals/api-modal";
import AiPixelArtModal from "../modals/ai-pixel-art";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Layer, ToolType } from "@/types/editor";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useEditorStore } from "@/store/editorStore";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TopMenuBarProps {
  onClearCanvas: () => void;
  onImportImage: (imageData: ImageData) => void;
  onGeneratePalette: (colors: string[]) => void;
  selectedTool: ToolType;
  SelectedToolIcon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  bucketTolerance: number;
  onBucketToleranceChange: (value: number) => void;
  brushSize: number;
  onBrushSizeChange: (value: number) => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  layers: Layer[];
}

export default function TopMenuBar({
  onClearCanvas,
  onImportImage,
  onGeneratePalette,
  selectedTool,
  SelectedToolIcon,
  bucketTolerance,
  onBucketToleranceChange,
  brushSize,
  onBrushSizeChange,
  showGrid,
  onToggleGrid,
  layers,
}: TopMenuBarProps) {
  const { shouldClearOriginal, setShouldClearOriginal } = useEditorStore();

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

  const [alertOpen, setAlertOpen] = useState(false);

  // Thanks Radix UI for your garbage cleanup in your Dialogs
  useEffect(() => {
    if (!alertOpen) {
      // Remove the Radix UI class and pointer-events style
      document.body.classList.remove(
        "radix-themes-custom-disable-pointer-events",
      );
      document.body.style.removeProperty("pointer-events");

      // Force enable pointer events
      document.body.style.pointerEvents = "auto";
    }

    // Cleanup function
    return () => {
      document.body.style.pointerEvents = "auto";
    };
  }, [alertOpen]);

  return (
    <div className="z-10 flex flex-col border-b border-gray-700 bg-gray-800">
      {/* Top row with main controls */}
      <div className="flex h-[64px] items-center gap-4 px-4 py-2">
        {/* File Menu Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 hover:bg-gray-700"
            >
              <Menu className="h-4 w-4 text-white " />
              <span className="text-white">File</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem
              className="gap-2 bg-white"
              onSelect={() => document.getElementById("file-input")?.click()}
            >
              <FolderOpenIcon className="h-4 w-4 text-black" />
              <span className="text-black">Open</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="my-2 gap-2 " onSelect={handleExport}>
              <ArrowDownTrayIcon className="h-4 w-4 text-black" />
              <span className="text-black">Export</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2"
              onSelect={() => setAlertOpen(true)}
            >
              <TrashIcon className="h-4 w-4" />
              Clear
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 hover:bg-gray-700"
            >
              <Grid2X2 className="h-4 w-4 text-white " />
              <span className="text-white">Editor</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem className="gap-2" onSelect={onToggleGrid}>
              <Grid2X2 className="h-4 w-4" />
              <span className="text-black">Toggle Grid</span>
              {showGrid && <span className="ml-auto">✓</span>}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Hidden file input */}
        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleFileImport}
          className="hidden"
        />

        {/* AI Pixel Art Generator */}
        <div>
          <div className="sm:block">
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

                  const colors = extractColors(imageData);
                  onGeneratePalette(colors);
                };
                image.src = img;
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom row with editor-specific controls */}
      <div className="flex h-[70px] items-center gap-4 border-b border-t border-gray-700 px-8 py-4">
        <SelectedToolIcon className="h-5 w-5 text-white" />
        {/* Tool-specific controls */}
        {(selectedTool === "pencil" ||
          selectedTool === "eraser" ||
          selectedTool === "line") && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Brush Size:</span>
            <Input
              type="number"
              min={1}
              max={32}
              value={brushSize}
              onChange={(e) => handleBrushSizeChange(e.target.value)}
              className="w-16 bg-gray-700 text-white sm:w-20"
            />
          </div>
        )}

        {selectedTool === "bucket" && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Tolerance:</span>
            <Input
              type="number"
              min={1}
              max={10}
              value={bucketTolerance}
              onChange={(e) => handleToleranceChange(e.target.value)}
              className="w-16 bg-gray-700 text-white sm:w-20"
            />
          </div>
        )}

        {selectedTool === "select" && (
          <div className="flex items-center gap-3">
            <Switch
              id="clear-original"
              checked={shouldClearOriginal}
              onCheckedChange={setShouldClearOriginal}
            />
            <Label htmlFor="clear-original" className="text-sm text-gray-300">
              Move (instead of copy)
            </Label>
          </div>
        )}

        {(selectedTool === "eyedropper" || selectedTool === "pan") && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">No options available</span>
          </div>
        )}
      </div>

      {/* Alert Dialog */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to clear the canvas?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              current artwork.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col items-center gap-4 md:flex-row">
            <AlertDialogCancel className="bg-gray-500 text-white hover:bg-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onClearCanvas();
                setAlertOpen(false);
              }}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Clear Canvas
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
