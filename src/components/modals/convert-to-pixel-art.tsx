"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Alert } from "@/components/ui/alert";

import {
  useDownscaleImage,
  useEstimateGridSize,
  useGenerateImage,
} from "@/hooks/use-api";
import { Loader2, Sparkle, Trash2, UndoIcon } from "lucide-react";
import { DownscaleImageWASMResponse, DownscaleResponse } from "@/shared-types";

import {
  estimateGridSizeWASM,
  downscaleImageWASM,
  convertToPng,
} from "@/lib/image-processing";
import { useIndexedDB } from "@/hooks/use-indexed-db";
import { GeneratedImage } from "@/types/types";
import useUser from "@/hooks/use-user";

import { CreditsDisplay } from "../credits-display";
import { useModal } from "@/hooks/use-modal";
import { env } from "@/env";

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
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: generateImage, isLoading: isGenerating } = useGenerateImage();
  const [generationStep, setGenerationStep] = useState(0);

  const generationSteps = [
    {
      text: "Creating your masterpiece...",
      subtext: "Infusing pixels with AI magic ✨",
      colors: "from-indigo-600 via-purple-600 to-pink-600",
    },
    {
      text: "Crafting the details...",
      subtext: "Adding artistic flourishes 🎨",
      colors: "from-emerald-600 via-teal-600 to-cyan-600",
    },
    {
      text: "Refining the composition...",
      subtext: "Making it pixel perfect 🖼️",
      colors: "from-rose-600 via-red-600 to-orange-600",
    },
    {
      text: "Final touches...",
      subtext: "Almost ready to reveal ✨",
      colors: "from-violet-600 via-fuchsia-600 to-pink-600",
    },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setGenerationStep((prev) => (prev + 1) % generationSteps.length);
      }, 8000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  useEffect(() => {
    setIsGenerating(isGenerating);
  }, [isGenerating]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onImageGenerated(file, event.target.result as string, prompt);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], "url-image.png", { type: blob.type });

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageGenerated(file, event.target.result as string, prompt);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setError(
        "This website's URL does not allow direct importing. Please download and import the image directly.",
      );
    }
  };

  return (
    <div className="h-[600px] rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex h-full flex-col items-center justify-start space-y-8">
        <div className="space-y-2 text-center">
          <h3 className="text-2xl font-semibold text-gray-900">
            Import Your Image
          </h3>
          <p className="max-w-md text-gray-500">
            Generate pixel art from any image. You can:
          </p>
          <ul className="list-disc pl-6 text-left text-sm text-gray-600">
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
          <h4 className="font-medium text-gray-700">
            Option 1: Paste Image URL
          </h4>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Paste image URL from ChatGPT, Midjourney, etc."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleUrlSubmit} disabled={!imageUrl}>
              Import
            </Button>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="w-full max-w-md space-y-2">
          <h4 className="font-medium text-gray-700">Option 2: Upload Image</h4>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/png, image/jpg, image/jpeg, image/webp"
            onChange={handleFileUpload}
          />
          <div
            className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-gray-400"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Sparkle className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  Supported: PNG, JPG, WEBP
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Images Section */}
        {recentImages.length > 0 && (
          <div className="w-full max-w-md space-y-2">
            <h4 className="font-medium text-gray-700">
              Option 3: Recent Images
            </h4>
            <div className="grid grid-cols-3 gap-2">
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
                    className="absolute right-1 top-1 rounded-full bg-red-500 p-1 opacity-0 transition-opacity group-hover:opacity-100"
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
  setShowGrid: (show: boolean) => void;
  gridSize: number;
  setGridSize: (size: number) => void;
  imageDimensions: {
    width: number;
    height: number;
  };
  originalGridSizeEstimate: number | null;
  setOriginalGridSizeEstimate: (size: number | null) => void;
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
}: StepTwoProps) => {
  return (
    <div className="flex gap-4">
      {/* {error && <Alert variant="destructive">{error}</Alert>} */}
      <div className="w-64 space-y-4 rounded-lg border border-gray-400 bg-gray-200 p-4">
        <h3 className="text-lg font-medium">Grid Settings</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Show Grid</span>
            <Switch checked={showGrid} onCheckedChange={setShowGrid} />
          </div>

          <div className="space-y-2">
            <label className="text-sm">Grid Size</label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                max={256}
                value={gridSize}
                onChange={(e) => setGridSize(parseInt(e.target.value))}
                className="w-full"
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
              >
                {!originalGridSizeEstimate ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UndoIcon className="h-4 w-4" size="icon" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-700">
              Adjust grid to match pixel size
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Instructions</h4>
          <ul className="space-y-1 text-xs text-gray-700">
            <li>1. Adjust grid size to match image pixels</li>
            <li>2. Ensure grid lines align with pixel boundaries</li>
            <li>3. Use grid overlay as a guide for pixel accuracy</li>
          </ul>
        </div>
      </div>
      <div className="flex-1">
        {uploadedImage && (
          <div className="relative inline-block">
            <img
              src={uploadedImage}
              alt="Uploaded image"
              className="h-[60vh] w-auto object-contain"
              style={{ imageRendering: "pixelated" }}
            />
            {showGrid && originalGridSizeEstimate && (
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage: `
                  repeating-linear-gradient(to right, rgba(0,0,0,0.4) 0px, rgba(0,0,0,0.4) 1px, transparent 1px, transparent ${100 / gridSize}%),
                  repeating-linear-gradient(to bottom, rgba(0,0,0,0.4) 0px, rgba(0,0,0,0.4) 1px, transparent 1px, transparent ${100 / gridSize}%)
                `,
                  backgroundSize: `${100}% ${100}%`,
                  aspectRatio: `${imageDimensions.width} / ${imageDimensions.height}`,
                  width: "100%",
                  height: "100%",
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface StepThreeProps {
  results: DownscaleImageWASMResponse | null;
  onFinish: (image: string) => void;
  setOpen: (open: boolean) => void;
}

const StepThree = ({ results, onFinish, setOpen }: StepThreeProps) => (
  <div className="flex flex-col gap-4">
    <div className="grid grid-cols-3 gap-4">
      {results?.results.map((result, index) => (
        <div key={index} className="space-y-2">
          <h3 className="text-sm font-medium">Grid Size: {result.grid}</h3>
          <div className="relative aspect-square">
            <img
              src={result.image}
              alt={`Pixelated ${result.grid}x${result.grid}`}
              className="h-full w-full object-contain"
              style={{ imageRendering: "pixelated" }}
            />
          </div>
          <Button
            onClick={() => {
              onFinish(results?.results[index]?.image ?? "");
              setOpen(false);
            }}
          >
            Select this image
          </Button>
        </div>
      ))}
    </div>
  </div>
);

export default function ConvertToPixelArtModal({
  onFinish,
  onSignInRequired,
}: {
  onFinish: (image: string) => void;
  onSignInRequired: () => void;
}) {
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
  const { isConvertToPixelArtOpen, setConvertToPixelArtOpen } = useModal();

  useEffect(() => {
    const loadImages = async () => {
      try {
        if (isConvertToPixelArtOpen) {
          if (searchTerm.trim()) {
            const results = await searchByPrompt(searchTerm);
            setRecentImages(results);
          } else {
            const images = await getImages();
            setRecentImages(images);
          }
        }
      } catch (error) {
        console.error("Failed to load/search images:", error);
      }
    };
    void loadImages();
  }, [isConvertToPixelArtOpen, searchTerm, searchByPrompt, getImages]);

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
      return;
    }

    try {
      // Convert to PNG format first
      const pngImage = await convertToPng(imageUrl);

      const img = new Image();
      img.onload = async () => {
        setImageDimensions({ width: img.width, height: img.height });
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
      return;
    }

    try {
      // Convert to PNG format first
      const pngImage = await convertToPng(imageUrl);

      const img = new Image();
      img.onload = async () => {
        setImageDimensions({ width: img.width, height: img.height });
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
      setError(
        "This website's URL does not allow direct importing. Please download and import the image directly.",
      );
    }
  };

  const { mutateAsync: downscaleImage, isLoading: isDownscalingKey } =
    useDownscaleImage({
      onSuccess: (data) => {},
    });

  const handleDownscaleImage = async (userId: string) => {
    if (!uploadedImage) return;
    if (!uploadedFile) return;
    try {
      const { a, b, c, image } = await downscaleImage(uploadedFile);
      if (!a) {
        throw new Error("Failed to get key!");
      }
      setIsDownscaling(true);
      incrementOptimisticGenerations();
      const result = await downscaleImageWASM(
        !!image ? image : uploadedImage,
        gridSize,
        a,
        userId,
        b,
        c,
      );

      setResults(result);
      setIsDownscaling(false);
      setStep(3);
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
      title: "Set Image Grid",
      description: "Configure the pixel grid for your image",
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
        />
      ),
    },
    {
      title: "Preview Image",
      description: "Preview your pixelated image",
      content: (
        <StepThree
          results={results}
          onFinish={onFinish}
          setOpen={setConvertToPixelArtOpen}
        />
      ),
    },
  ];

  const currentStep = steps[step - 1] ?? steps[0]!;

  return (
    <>
      <Dialog
        open={isConvertToPixelArtOpen || isGenerating}
        onOpenChange={(open) => {
          setConvertToPixelArtOpen(open);
          if (open) {
            setStep(1);
            setUploadedImage(null);
            setError(null);
          }
        }}
      >
        {error && <Alert variant="destructive">{error}</Alert>}

        <DialogContent className="h-[90vh] w-[90vw] max-w-none overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentStep.title}</DialogTitle>
            <DialogDescription>{currentStep.description}</DialogDescription>
          </DialogHeader>

          <CreditsDisplay />

          <div className="mb-4 flex w-full gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-sm ${
                  index + 1 === step ? "bg-primary" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {currentStep.content}

          <DialogFooter className="">
            <div className="mt-auto flex w-full flex-1 justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  if (step === 1) {
                    setConvertToPixelArtOpen(false);
                  } else {
                    setStep((step) => step - 1);
                  }
                }}
              >
                Back
              </Button>
              {step < 3 && step !== 1 ? (
                <Button
                  disabled={
                    step === 2 &&
                    (!originalGridSizeEstimate ||
                      isDownscaling ||
                      isDownscalingKey ||
                      isEstimatingGridSize ||
                      isEstimatingGridSizeKey)
                  }
                  onClick={() => {
                    if (step === 2) {
                      if (!user?.id) {
                        setError("Please login to use this feature");
                        return;
                      }
                      void handleDownscaleImage(user.id);
                    } else {
                      setStep((step) => step + 1);
                    }
                  }}
                >
                  {step === 2 ? (
                    <>
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
                    </>
                  ) : (
                    "Next"
                  )}
                </Button>
              ) : (
                <></>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
