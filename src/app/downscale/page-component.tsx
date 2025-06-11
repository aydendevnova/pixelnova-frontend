"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Alert } from "@/components/ui/alert";
import { WasmProvider } from "@/components/wasm-provider";
import { useRouter } from "next/navigation";
import {
  useDownscaleImage,
  useEstimateGridSize,
  useGenerateImage,
} from "@/hooks/use-api";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  DownloadIcon,
  Loader2,
  Sparkle,
  Trash2,
  UndoIcon,
  AlertCircle,
} from "lucide-react";
import { DownscaleImageWASMResponse } from "@/shared-types";
import {
  estimateGridSizeWASM,
  downscaleImageWASM,
  convertToPng,
} from "@/lib/image-processing";
import { useIndexedDB } from "@/hooks/use-indexed-db";
import { GeneratedImage } from "@/types/types";
import useUser from "@/hooks/use-user";
import { CreditsDisplay } from "@/components/credits-display";

interface StepOneProps {
  onImageGenerated: (file: File, imageUrl: string, prompt: string) => void;
  recentImages: Array<{
    id: number;
    url: string;
    prompt: string;
    timestamp: string;
  }>;
  onHistoryImageSelect: (imageUrl: string) => void;
  handleDeleteImage: (id: number) => void;
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
}

