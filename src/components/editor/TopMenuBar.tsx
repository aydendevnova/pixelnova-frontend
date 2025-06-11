"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  FolderOpenIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  ArchiveBoxIcon,
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
  ImageIcon,
  Sparkle,
  Palette,
} from "lucide-react";
import ConvertToPixelArtModal from "../modals/convert-to-pixel-art";
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
import UploadImageModal from "../modals/upload-image";

import { useModal } from "@/hooks/use-modal";
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogFooter, DialogHeader } from "../ui/dialog";
import NextImage from "next/image";
import AIPixelArtModal from "../modals/ai-pixel-art";
import ColorizerModal from "../modals/colorizer";
import SkinColorModal from "../modals/skin-colors";
import Link from "next/link";

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
  onCopy,
  onPaste,
  onImportLayers,
}: TopMenuBarProps) {
  const {
    isExportModalOpen,
    setIsExportModalOpen,
    isConvertToPixelArtOpen,
    setConvertToPixelArtOpen,
    isAIPixelArtOpen,
    setAIPixelArtOpen,
    isSmartColorizerOpen: isAIColorizerOpen,
    setSmartColorizerOpen: setAIColorizerOpen,
    isResizeCanvasOpen,
    setResizeCanvasOpen,
    isClearCanvasWarningOpen,
    setClearCanvasWarningOpen,
    isImportImageOpen,
    setImportImageOpen,
    isSkinColorsOpen,
    setSkinColorsOpen,
  } = useModal();
  const { shouldClearOriginal, setShouldClearOriginal } = useEditorStore();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [isSquareFilled, setIsSquareFilled] = useState(false);
  const [isCircleFilled, setIsCircleFilled] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleToleranceChange = (value: string) => {
    const numValue = Math.max(1, Math.min(10, Number(value) || 1));
    onBucketToleranceChange(numValue);
  };

  const handleBrushSizeChange = (value: string) => {
    const numValue = Math.max(1, Math.min(32, Number(value) || 1));
    onBrushSizeChange(numValue);
  };

  // Function to handle file export
  const handleExport = useCallback(
    async (type: "zip" | "png") => {
      // Get the drawing canvas
      const drawingCanvas = document.querySelector(
        'canvas[data-canvas="drawing"]',
      ) as HTMLCanvasElement | null;

      if (!drawingCanvas) {
        console.error("Drawing canvas not found");
        return;
      }

      if (type === "png") {
        // Create a new canvas for the combined image
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

          // Convert to blob and download
          combinedCanvas.toBlob((blob) => {
            if (blob) {
              saveAs(blob, `pixel_art_${Date.now()}.png`);
            }
          }, "image/png");
          return;
        }
      }

      // ZIP export logic
      const zip = new JSZip();

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
    },
    [layers],
  );

  // Add handler for square fill toggle
  const handleSquareFillToggle = useCallback((checked: boolean) => {
    setIsSquareFilled(checked);
    SquareTool.setFilled(checked);
  }, []);

  const handleCircleFillToggle = useCallback((checked: boolean) => {
    setIsCircleFilled(checked);
    CircleTool.setFilled(checked);
  }, []);

  useEffect(() => {
    if (isClearCanvasWarningOpen) {
      const timeoutId = setTimeout(() => {
        buttonRef.current?.focus();
      }, 1);
      return () => clearTimeout(timeoutId);
    }
  }, [isClearCanvasWarningOpen]);

  // Thanks Radix UI for your garbage cleanup in your Dialogs
  // keywords for search: raxid stupid cleanup annoying dialog close
  useEffect(() => {
    if (
      !isClearCanvasWarningOpen &&
      !isResizeCanvasOpen &&
      !isImportImageOpen &&
      !isExportModalOpen &&
      !isConvertToPixelArtOpen &&
      !isAIPixelArtOpen &&
      !isAIColorizerOpen &&
      !isSkinColorsOpen
    ) {
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
  }, [
    isClearCanvasWarningOpen,
    isResizeCanvasOpen,
    isImportImageOpen,
    isExportModalOpen,
    isConvertToPixelArtOpen,
    isAIPixelArtOpen,
    isAIColorizerOpen,
    isSkinColorsOpen,
  ]);

  return (
    <div className="z-10 flex flex-col border-b border-gray-700 bg-gray-900/50">
      {/* Top row with main controls */}
      <div className="flex h-[64px] items-center gap-4 px-4 py-2">
        <Link href="/" className="flex items-center gap-2">
          <NextImage
            src="/logo-og.png"
            alt="Pixel Nova"
            width={32}
            height={32}
          />
          <div className="hidden text-white md:inline">Pixel Nova</div>
          <span className="rounded-full  px-1.5 py-0.5 text-xs font-medium text-orange-800">
            public alpha
          </span>
        </Link>

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
              onSelect={() => setImportImageOpen(true)}
            >
              <FolderOpenIcon className="h-4 w-4 text-black" />
              <span className="text-black">Open</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="my-2 gap-2"
              onSelect={() => setIsExportModalOpen(true)}
            >
              <ArrowDownTrayIcon className="h-4 w-4 text-black" />
              <span className="text-black">Export</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2"
              onSelect={() => setClearCanvasWarningOpen(true)}
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
              onSelect={() => setResizeCanvasOpen(true)}
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

        {/* Tools section */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 hover:bg-gray-700"
            >
              {SelectedToolIcon && (
                <SelectedToolIcon className="h-4 w-4 text-white" />
              )}
              <span className="text-white">Tools</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem
              className="gap-2"
              onSelect={() => setAIPixelArtOpen(true)}
            >
              <Sparkle className="h-4 w-4" />
              <span className="text-black">AI Pixel Art</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2"
              onSelect={() => setAIColorizerOpen(true)}
            >
              <Palette className="h-4 w-4" />
              <span className="text-black">Smart Colorizer</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2"
              onSelect={() => setSkinColorsOpen(true)}
            >
              <Palette className="h-4 w-4" />
              <span className="text-black">Generate Skin Colors</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="ghost"
          className="flex items-center gap-2 bg-black text-white hover:bg-purple-700 hover:text-white"
          onClick={() => setConvertToPixelArtOpen(true)}
        >
          <Sparkle className="h-4 w-4" />
          <span className="text-white">Convert AI to Pixel Art</span>
        </Button>
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
      {/* Sign In Modal */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        featureName="AI Pixel Art Generator"
        onExport={() => handleExport("zip")}
      />
      <ResizeCanvasModal
        isOpen={isResizeCanvasOpen}
        onClose={() => setResizeCanvasOpen(false)}
        canvasRef={canvasRef}
        currentWidth={width}
        currentHeight={height}
        onResize={(newWidth, newHeight) => {
          onCanvasResize(newWidth, newHeight);
          setResizeCanvasOpen(false);
        }}
      />
      <UploadImageModal
        open={isImportImageOpen}
        onClose={() => setImportImageOpen(false)}
        onImportImage={onImportImage}
        onGeneratePalette={onGeneratePalette}
        onImportLayers={onImportLayers}
      />
      {/* Alert Dialog */}
      <Dialog
        open={isClearCanvasWarningOpen}
        onOpenChange={setClearCanvasWarningOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to clear the canvas?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              current artwork.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col items-center gap-4 md:flex-row">
            <Button
              variant="secondary"
              className="bg-gray-500 text-white hover:bg-gray-300"
              onClick={() => setClearCanvasWarningOpen(false)}
              autoFocus
              ref={buttonRef}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onClearCanvas();
                setClearCanvasWarningOpen(false);
              }}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Clear Canvas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Add Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />
      <ConvertToPixelArtModal
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
          };
          image.src = img;
        }}
      />{" "}
      <AIPixelArtModal
        open={isAIPixelArtOpen}
        onClose={() => setAIPixelArtOpen(false)}
      />
      <ColorizerModal
        open={isAIColorizerOpen}
        onClose={() => setAIColorizerOpen(false)}
        layers={layers}
        onImportImage={onImportImage}
      />
      <SkinColorModal
        open={isSkinColorsOpen}
        onClose={() => setSkinColorsOpen(false)}
        layers={layers}
        onImportImage={onImportImage}
      />
    </div>
  );
}

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (type: "zip" | "png") => void;
}

export function ExportModal({ isOpen, onClose, onExport }: ExportModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Artwork</DialogTitle>
          <DialogDescription>
            Choose how you want to export your artwork
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button
            variant="outline"
            className="flex items-center justify-start gap-3 p-6"
            onClick={() => {
              onExport("zip");
              onClose();
            }}
          >
            <ArchiveBoxIcon className="h-12 w-12" />
            <div className="flex flex-col items-start">
              <span className="font-semibold">ZIP Archive</span>
              <span className="text-sm text-gray-500">
                Export all layers separately and combined
              </span>
            </div>
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-start gap-3 p-6"
            onClick={() => {
              onExport("png");
              onClose();
            }}
          >
            <ImageIcon className="h-12 w-12" />
            <div className="flex flex-col items-start">
              <span className="font-semibold">PNG Image</span>
              <span className="text-sm text-gray-500">
                Export as a single flattened image
              </span>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
