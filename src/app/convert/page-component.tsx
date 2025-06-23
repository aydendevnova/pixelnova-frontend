"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  DownloadIcon,
  Loader2,
  Sparkle,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

import useUser from "@/hooks/use-user";
import { SignInModal } from "@/components/modals/signin-modal";
import { ConversionsDisplay } from "@/components/conversions-display";
import { getMaxConversions, PLAN_LIMITS, UserTier } from "@/lib/constants";
import { resizeImageWithPica } from "@/lib/utils/image";
import Link from "next/link";
import { PRESET_RESOLUTIONS } from "@/lib/client-image-processing";
import { useUpdateGenerationCount, useReduceColors } from "@/hooks/use-api";
import { useSession } from "@supabase/auth-helpers-react";
import { Label } from "@/components/ui/label";

interface StepOneProps {
  onImageGenerated: (file: File, imageUrl: string, prompt: string) => void;
  onHistoryImageSelect: (imageUrl: string) => void;
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  isProcessing: boolean;
  processingStage: string;
  colorFactor: number;
  setColorFactor: (factor: number) => void;
}

const StepOne = ({
  onImageGenerated,
  onHistoryImageSelect,
  searchTerm,
  setSearchTerm,
  setIsGenerating,
  isProcessing,
  processingStage,
  colorFactor,
  setColorFactor,
}: StepOneProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative mt-4 rounded-2xl border border-slate-700/50 bg-slate-800/50 backdrop-blur">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-orange-600/20 opacity-75 blur-xl"></div>

      {/* Loading Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 z-50 flex items-center justify-center rounded-2xl bg-slate-900/80 backdrop-blur">
          <div className="flex flex-col items-center space-y-4 p-8 text-center">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkle className="h-6 w-6 text-purple-300" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white">
                Processing Image
              </h3>
              <p className="text-sm text-slate-300">{processingStage}</p>
            </div>
          </div>
        </div>
      )}

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

        <div className="ml-auto w-fit">
          <Label className="text-slate-300">
            Advanced: Color Reduction Factor
          </Label>
          <Input
            type="number"
            value={colorFactor}
            onChange={(e) => setColorFactor(parseInt(e.target.value))}
            className="bg-slate-900/50 text-slate-300"
          />
        </div>
      </div>
    </div>
  );
};

interface StepTwoProps {
  uploadedImage: string | null;
  onProcess: (resolution: number, variationRange: number) => void;
  isProcessing: boolean;
  results: Array<{ image: string; resolution: number }> | null;
}

const StepTwo = ({
  uploadedImage,
  onProcess,
  isProcessing,
  results,
}: StepTwoProps) => {
  const [resolution, setResolution] = useState<number>(32);
  const [variationRange, setVariationRange] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        setResolution((prev) => {
          const increment = e.key === "ArrowUp" ? 1 : -1;
          const newValue = prev + increment;
          return Math.max(1, Math.min(256, newValue));
        });
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (resolution > 0 && resolution <= 256) {
          onProcess(resolution, variationRange);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [resolution, variationRange, onProcess]);

  const handleResolutionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      if (value > 0 && value <= 256) {
        setResolution(value);
        setError(null);
      } else {
        setError("Resolution must be between 1 and 256");
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      {/* Left Side - Controls */}
      <div className="w-full lg:w-80">
        <div className="relative rounded-2xl border border-slate-700/50 bg-slate-800/50 p-4 backdrop-blur lg:p-6">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-600/20 via-teal-600/20 to-cyan-600/20 opacity-75 blur-xl"></div>
          <div className="relative space-y-4">
            <h3 className="text-lg font-medium text-white">
              Resolution Settings
            </h3>

            <div className="space-y-4">
              {/* Custom Resolution Input */}
              <div className="space-y-2">
                <label className="text-sm text-slate-200">
                  Custom Resolution
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={resolution}
                    onChange={handleResolutionChange}
                    min={1}
                    max={256}
                    className="bg-slate-900/50 text-slate-200"
                  />
                  <div className="flex flex-col gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 bg-white px-2"
                      onClick={() => setResolution((r) => Math.min(256, r + 1))}
                    >
                      ↑
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 bg-white px-2"
                      onClick={() => setResolution((r) => Math.max(1, r - 1))}
                    >
                      ↓
                    </Button>
                  </div>
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}
              </div>

              {/* Variation Range Selector */}
              <div className="space-y-2">
                <label className="text-sm text-slate-200">Variations</label>
                <Select
                  value={variationRange.toString()}
                  onValueChange={(value) => setVariationRange(parseInt(value))}
                >
                  <SelectTrigger className="bg-slate-900/50 text-slate-200">
                    <SelectValue placeholder="Select variations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No variations</SelectItem>
                    <SelectItem value="1">+1 pixel (2 sizes)</SelectItem>
                    <SelectItem value="3">±3 pixels (7 sizes)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-400">
                  Generate additional sizes around your target resolution
                </p>
              </div>

              {/* Preset Buttons */}
              <div className="space-y-2">
                <label className="text-sm text-slate-200">Quick Presets</label>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_RESOLUTIONS.map((preset) => (
                    <Button
                      key={preset.value}
                      variant={
                        resolution === preset.value ? "default" : "outline"
                      }
                      onClick={() => {
                        setResolution(preset.value);
                        setError(null);
                      }}
                      className={
                        resolution === preset.value
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                          : "border-slate-600 bg-slate-800/50 text-slate-300 hover:bg-slate-700"
                      }
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => onProcess(resolution, variationRange)}
                disabled={isProcessing || resolution <= 0 || resolution > 256}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkle className="mr-2 h-4 w-4" />
                    Process Image
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-slate-200">Tips</h4>
              <ul className="space-y-1 text-xs text-slate-400">
                <li>• Use ↑/↓ keys or buttons to adjust resolution</li>
                <li>• Press Enter to quickly process</li>
                <li>• Try different resolutions to find the best result</li>
                <li>• Lower values = more pixelated</li>
                <li>• Higher values = more detail</li>
                <li>• Use variations to compare similar sizes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Preview and Results */}
      <div className="flex-1">
        {uploadedImage && (
          <div className="relative w-full rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 backdrop-blur">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-orange-600/20 opacity-75 blur-xl"></div>
            <div className="relative">
              <h3 className="mb-4 text-lg font-medium text-white">
                Image Preview
              </h3>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* Original Image */}
                <div className="group relative rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 backdrop-blur">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-600/20 via-teal-600/20 to-cyan-600/20 opacity-75 blur-xl"></div>
                  <div className="relative flex flex-col items-center space-y-2">
                    <h3 className="text-sm font-medium text-white">
                      Original Image
                    </h3>
                    <img
                      src={uploadedImage}
                      alt="Original image"
                      className="h-[30vh] w-auto object-contain lg:h-[40vh]"
                    />
                  </div>
                </div>

                {/* Processed Results */}
                {results &&
                  results.map((result, index) => (
                    <div
                      key={index}
                      className="group relative rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 backdrop-blur"
                    >
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-orange-600/20 opacity-75 blur-xl"></div>
                      <div className="relative flex flex-col items-center space-y-2">
                        <h3 className="text-sm font-medium text-white">
                          {result.resolution}x{result.resolution}
                        </h3>
                        <img
                          src={result.image}
                          alt={`Pixelated ${result.resolution}x${result.resolution}`}
                          className="h-[30vh] w-auto object-contain lg:h-[40vh]"
                          style={{ imageRendering: "pixelated" }}
                        />
                        <Button
                          onClick={() => {
                            const link = document.createElement("a");
                            link.href = result.image;
                            link.download = `pixelated_${result.resolution}x${result.resolution}.png`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                        >
                          <DownloadIcon className="mr-2 h-4 w-4" />
                          Download Image
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function ConvertImagePageClient() {
  const { profile, user } = useUser();
  const session = useSession();
  const router = useRouter();
  const updateGenerationCount = useUpdateGenerationCount();
  const reduceColors = useReduceColors({});

  const [step, setStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [downscaledImage, setDownscaledImage] = useState<string | null>(null);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [pendingImageAction, setPendingImageAction] = useState<{
    type: "upload" | "url";
    file?: File;
    imageUrl?: string;
    prompt?: string;
  } | null>(null);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [showSmallImageWarning, setShowSmallImageWarning] = useState(false);

  const [results, setResults] = useState<Array<{
    image: string;
    resolution: number;
  }> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState("");

  const [colorFactor, setColorFactor] = useState<number>(96);

  // Handle browser back button navigation between steps
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;
      if (state && state.step) {
        setStep(state.step);
        setError(null);
        setShowSmallImageWarning(false);
      } else if (step === 2) {
        // If no state but we're on step 2, go back to step 1
        setStep(1);
        setError(null);
        setShowSmallImageWarning(false);
      }
    };

    window.addEventListener("popstate", handlePopState);

    // Initialize with current step
    if (step === 1) {
      window.history.replaceState({ step: 1 }, "", window.location.pathname);
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [step]);

  // Push new state when step changes
  useEffect(() => {
    if (step === 2) {
      window.history.pushState({ step: 2 }, "", window.location.pathname);
    }
  }, [step]);

  const handleImageGenerated = async (
    file: File,
    imageUrl: string,
    prompt: string,
  ) => {
    if (!user?.id) {
      setPendingImageAction({ type: "upload", file, imageUrl, prompt });
      setShowSignInModal(true);
      return;
    }

    try {
      setIsProcessing(true);
      setProcessingStage("Optimizing image size...");

      // Clear previous results when new image is uploaded
      setResults(null);
      setShowSmallImageWarning(false);

      // Initial downscale to 512px max dimension using Pica
      const resizedImage = await resizeImageWithPica(imageUrl);

      // Convert resized image to File object for the API
      const response = await fetch(resizedImage);
      const blob = await response.blob();
      const resizedFile = new File([blob], "resized-image.png", {
        type: "image/png",
      });

      setProcessingStage("Reducing colors...");
      const reducedColorsResult = await reduceColors.mutateAsync({
        imageFile: resizedFile,
        factor: colorFactor,
      });
      const reducedColorsImage = reducedColorsResult.image;

      setProcessingStage("Preparing image preview...");
      const img = new Image();
      img.onload = async () => {
        const dimensions = { width: img.width, height: img.height };
        setImageDimensions(dimensions);

        // Check if image is small (likely already pixel art)
        if (dimensions.width < 300 || dimensions.height < 300) {
          setShowSmallImageWarning(true);
        }

        setUploadedImage(reducedColorsImage);
        setDownscaledImage(reducedColorsImage);
        setUploadedFile(file);

        setStep(2);
        setIsProcessing(false);
      };
      img.src = reducedColorsImage;
    } catch (error) {
      console.error("Failed to process image:", error);
      setError("Failed to process image. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleHistoryImageSelect = async (imageUrl: string) => {
    if (!user?.id) {
      setPendingImageAction({ type: "url", imageUrl });
      setShowSignInModal(true);
      return;
    }

    try {
      setIsProcessing(true);
      setProcessingStage("Optimizing image size...");

      // Clear previous results when new image is selected
      setResults(null);
      setShowSmallImageWarning(false);

      // Resize the image using Pica
      const resizedImage = await resizeImageWithPica(imageUrl);

      // Convert resized image to File object for the API
      const response = await fetch(resizedImage);
      const blob = await response.blob();
      const resizedFile = new File([blob], "resized-image.png", {
        type: "image/png",
      });

      setProcessingStage("Reducing colors...");
      const reducedColorsResult = await reduceColors.mutateAsync({
        imageFile: resizedFile,
        factor: colorFactor,
      });
      const reducedColorsImage = reducedColorsResult.image;

      setProcessingStage("Preparing image preview...");
      const img = new Image();
      img.onload = async () => {
        const dimensions = { width: img.width, height: img.height };
        setImageDimensions(dimensions);

        // Check if image is small (likely already pixel art)
        if (dimensions.width < 300 || dimensions.height < 300) {
          setShowSmallImageWarning(true);
        }

        const response = await fetch(reducedColorsImage);
        const blob = await response.blob();
        const file = new File([blob], "history-image.png", {
          type: "image/png",
        });
        setUploadedImage(reducedColorsImage);
        setUploadedFile(file);
        setStep(2);
        setIsProcessing(false);
      };
      img.src = reducedColorsImage;
    } catch (error) {
      console.error("Failed to process history image:", error);
      setError(
        "This website's URL may not allow direct importing. Please download and import the image directly.",
      );
      setIsProcessing(false);
    }
  };

  const handleProcess = async (resolution: number, variationRange: number) => {
    if (!downscaledImage) return;

    // Check conversion limits
    if (
      profile?.tier &&
      profile.conversion_count >= getMaxConversions(profile.tier as UserTier)
    ) {
      setError(
        `You've reached your ${PLAN_LIMITS[profile.tier as UserTier].MAX_CONVERSIONS} image conversion limit.${
          profile.tier === "NONE"
            ? " Upgrade to Pro for unlimited conversions!"
            : ""
        }`,
      );
      return;
    }

    try {
      setIsProcessing(true);
      setProcessingStage(
        variationRange > 0
          ? "Processing image variations..."
          : "Processing image...",
      );

      if (variationRange === 0) {
        // Single image processing - use client-side downscaling with proper aspect ratio
        const { downscaleImage } = await import(
          "@/lib/client-image-processing"
        );
        const finalImage = await downscaleImage(downscaledImage, resolution);

        // Tell server to increment generation count
        await updateGenerationCount.mutateAsync();

        setResults([{ image: finalImage, resolution }]);
      } else if (variationRange === 1 || variationRange === 3) {
        // Handle variations - use client-side downscaling with proper aspect ratio
        const { downscaleImage } = await import(
          "@/lib/client-image-processing"
        );
        const variations = [];
        const startRes = resolution - variationRange;
        const endRes = resolution + (variationRange === 1 ? 1 : variationRange);

        for (let currentRes = startRes; currentRes <= endRes; currentRes++) {
          if (currentRes <= 0) continue;

          setProcessingStage(`Processing ${currentRes}px width variation...`);

          const finalImage = await downscaleImage(downscaledImage, currentRes);

          variations.push({
            image: finalImage,
            resolution: currentRes,
          });
        }

        // Tell server to increment generation count once for the whole batch
        await updateGenerationCount.mutateAsync();

        setResults(variations);
      }
    } catch (error) {
      console.error("Failed to process image:", error);
      setError("Failed to process image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    {
      title: "Convert Image to Pixel Art",
      description:
        "Generate with AI or upload an image to convert to pixel art",
      content: (
        <div className="space-y-4">
          <StepOne
            onImageGenerated={handleImageGenerated}
            onHistoryImageSelect={handleHistoryImageSelect}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setIsGenerating={setIsProcessing}
            isProcessing={isProcessing}
            processingStage={processingStage}
            colorFactor={colorFactor}
            setColorFactor={setColorFactor}
          />
        </div>
      ),
    },
    {
      title: "Set Output Resolution",
      description: "Choose the resolution for your pixel art",
      content: (
        <StepTwo
          uploadedImage={uploadedImage}
          onProcess={handleProcess}
          isProcessing={isProcessing}
          results={results}
        />
      ),
    },
  ];

  const currentStep = steps[step - 1] ?? steps[0]!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-4 pt-20 lg:p-8">
      <div className="mx-auto max-w-7xl duration-500 animate-in fade-in">
        <SignInModal
          isOpen={showSignInModal}
          onClose={() => setShowSignInModal(false)}
          featureName="image conversion"
          onExport={async () => {
            if (pendingImageAction) {
              if (
                pendingImageAction.type === "upload" &&
                pendingImageAction.file &&
                pendingImageAction.imageUrl
              ) {
                await handleImageGenerated(
                  pendingImageAction.file,
                  pendingImageAction.imageUrl,
                  pendingImageAction.prompt ?? "",
                );
              } else if (
                pendingImageAction.type === "url" &&
                pendingImageAction.imageUrl
              ) {
                await handleHistoryImageSelect(pendingImageAction.imageUrl);
              }
              setPendingImageAction(null);
            }
          }}
        />
        <div className="mb-8 pt-12 text-center">
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

        {error && (
          <Alert variant="destructive" className="mb-4 flex items-center gap-2">
            <AlertCircle className="mr-2 h-4 w-4" />
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        )}

        <div className="mb-4 flex flex-wrap items-center gap-4">
          {/* Buttons */}
          {step === 2 && (
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  if (step > 1) {
                    setStep((step) => step - 1);
                    setError(null);
                    setShowSmallImageWarning(false);
                  }
                }}
                className="border-slate-600 bg-slate-800/50 px-4 text-slate-300 hover:bg-slate-700 lg:px-8"
              >
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>
          )}

          <Link href="/tutorials/convert-to-pixel-art">
            <Button
              variant="outline"
              className="border-slate-600 bg-slate-800/50 px-4 text-slate-300 hover:bg-slate-700 lg:px-8"
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              View Tutorial
            </Button>
          </Link>

          <ConversionsDisplay />
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

        {/* Show conversion limit alert */}
        {profile?.tier &&
          profile.conversion_count >=
            getMaxConversions(profile.tier as UserTier) && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Conversion Limit Reached</AlertTitle>
              <AlertDescription>
                You've reached your{" "}
                {PLAN_LIMITS[profile.tier as UserTier].MAX_CONVERSIONS ===
                Infinity
                  ? "unlimited"
                  : PLAN_LIMITS[profile.tier as UserTier].MAX_CONVERSIONS}{" "}
                image conversion limit.{" "}
                {profile.tier === "NONE" && (
                  <>
                    <a
                      href="/pricing"
                      className="text-blue-400 hover:underline"
                    >
                      Upgrade to Pro
                    </a>{" "}
                    for unlimited conversions!
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}

        <div className="rounded-lg">{currentStep.content}</div>
      </div>
    </div>
  );
}