const StepOne = ({
  onImageGenerated,
  recentImages,
  onHistoryImageSelect,
  handleDeleteImage,
  searchTerm,
  setSearchTerm,
  setIsGenerating,
}: StepOneProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative mt-4 rounded-2xl border border-slate-700/50 bg-slate-800/50 backdrop-blur">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-orange-600/20 opacity-75 blur-xl"></div>
      <div className="relative flex h-full flex-col items-center justify-start space-y-8 p-4">
        <div className="space-y-2 text-center">
          <h3 className="text-2xl font-semibold text-white">
            Import Your Image
          </h3>
          <p className="max-w-md text-slate-300">
            Generate pixel art from any image. You can:
          </p>
          <ul className="list-disc pl-6 text-left text-sm text-slate-400">
            <li>
              Generate a pixel art style image with ChatGPT/Midjourney and paste
              its URL
            </li>
            <li>Upload an image from your computer</li>
            <li>Choose from your recent images</li>
          </ul>
        </div>

        {/* URL Input Section */}
        <div className="w-full max-w-md space-y-2">
          <h4 className="font-medium text-slate-200">
            Option 1: Paste Image URL
          </h4>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Paste image URL from ChatGPT, Midjourney, etc."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-slate-900/50 text-slate-200"
            />
            <Button
              onClick={() => onHistoryImageSelect(searchTerm)}
              disabled={!searchTerm}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
            >
              Import
            </Button>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="w-full max-w-md space-y-2">
          <h4 className="font-medium text-slate-200">Option 2: Upload Image</h4>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/png, image/jpg, image/jpeg, image/webp"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  if (event.target?.result) {
                    onImageGenerated(file, event.target.result as string, "");
                  }
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          <div
            className="cursor-pointer rounded-lg border-2 border-dashed border-slate-600 bg-slate-900/30 p-8 text-center transition-colors hover:border-purple-500"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-800">
                <Sparkle className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-slate-400">
                  Supported: PNG, JPG, WEBP
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Images Section */}
        {recentImages.length > 0 && (
          <div className="w-full max-w-md space-y-2">
            <h4 className="font-medium text-slate-200">
              Option 3: Recent Images
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {recentImages.slice(0, 6).map((image) => (
                <div key={image.id} className="group relative">
                  <img
                    src={image.url}
                    alt={image.prompt}
                    className="h-24 w-full cursor-pointer rounded-lg object-cover transition-opacity hover:opacity-75"
                    onClick={() => onHistoryImageSelect(image.url)}
                  />
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    className="absolute right-1 top-1 rounded-full bg-red-500/80 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface StepTwoProps {
  uploadedFile: File | null;
  uploadedImage: string | null;
  showGrid: boolean;
  setShowGrid: React.Dispatch<React.SetStateAction<boolean>>;
  gridSize: number;
  setGridSize: React.Dispatch<React.SetStateAction<number>>;
  imageDimensions: {
    width: number;
    height: number;
  };
  originalGridSizeEstimate: number | null;
  setOriginalGridSizeEstimate: (size: number | null) => void;
  results: DownscaleImageWASMResponse | null;
  isDownscaling: boolean;
  isDownscalingKey: boolean;
  isEstimatingGridSize: boolean;
  isEstimatingGridSizeKey: boolean;
  handleDownscaleImage: (userId: string) => void;
  userId: string;
}

const StepTwo = ({
  uploadedFile,
  uploadedImage,
  showGrid,
  setShowGrid,
  setGridSize,
  gridSize,
  imageDimensions,
  originalGridSizeEstimate,
  setOriginalGridSizeEstimate,
  results,
  isDownscaling,
  isDownscalingKey,
  isEstimatingGridSize,
  isEstimatingGridSizeKey,
  handleDownscaleImage,
  userId,
}: StepTwoProps & {
  results: DownscaleImageWASMResponse | null;
  isDownscaling: boolean;
  isDownscalingKey: boolean;
  isEstimatingGridSize: boolean;
  isEstimatingGridSizeKey: boolean;
  handleDownscaleImage: (userId: string) => void;
  userId: string;
}) => {
  const [aspectRatio, setAspectRatio] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [zoomOffset, setZoomOffset] = useState({ x: 0, y: 0 });
  const [zoomFactor, setZoomFactor] = useState(2);
  const [compositeImage, setCompositeImage] = useState<string | null>(null);
  const [lastMouseEvent, setLastMouseEvent] = useState<{
    clientX: number;
    clientY: number;
  } | null>(null);
  const [lastRelativePosition, setLastRelativePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [showKeyboardTip, setShowKeyboardTip] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keyboardTipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [displayedDimensions, setDisplayedDimensions] = useState({
    width: 0,
    height: 0,
  });

  // Create composite image when grid or image changes
  useEffect(() => {
    if (
      !uploadedImage ||
      !showGrid ||
      !originalGridSizeEstimate ||
      !imageRef.current
    )
      return;

    const timeoutId = setTimeout(() => {
      const canvas = document.createElement("canvas");
      canvas.width = imageDimensions.width;
      canvas.height = imageDimensions.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Clear the entire canvas first
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the original image
      const img = new Image();
      img.onload = () => {
        // Clear and draw image
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Draw grid
        ctx.strokeStyle = "rgba(0,0,0,0.4)";
        ctx.lineWidth = 1;

        // Calculate grid dimensions based on aspect ratio
        const horizontalLines = gridSize;
        const verticalLines = Math.round(gridSize * aspectRatio);

        // Draw vertical lines
        for (let i = 0; i <= verticalLines; i++) {
          const x = (i / verticalLines) * canvas.width;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }

        // Draw horizontal lines
        for (let i = 0; i <= horizontalLines; i++) {
          const y = (i / horizontalLines) * canvas.height;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }

        setCompositeImage(canvas.toDataURL());
      };
      img.src = uploadedImage;
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [
    uploadedImage,
    showGrid,
    gridSize,
    originalGridSizeEstimate,
    imageDimensions,
    aspectRatio,
  ]);

  // Update zoom position when grid size changes, using stored relative position
  useEffect(() => {
    if (lastMouseEvent && isZooming && compositeImage) {
      // Immediate update for zoom position (not expensive)
      updateZoomPosition(lastMouseEvent);
    }
  }, [gridSize, compositeImage, lastMouseEvent, isZooming]);

  const updateZoomPosition = (mouseEvent: {
    clientX: number;
    clientY: number;
  }) => {
    if (!imageRef.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const imageRect = imageRef.current.getBoundingClientRect();

    // Account for padding and borders in the container
    const containerStyle = window.getComputedStyle(containerRef.current);
    const paddingTop = parseFloat(containerStyle.paddingTop);
    const borderTop = parseFloat(containerStyle.borderTopWidth);

    // Calculate relative position within the image, accounting for padding
    const relativeX = (mouseEvent.clientX - imageRect.left) / imageRect.width;
    const relativeY = (mouseEvent.clientY - imageRect.top) / imageRect.height;

    // Store the relative position for later use
    setLastRelativePosition({ x: relativeX, y: relativeY });

    // Set zoom position, accounting for container offsets
    setZoomPosition({
      x: mouseEvent.clientX - rect.left,
      y: mouseEvent.clientY - (rect.top + paddingTop + borderTop),
    });

    // Calculate the offset in the original image coordinates
    setZoomOffset({
      x: imageDimensions.width * relativeX,
      y: imageDimensions.height * relativeY,
    });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const increment = e.key === "ArrowUp" ? 1 : -1;
      setGridSize((prevGridSize) => {
        return Math.max(1, Math.min(256, prevGridSize + increment));
      });

      // Keep tooltip visible and reset the hide timer when using keyboard
      setShowKeyboardTip(true);
      if (keyboardTipTimeoutRef.current) {
        clearTimeout(keyboardTipTimeoutRef.current);
      }
      keyboardTipTimeoutRef.current = setTimeout(() => {
        setShowKeyboardTip(false);
      }, 2000); // Hide after 2 seconds of inactivity
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const mouseEvent = { clientX: e.clientX, clientY: e.clientY };
    setLastMouseEvent(mouseEvent);
    updateZoomPosition(mouseEvent);
  };

  const handleMouseEnter = () => {
    setIsZooming(true);
    setShowKeyboardTip(true);
    // Add keyboard event listener when hovering
    document.addEventListener("keydown", handleKeyDown);

    // Clear any existing timeout
    if (keyboardTipTimeoutRef.current) {
      clearTimeout(keyboardTipTimeoutRef.current);
    }
    // Hide tip after 3 seconds of no keyboard activity
    keyboardTipTimeoutRef.current = setTimeout(() => {
      setShowKeyboardTip(false);
    }, 3000);
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
    setShowKeyboardTip(false);
    // Remove keyboard event listener when not hovering
    document.removeEventListener("keydown", handleKeyDown);
    // Clear timeout
    if (keyboardTipTimeoutRef.current) {
      clearTimeout(keyboardTipTimeoutRef.current);
      keyboardTipTimeoutRef.current = null;
    }
  };

  // Cleanup event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (keyboardTipTimeoutRef.current) {
        clearTimeout(keyboardTipTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Left Side - Controls */}
      <div className="w-full space-y-6 lg:w-80">
        {/* Grid Settings Card */}
        <div className="relative rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-600/20 via-teal-600/20 to-cyan-600/20 opacity-75 blur-xl"></div>
          <div className="relative space-y-4">
            <h3 className="text-lg font-medium text-white">Grid Settings</h3>

            <div className="flex flex-wrap gap-6 lg:flex-col">
              <div className="flex items-center justify-between">
                <span className="mr-2 text-sm text-slate-200">Show Grid</span>
                <Switch checked={showGrid} onCheckedChange={setShowGrid} />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-200">Grid Size</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    max={256}
                    value={gridSize}
                    onChange={(e) => setGridSize(parseInt(e.target.value))}
                    className="w-full bg-slate-900/50 text-slate-200"
                  />
                  <Button
                    onClick={() => {
                      if (originalGridSizeEstimate) {
                        setGridSize(originalGridSizeEstimate);
                      }
                    }}
                    disabled={
                      originalGridSizeEstimate === gridSize ||
                      !originalGridSizeEstimate
                    }
                    className="bg-slate-700 text-white hover:bg-slate-600"
                  >
                    {!originalGridSizeEstimate ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <UndoIcon className="h-4 w-4" size="icon" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-slate-400">
                  Adjust grid to match pixel size
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-200">
                  Zoom Factor: {zoomFactor.toFixed(1)}x
                </label>
                <input
                  type="range"
                  min="1.5"
                  max="4"
                  step="0.5"
                  value={zoomFactor}
                  onChange={(e) => setZoomFactor(parseFloat(e.target.value))}
                  className="slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700"
                />
                <p className="text-xs text-slate-400">
                  Adjust zoom magnification level
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-slate-200">Instructions</h4>
              <ul className="space-y-1 text-xs text-slate-400">
                <li>1. Adjust grid size to match image pixels</li>
                <li>2. Ensure grid lines align with pixel boundaries</li>
                <li>3. Use grid overlay as a guide for pixel accuracy</li>
                <li>4. Hover over image to zoom and validate alignment</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Process Button Card */}
        <div className="relative rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-orange-600/20 opacity-75 blur-xl"></div>
          <div className="relative">
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
              disabled={
                !originalGridSizeEstimate ||
                isDownscaling ||
                isDownscalingKey ||
                isEstimatingGridSize ||
                isEstimatingGridSizeKey
              }
              onClick={() => handleDownscaleImage(userId)}
            >
              {isDownscalingKey ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validating Request
                </>
              ) : isDownscaling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Image
                </>
              ) : (
                <>
                  <Sparkle className="mr-2 h-4 w-4" />
                  Process Image
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Right Side - Preview and Results */}
      <div className="flex-1 space-y-6">
        {/* Original Image with Grid */}
        {uploadedImage && (
          <div className="relative w-full rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 backdrop-blur lg:min-w-[770px]">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-orange-600/20 opacity-75 blur-xl"></div>
            <div className="relative ">
              <h3 className="mb-4 text-lg font-medium text-white">
                Image Preview
              </h3>
              <div className="grid h-[400px] grid-cols-1 gap-4 lg:grid-cols-2">
                {/* Original Image */}
                <div className="group relative rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 backdrop-blur">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-600/20 via-teal-600/20 to-cyan-600/20 opacity-75 blur-xl"></div>
                  <div className="relative flex flex-col items-center space-y-2">
                    <h3 className="text-sm font-medium text-white">
                      Original Image
                    </h3>
                    <div
                      ref={containerRef}
                      className="relative my-auto inline-block w-full max-w-[342px] cursor-crosshair overflow-hidden"
                      onMouseMove={handleMouseMove}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      {/* Keyboard Tip Tooltip */}
                      {showKeyboardTip && (
                        <div className="absolute z-40 rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg">
                          <div className="flex items-center gap-2">
                            <span>Press</span>
                            <kbd className="rounded border border-slate-600 bg-slate-800 px-1.5 py-0.5 font-mono text-xs">
                              ↑
                            </kbd>
                            <kbd className="rounded border border-slate-600 bg-slate-800 px-1.5 py-0.5 font-mono text-xs">
                              ↓
                            </kbd>
                            <span>to adjust grid size</span>
                          </div>
                          <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-900"></div>
                        </div>
                      )}
                      <img
                        ref={imageRef}
                        src={uploadedImage}
                        alt="Uploaded image"
                        className="mx-auto block w-full object-contain"
                        style={{ imageRendering: "pixelated" }}
                        onLoad={(e) => {
                          const img = e.currentTarget;
                          const naturalAspectRatio =
                            img.naturalWidth / img.naturalHeight;
                          setAspectRatio(naturalAspectRatio);
                          setImageLoaded(true);
                        }}
                      />
                      {showGrid && originalGridSizeEstimate && imageLoaded && (
                        <div
                          className="pointer-events-none absolute inset-0"
                          style={{
                            backgroundImage: `
                              repeating-linear-gradient(
                                to right,
                                rgba(0,0,0,0.4) 0%,
                                rgba(0,0,0,0.4) 1px,
                                transparent 1px,
                                transparent calc(100% / ${Math.round(gridSize * aspectRatio)})
                              ),
                              repeating-linear-gradient(
                                to bottom,
                                rgba(0,0,0,0.4) 0%,
                                rgba(0,0,0,0.4) 1px,
                                transparent 1px,
                                transparent calc(100% / ${gridSize})
                              )
                            `,
                            backgroundSize: "100% 100%",
                            backgroundPosition: "center",
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Processed Results */}
                {results &&
                  results.results.map((result, index) => (
                    <div
                      key={index}
                      className="group relative rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 backdrop-blur"
                    >
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-orange-600/20 opacity-75 blur-xl"></div>
                      <div className="relative flex flex-col items-center space-y-2">
                        <h3 className="text-sm font-medium text-white">
                          Grid Size: {result.grid}
                        </h3>
                        <div className="relative aspect-square h-[40vh] w-auto overflow-hidden rounded-lg border border-slate-600">
                          <img
                            src={result.image}
                            alt={`Pixelated ${result.grid}x${result.grid}`}
                            className="h-full w-full object-contain"
                            style={{ imageRendering: "pixelated" }}
                          />
                        </div>
                        <div className="mx-auto w-[90%]">
                          <Button
                            onClick={() => {
                              const link = document.createElement("a");
                              link.href = result.image;
                              link.download = `pixelated_${result.grid}x${result.grid}.png`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            className=" w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                          >
                            <DownloadIcon className="mr-2 h-4 w-4" />
                            Download Image
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Zoom View */}
              {isZooming &&
                showGrid &&
                originalGridSizeEstimate &&
                compositeImage && (
                  <div
                    className="pointer-events-none absolute -top-36 left-32 z-50 h-[30vh] w-[30vh] -translate-x-1/2 overflow-hidden rounded-lg border-2 border-white shadow-2xl"
                    style={{
                      backgroundColor: "#1e293b",
                    }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `url(${compositeImage})`,
                        backgroundPosition: `-${zoomOffset.x * zoomFactor - 18 * 8}px -${
                          zoomOffset.y * zoomFactor - 18 * 8
                        }px`,
                        backgroundSize: `${imageDimensions.width * zoomFactor}px ${
                          imageDimensions.height * zoomFactor
                        }px`,
                        imageRendering: "pixelated",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                    {/* Center crosshair */}
                    <div className="absolute left-1/2 top-1/2 h-px w-10 -translate-x-1/2 -translate-y-1/2 bg-red-400 opacity-80"></div>
                    <div className="absolute left-1/2 top-1/2 h-10 w-px -translate-x-1/2 -translate-y-1/2 bg-red-400 opacity-80"></div>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function DownscalePageComponent() {
  const { profile, incrementOptimisticGenerations } = useUser();
  const [step, setStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [gridSize, setGridSize] = useState(16);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [originalGridSizeEstimate, setOriginalGridSizeEstimate] = useState<
    number | null
  >(null);
  const [showSmallImageWarning, setShowSmallImageWarning] = useState(false);

  const [results, setResults] = useState<DownscaleImageWASMResponse | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [isDownscaling, setIsDownscaling] = useState(false);
  const [isEstimatingGridSize, setIsEstimatingGridSize] = useState(false);
  const [recentImages, setRecentImages] = useState<GeneratedImage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { saveImage, getImages, deleteImage, searchByPrompt } = useIndexedDB();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const loadImages = async () => {
      try {
        if (searchTerm.trim()) {
          const results = await searchByPrompt(searchTerm);
          setRecentImages(results);
        } else {
          const images = await getImages();
          setRecentImages(images);
        }
      } catch (error) {
        console.error("Failed to load/search images:", error);
      }
    };
    void loadImages();
  }, [searchTerm, searchByPrompt, getImages]);

  const handleDeleteImage = async (id: number) => {
    if (typeof id === "undefined") return;

    try {
      await deleteImage(id);
      const updatedImages = await getImages();
      setRecentImages(updatedImages);
    } catch (error) {
      console.error("Failed to delete image:", error);
      setError("Failed to delete image. Please try again.");
    }
  };

  const handleImageGenerated = async (
    file: File,
    imageUrl: string,
    prompt: string,
  ) => {
    if (!user?.id) {
      setError("Please login to use this feature");
      router.push("/sign-in");
      return;
    }

    try {
      // Clear previous results when new image is uploaded
      setResults(null);
      setShowSmallImageWarning(false);

      // Convert to PNG format first
      const pngImage = await convertToPng(imageUrl);

      const img = new Image();
      img.onload = async () => {
        const dimensions = { width: img.width, height: img.height };
        setImageDimensions(dimensions);

        // Check if image is small (likely already pixel art)
        if (dimensions.width < 300 || dimensions.height < 300) {
          setShowSmallImageWarning(true);
        }

        setUploadedImage(pngImage);
        setUploadedFile(file);

        if (prompt) {
          try {
            await saveImage({
              url: pngImage,
              prompt,
              timestamp: new Date().toISOString(),
            });
            const updatedImages = await getImages();
            setRecentImages(updatedImages);
          } catch (error) {
            console.error("Failed to save generated image:", error);
          }
        }

        setStep(2);
        setOriginalGridSizeEstimate(null);
        void handleEstimateGridSize(pngImage, user.id);
      };
      img.src = pngImage;
    } catch (error) {
      console.error("Failed to convert image:", error);
      setError("Failed to process image. Please try again.");
    }
  };

  const handleHistoryImageSelect = async (imageUrl: string) => {
    if (!user?.id) {
      setError("Please login to use this feature");
      router.push("/sign-in");
      return;
    }

    try {
      // Clear previous results when new image is selected
      setResults(null);
      setShowSmallImageWarning(false);

      // Convert to PNG format first
      const pngImage = await convertToPng(imageUrl);

      const img = new Image();
      img.onload = async () => {
        const dimensions = { width: img.width, height: img.height };
        setImageDimensions(dimensions);

        // Check if image is small (likely already pixel art)
        if (dimensions.width < 300 || dimensions.height < 300) {
          setShowSmallImageWarning(true);
        }

        const response = await fetch(pngImage);
        const blob = await response.blob();
        const file = new File([blob], "history-image.png", {
          type: "image/png",
        });
        setUploadedImage(pngImage);
        setUploadedFile(file);
        setOriginalGridSizeEstimate(null);
        void handleEstimateGridSize(pngImage, user.id);
        setStep(2);
      };
      img.src = pngImage;
    } catch (error) {
      console.error("Failed to process history image:", error);
      setError("Failed to load image from history. Please try again.");
    }
  };

  const { mutateAsync: downscaleImage, isLoading: isDownscalingKey } =
    useDownscaleImage({
      onSuccess: (data) => {},
    });

  const handleDownscaleImage = async (userId: string) => {
    if (!uploadedImage) return;

    try {
      const { a, b, c } = await downscaleImage();
      if (!a) {
        throw new Error("Failed to get key!");
      }
      setIsDownscaling(true);
      incrementOptimisticGenerations();
      const result = await downscaleImageWASM(
        uploadedImage,
        gridSize,
        a,
        userId,
        b,
        c,
      );

      setResults(result);
      setIsDownscaling(false);
      // setStep(3);
    } catch (error) {
      console.error("Failed to downscale image:", error);
    }
  };

  const { mutateAsync: estimateGridSize, isLoading: isEstimatingGridSizeKey } =
    useEstimateGridSize();

  const handleEstimateGridSize = async (imageUrl: string, userId: string) => {
    try {
      setIsEstimatingGridSize(true);
      const { a, b, c } = await estimateGridSize();
      if (!a) {
        throw new Error("Failed to get key!");
      }

      const result = await estimateGridSizeWASM(imageUrl, a, userId, b, c);
      if (result && result.gridSize && typeof result.gridSize === "number") {
        setGridSize(result.gridSize);
        setOriginalGridSizeEstimate(result.gridSize);
      } else {
        console.error("Failed to estimate grid size:", result);
        throw new Error("Failed to estimate grid size");
      }
    } catch (error) {
      console.error("Failed to estimate grid size:", error);
    } finally {
      setIsEstimatingGridSize(false);
    }
  };

  const steps = [
    {
      title: "Convert Image to Pixel Art",
      description:
        "Generate with AI or upload an image to convert to pixel art",
      content: (
        <div className="space-y-4">
          {error && <Alert variant="destructive">{error}</Alert>}

          <StepOne
            onImageGenerated={handleImageGenerated}
            recentImages={recentImages}
            onHistoryImageSelect={handleHistoryImageSelect}
            handleDeleteImage={handleDeleteImage}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setIsGenerating={setIsGenerating}
          />
        </div>
      ),
    },
    {
      title: "Configure and Process",
      description: "Adjust grid size and process your image",
      content: (
        <StepTwo
          uploadedFile={uploadedFile}
          uploadedImage={uploadedImage}
          showGrid={showGrid}
          setShowGrid={setShowGrid}
          gridSize={gridSize}
          setGridSize={setGridSize}
          imageDimensions={imageDimensions}
          originalGridSizeEstimate={originalGridSizeEstimate}
          setOriginalGridSizeEstimate={setOriginalGridSizeEstimate}
          results={results}
          isDownscaling={isDownscaling}
          isDownscalingKey={isDownscalingKey}
          isEstimatingGridSize={isEstimatingGridSize}
          isEstimatingGridSizeKey={isEstimatingGridSizeKey}
          handleDownscaleImage={handleDownscaleImage}
          userId={user?.id ?? ""}
        />
      ),
    },
  ];

  const currentStep = steps[step - 1] ?? steps[0]!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-8 duration-500 animate-in fade-in">
      <div className="mx-auto max-w-7xl">
        {error && <Alert variant="destructive">{error}</Alert>}

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              {currentStep.title}
            </span>
          </h1>
          <p className="text-slate-400">{currentStep.description}</p>
        </div>

        {/* Small Image Warning */}
        {showSmallImageWarning && (
          <Alert
            variant="default"
            className="mb-4 border-amber-500/50 bg-amber-500/10 text-amber-200"
          >
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-amber-200">
                  Small Image Detected
                </h4>
                <p className="text-sm text-amber-300/80">
                  This image is {imageDimensions.width}×{imageDimensions.height}
                  px. Images smaller than 300px are likely already pixel art and
                  don't need this tool.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSmallImageWarning(false)}
                className="text-amber-200 hover:bg-amber-500/20"
              >
                ✕
              </Button>
            </div>
          </Alert>
        )}

        <div className="mb-4 flex items-center gap-4">
          {/* Buttons */}
          <div className="flex justify-between">
            {step === 2 && (
              <Button
                variant="outline"
                onClick={() => {
                  if (step > 1) {
                    setStep((step) => step - 1);
                  }
                }}
                className="border-slate-600 bg-slate-800/50 px-8 text-slate-300 hover:bg-slate-700"
              >
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
          </div>

          <CreditsDisplay />
        </div>

        <div className="mb-8 flex w-full gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-sm transition-colors ${
                index + 1 === step
                  ? "bg-gradient-to-r from-purple-600 to-pink-600"
                  : "bg-slate-700"
              }`}
            />
          ))}
        </div>

        <div className="rounded-lg">{currentStep.content}</div>
      </div>
    </div>
  );
}
