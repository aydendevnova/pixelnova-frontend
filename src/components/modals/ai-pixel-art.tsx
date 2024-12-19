"use client";

import { useState, useRef } from "react";
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
import { Loader2, Sparkle } from "lucide-react";
import { DownscaleResponse } from "@/shared-types";

interface StepOneProps {
  onImageGenerated: (file: File, imageUrl: string) => void;
}

const StepOne = ({ onImageGenerated }: StepOneProps) => {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: generateImage, isLoading: isGenerating } = useGenerateImage();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onImageGenerated(file, event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateAIImage = async () => {
    if (!prompt) return;
    try {
      generateImage(prompt, {
        onSuccess: (response: any) => {
          // Convert the response to a blob
          const blob = new Blob([response], { type: "image/png" });
          const file = new File([blob], "ai-generated.png", {
            type: "image/png",
          });

          // Create an object URL for displaying the image
          const imageUrl = URL.createObjectURL(blob);
          onImageGenerated(file, imageUrl);

          // Save URL and timestamp to local storage
          const timestamp = new Date().toISOString();
          const existingData = localStorage.getItem("generatedImages");
          const generatedImages = existingData ? JSON.parse(existingData) : [];

          generatedImages.push({
            url: imageUrl,
            timestamp: timestamp,
          });

          localStorage.setItem(
            "generatedImages",
            JSON.stringify(generatedImages),
          );
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
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">
      {error && <Alert variant="destructive">{error}</Alert>}
      <div className="w-full max-w-md space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Describe the image you want to generate..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button
            variant="default"
            className="w-full"
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
                Generate AI Image <Sparkle className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
            <div className="flex items-center justify-center">
              <span className="bg-background px-2 text-sm text-muted-foreground">
                or
              </span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileUpload}
        />
        <Button
          variant="outline"
          className="w-full"
          onClick={() => fileInputRef.current?.click()}
        >
          Upload Image
        </Button>
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
}

const StepTwo = ({
  uploadedFile,
  uploadedImage,
  showGrid,
  setShowGrid,
  setGridSize,
  gridSize,
  imageDimensions,
}: StepTwoProps) => {
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: estimateGridSize, isLoading } = useEstimateGridSize();

  async function handleEstimateGridSize() {
    try {
      if (!uploadedFile) return;
      const response = await estimateGridSize({ imageFile: uploadedFile });
      if (response.gridSize) {
        setGridSize(response.gridSize);
      }
    } catch (error) {
      console.error("Error estimating grid size: ", error);
      setError("Failed to estimate grid size. Please try again.");
    }
  }

  return (
    <div className="flex gap-4">
      {error && <Alert variant="destructive">{error}</Alert>}
      <div className="w-64 space-y-4 rounded-lg border border-gray-400 bg-gray-200 p-4">
        <h3 className="text-lg font-medium">Grid Settings</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Show Grid</span>
            <Switch checked={showGrid} onCheckedChange={setShowGrid} />
          </div>

          <div className="space-y-2">
            <label className="text-sm">Grid Size</label>
            <Input
              type="number"
              min={1}
              max={256}
              value={gridSize}
              onChange={(e) => setGridSize(parseInt(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-700">
              Adjust grid to match pixel size
            </p>
          </div>
        </div>
        {uploadedFile && (
          <Button onClick={handleEstimateGridSize} disabled={isLoading}>
            Estimate Grid
          </Button>
        )}

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
            {showGrid && (
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
  results: DownscaleResponse | null;
  onFinish: (image: string) => void;
  setOpen: (open: boolean) => void;
}

const StepThree = ({ results, onFinish, setOpen }: StepThreeProps) => (
  <div className="flex flex-col gap-4">
    <div className="grid grid-cols-2 gap-4">
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
}: {
  onFinish: (image: string) => void;
}) {
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [gridSize, setGridSize] = useState(16);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [results, setResults] = useState<DownscaleResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageGenerated = (file: File, imageUrl: string) => {
    const img = new Image();
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
    };
    img.src = imageUrl;
    setUploadedImage(imageUrl);
    setUploadedFile(file);
    setStep(2);
  };

  const { mutateAsync: downscaleImage, isLoading: isDownscaling } =
    useDownscaleImage({
      onSuccess: (data) => {
        setResults(data);
        setStep(3);
      },
    });

  async function handleDownscaleImage() {
    try {
      if (!uploadedFile) return;
      const response = await downscaleImage({
        imageFile: uploadedFile,
        grid: gridSize,
      });
      setResults(response);
    } catch (error) {
      console.error("Error downscaling image: ", error);
      setError("Failed to downscale image. Please try again.");
    }
  }

  const steps = [
    {
      title: "Convert Image to Pixel Art",
      description: "Upload an image to convert to pixel art",
      content: <StepOne onImageGenerated={handleImageGenerated} />,
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
    <Dialog
      open={open}
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
      <DialogTrigger asChild>
        <Button variant="default">
          Generate Pixel Art <Sparkle />
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[90vh] w-[90vw] max-w-none overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{currentStep.title}</DialogTitle>
          <DialogDescription>{currentStep.description}</DialogDescription>
        </DialogHeader>

        {/* Step indicator */}
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

        {/* Step content */}
        {currentStep.content}

        {/* Navigation buttons */}
        <DialogFooter className="">
          <div className="mt-auto flex w-full flex-1 justify-between">
            <Button
              variant="outline"
              onClick={() => setStep((step) => step - 1)}
              disabled={step === 1}
            >
              Back
            </Button>
            {step < 3 ? (
              <Button
                disabled={step === 2 && isDownscaling}
                onClick={() => {
                  if (step === 2) {
                    void handleDownscaleImage();
                  } else {
                    setStep((step) => step + 1);
                  }
                }}
              >
                {step === 2 ? (
                  <>
                    {isDownscaling ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkle className="mr-2 h-4 w-4" />
                    )}
                    Processing Image
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
  );
}
