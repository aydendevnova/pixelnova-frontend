"use client";

import { useCallback, useEffect, useState } from "react";
import {
  FolderOpenIcon,
  ArrowDownTrayIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/input";
import {
  Grid2X2,
  HistoryIcon,
  Menu,
  Undo2,
  Redo2,
  Copy,
  Clipboard,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import AiPixelArtModal from "../modals/ai-pixel-art";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Layer, ToolType } from "@/types/editor";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useEditorStore } from "@/store/editorStore";
import { SignInModal } from "@/components/modals/signin-modal";

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
import { ResizeCanvasModal } from "../modals/resize-canvas";
import { CanvasRef } from "./Canvas";
import { SquareTool } from "@/lib/tools/square";
import { CircleTool } from "@/lib/tools/circle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import UploadImageModal from "../modals/upload-image";
import { extractColors } from "@/lib/utils/color";
import { useCredits } from "@/hooks/use-credits";

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
  isValidSelection: boolean;
  onDeleteSelection: () => void;
  canvasRef: React.RefObject<CanvasRef>;
  width: number;
  height: number;
  onCanvasResize: (newWidth: number, newHeight: number) => void;
  showHistory: boolean;
  onToggleHistory: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  onToolSelect: (tool: ToolType) => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onImportLayers: (layers: { name: string; imageData: ImageData }[]) => void;
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
  isValidSelection,
  onDeleteSelection,
  layers,
  canvasRef,
  width,
  height,
  onCanvasResize,
  showHistory,
  onToggleHistory,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  onToolSelect,
  onCopy,
  onPaste,
  onImportLayers,
}: TopMenuBarProps) {
  const { shouldClearOriginal, setShouldClearOriginal } = useEditorStore();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [isResizeModalOpen, setIsResizeModalOpen] = useState(false);
  const [isSquareFilled, setIsSquareFilled] = useState(false);
  const [isCircleFilled, setIsCircleFilled] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const { toast } = useToast();
  const { credits, isLoading: isLoadingCredits } = useCredits();

  const handleToleranceChange = (value: string) => {
    const numValue = Math.max(1, Math.min(10, Number(value) || 1));
    onBucketToleranceChange(numValue);
  };

  const handleBrushSizeChange = (value: string) => {
    const numValue = Math.max(1, Math.min(32, Number(value) || 1));
    onBrushSizeChange(numValue);
  };

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
            // convert layer.name from Layer 1 to layer_1
            const layerName = layer.name.toLowerCase().replace(/ /g, "_");
            zip.file(`${layerName}.png`, imageData.split(",")[1]!, {
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

  // Add handler for square fill toggle
  const handleSquareFillToggle = useCallback((checked: boolean) => {
    setIsSquareFilled(checked);
    SquareTool.setFilled(checked);
  }, []);

  const handleCircleFillToggle = useCallback((checked: boolean) => {
    setIsCircleFilled(checked);
    CircleTool.setFilled(checked);
  }, []);

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
  }, [alertOpen, isResizeModalOpen, isUploadModalOpen]);

  return (
    <div className="z-10 flex flex-col border-b border-gray-700 bg-gray-900/50">
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
              onSelect={() => setIsUploadModalOpen(true)}
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
            <DropdownMenuItem
              className="gap-2"
              onSelect={() => setIsResizeModalOpen(true)}
            >
              <ArrowRight className="h-4 w-4" />
              <span className="text-black">Resize Canvas</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2" onSelect={onToggleGrid}>
              <Grid2X2 className="h-4 w-4" />
              <span className="text-black">Toggle Grid</span>
              {showGrid && <span className="ml-auto">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2" onSelect={onToggleHistory}>
              <HistoryIcon className="h-4 w-4" />
              <span className="text-black">Visualize History</span>
              {showHistory && <span className="ml-auto">✓</span>}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* AI Pixel Art Generator */}
        <div>
          <div className="sm:block">
            <AiPixelArtModal
              onSignInRequired={() => setShowSignInModal(true)}
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

        {/* Credits Display */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/50 px-3 py-1.5">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium text-white">
              {isLoadingCredits ? "..." : credits} Credits
            </span>
          </div>
        </div>
      </div>

      {/* Bottom row with editor-specific controls */}
      <div className="flex h-[70px] items-center gap-4 border-b border-t border-gray-700 py-4 pl-4 pr-8">
        {/* Undo/Redo Controls */}
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-10 w-10 text-white",
                    !canUndo && "opacity-50",
                    canUndo && "hover:bg-gray-700",
                  )}
                  onClick={onUndo}
                  disabled={!canUndo}
                >
                  <Undo2 style={{ width: "24px", height: "24px" }} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Undo (Ctrl+Z)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-12 w-12 text-white",
                    !canRedo && "opacity-50",
                    canRedo && "hover:bg-gray-700",
                  )}
                  onClick={onRedo}
                  disabled={!canRedo}
                >
                  <Redo2 style={{ width: "24px", height: "24px" }} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Redo (Ctrl+Shift+Z)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <SelectedToolIcon className="ml-2 hidden h-5 w-5 text-white md:inline" />
        {/* Tool-specific controls */}
        {(selectedTool === "pencil" ||
          selectedTool === "eraser" ||
          selectedTool === "line" ||
          selectedTool === "square" ||
          selectedTool === "circle") && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Size:</span>
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

        {selectedTool === "square" && (
          <div className="flex flex-col items-center gap-3 max-md:mt-4 md:flex-row">
            <Switch
              id="fill-square"
              checked={isSquareFilled}
              onCheckedChange={handleSquareFillToggle}
            />
            <Label htmlFor="fill-square" className="text-sm text-gray-300">
              Filled
            </Label>
          </div>
        )}

        {selectedTool === "circle" && (
          <div className="flex flex-col items-center gap-3 max-md:mt-4 md:flex-row">
            <Switch
              id="fill-circle"
              checked={isCircleFilled}
              onCheckedChange={handleCircleFillToggle}
            />
            <Label htmlFor="fill-circle" className="text-sm text-gray-300">
              Filled
            </Label>
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
            <div className="flex flex-col items-center gap-3 max-md:mt-4 md:flex-row">
              <Switch
                id="clear-original"
                checked={shouldClearOriginal}
                onCheckedChange={setShouldClearOriginal}
              />
              <Label htmlFor="clear-original" className="text-sm text-gray-300">
                Move <span className="hidden md:inline">(instead of copy)</span>
              </Label>
            </div>

            <div className="flex items-center gap-2">
              {isValidSelection && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white hover:bg-gray-700"
                        onClick={onCopy}
                      >
                        <Copy className="h-4 w-4 text-white" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy (Ctrl+C)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {onPaste && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white hover:bg-gray-700"
                        onClick={onPaste}
                      >
                        <Clipboard className="h-4 w-4 text-white" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Paste (Ctrl+V)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        )}

        {(selectedTool === "eyedropper" || selectedTool === "pan") && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">No options available</span>
          </div>
        )}

        {selectedTool === "select" && isValidSelection && (
          <div className="flex items-center gap-3">
            <Button onClick={onDeleteSelection}>
              <span className="hidden text-sm text-gray-400 md:inline">
                Delete
              </span>
              <TrashIcon className="inline h-4 w-4 text-white md:hidden" />
            </Button>
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

      {/* Sign In Modal */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        featureName="AI Pixel Art Generator"
        onExport={handleExport}
      />

      <ResizeCanvasModal
        isOpen={isResizeModalOpen}
        onClose={() => setIsResizeModalOpen(false)}
        canvasRef={canvasRef}
        currentWidth={width}
        currentHeight={height}
        onResize={(newWidth, newHeight) => {
          onCanvasResize(newWidth, newHeight);
          setIsResizeModalOpen(false);
        }}
      />

      <UploadImageModal
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onImportImage={onImportImage}
        onGeneratePalette={onGeneratePalette}
        onImportLayers={onImportLayers}
      />
    </div>
  );
}
