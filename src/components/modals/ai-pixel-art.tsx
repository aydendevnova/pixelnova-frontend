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
} from "@/lib/image-processing";
import { useIndexedDB } from "@/hooks/use-indexed-db";
import { GeneratedImage } from "@/types/types";
import useUser from "@/hooks/use-user";
import { CREDITS_COST, useCredits } from "@/hooks/use-credits";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { optimisticDeductCredits } = useCredits();
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

  const handleGenerateAIImage = async () => {
    if (!prompt) return;
    try {
      generateImage(prompt, {
        onSuccess: (response: any) => {
          optimisticDeductCredits(CREDITS_COST.GENERATE_IMAGE);
          const blob = new Blob([response], { type: "image/png" });
          const reader = new FileReader();
          reader.onload = async (event) => {
            if (!event.target?.result) return;
            const base64Image = event.target.result as string;
            const file = new File([blob], "ai-generated.png", {
              type: "image/png",
            });
            onImageGenerated(file, base64Image, prompt);
          };
          reader.readAsDataURL(blob);
        },
        onError: (error) => {
          setError("Failed to generate AI image. Please try again.");
        },
      });
    } catch (error) {
      console.error("Error generating AI image:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Tabs defaultValue="ai" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="ai" disabled={isGenerating}>
          AI Generation & History
        </TabsTrigger>
        <TabsTrigger value="upload" disabled={isGenerating}>
          Manual Upload
        </TabsTrigger>
      </TabsList>

      <TabsContent value="ai" className="space-y-4">
        <div className="flex h-[400px] flex-col gap-8 lg:flex-row lg:items-stretch">
          {/* AI Generation Section */}
          <div className="flex h-full flex-1 flex-col">
            <div className="flex-1 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">
                AI Image Generation
              </h3>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  {error}
                </Alert>
              )}

              {isGenerating ? (
                <div className="relative h-72 w-full overflow-hidden rounded-lg">
                  <div
                    className={`animate-gradient absolute inset-0 bg-gradient-to-r ${generationSteps[generationStep]!.colors} bg-[length:200%_200%] transition-colors duration-1000`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)] mix-blend-overlay" />
                    <div className="absolute inset-0 animate-pulse bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:60px_60px]" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-center">
                      <div className="relative">
                        <Loader2 className="drop-shadow-glow mx-auto h-10 w-10 animate-spin text-white" />
                        <div className="absolute inset-0 animate-ping opacity-50">
                          <Loader2 className="mx-auto h-10 w-10 text-white" />
                        </div>
                      </div>
                      <p className="drop-shadow-glow mt-4 text-xl font-bold text-white transition-opacity duration-500">
                        {generationSteps[generationStep]!.text}
                      </p>
                      <p className="mt-2 text-sm font-medium text-white/90 transition-opacity duration-500">
                        {generationSteps[generationStep]!.subtext}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="space-y-2">
                    <label
                      htmlFor="prompt"
                      className="text-sm font-medium text-gray-700"
                    >
                      Image Description
                    </label>
                    <Input
                      id="prompt"
                      placeholder="Describe the image you want to generate..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Button
                    variant="default"
                    className="mt-8 w-full"
                    onClick={handleGenerateAIImage}
                    disabled={isGenerating || !prompt}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        Generate with AI <Sparkle className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* History Section */}
          <div className="flex h-full flex-1 flex-col">
            <div className="flex-1 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">Recent Generations</h3>

              <div className="w-full max-w-md">
                <Input
                  placeholder="Search your generated images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-4"
                />
              </div>

              <div className="overflow-y-auto">
                <div className="grid h-[300px] grid-cols-1 gap-4 sm:grid-cols-2">
                  {recentImages.length === 0 && (
                    <p className="text-sm text-gray-500">
                      No recent images found.
                    </p>
                  )}
                  {recentImages.map((image) => (
                    <div key={image.timestamp} className="space-y-2">
                      <div className="group relative aspect-square overflow-hidden rounded-lg">
                        <img
                          src={image.url}
                          alt={image.prompt}
                          className="h-full w-full cursor-pointer object-cover transition-transform duration-200 ease-in-out group-hover:scale-105"
                          onClick={() => {
                            if (!isGenerating) {
                              onHistoryImageSelect(image.url);
                            }
                          }}
                        />
                      </div>

                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p
                            className="line-clamp-2 text-sm font-medium text-gray-900"
                            title={image.prompt}
                          >
                            {image.prompt}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(image.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage(image.id);
                          }}
                          className="ml-2 rounded-full bg-gray-100 p-2 text-gray-500 transition-colors hover:bg-red-500 hover:text-white"
                          title="Delete image"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="upload">
        <div className="h-[400px] rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex h-full flex-col items-center justify-center space-y-6">
            <div className="space-y-2 text-center">
              <h3 className="text-2xl font-semibold text-gray-900">
                Manual Upload
              </h3>
              <p className="max-w-md text-gray-500">
                Upload your own images or AI-generated artwork to convert into
                pixel art. Supported formats: PNG, JPG, JPEG.
              </p>
            </div>

            <div className="w-full max-w-md">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
              />
              <div
                className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-12 text-center transition-colors hover:border-gray-400"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="space-y-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <Sparkle className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Click to upload or drag and drop
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Maximum file size: 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-gray-500">
              <p>
                Pro tip: You can use images from Midjourney, DALL-E, or any
                other AI art generator
              </p>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
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

export default function AiPixelArtModal({
  onFinish,
  onSignInRequired,
}: {
  onFinish: (image: string) => void;
  onSignInRequired: () => void;
}) {
  const { credits, optimisticDeductCredits } = useCredits();
  const { isSignedIn } = useUser();
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);
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

  useEffect(() => {
    const loadImages = async () => {
      try {
        if (open) {
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
  }, [open, searchTerm, searchByPrompt, getImages]);

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
    const img = new Image();
    img.onload = async () => {
      setImageDimensions({ width: img.width, height: img.height });
      setUploadedImage(imageUrl);
      setUploadedFile(file);

      if (prompt) {
        try {
          await saveImage({
            url: imageUrl,
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
      void handleEstimateGridSize(imageUrl, user.id);
    };
    img.src = imageUrl;
  };

  const handleHistoryImageSelect = (imageUrl: string) => {
    if (!user?.id) {
      setError("Please login to use this feature");
      return;
    }
    const img = new Image();
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
      fetch(imageUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "history-image.png", {
            type: "image/png",
          });
          setUploadedImage(imageUrl);
          setUploadedFile(file);
          setOriginalGridSizeEstimate(null);
          void handleEstimateGridSize(imageUrl, user.id);
          setStep(2);
        })
        .catch((error) => {
          console.error("Failed to process history image:", error);
          setError("Failed to load image from history. Please try again.");
        });
    };
    img.src = imageUrl;
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
      optimisticDeductCredits(CREDITS_COST.PROCESS_IMAGE);
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
        <StepThree results={results} onFinish={onFinish} setOpen={setOpen} />
      ),
    },
  ];

  const currentStep = steps[step - 1] ?? steps[0]!;

  return (
    <>
      {!isSignedIn && (
        <Button variant="default" onClick={onSignInRequired}>
          <span className="hidden sm:block"> Generate Pixel Art </span>
          <Sparkle />
        </Button>
      )}
      <Dialog
        open={open || isGenerating}
        onOpenChange={(open) => {
          setOpen(open);
          if (open) {
            setStep(1);
            setUploadedImage(null);
            setError(null);
          }
        }}
      >
        {error && <Alert variant="destructive">{error}</Alert>}
        {isSignedIn && (
          <DialogTrigger asChild>
            <Button variant="default">
              <span className="hidden sm:block"> Generate Pixel Art </span>
              <Sparkle />
            </Button>
          </DialogTrigger>
        )}

        <DialogContent className="h-[90vh] w-[90vw] max-w-none overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentStep.title}</DialogTitle>
            <DialogDescription>{currentStep.description}</DialogDescription>
          </DialogHeader>

          <div className="mb-4 flex items-center justify-end gap-2">
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-black px-3 py-1.5">
              <Sparkle className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-200">
                {credits} Credits
              </span>
            </div>
          </div>

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
                onClick={() => setStep((step) => step - 1)}
                disabled={step === 1}
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
