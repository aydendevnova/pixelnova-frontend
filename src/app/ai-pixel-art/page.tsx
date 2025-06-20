"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Wand2,
  Download,
  ChevronDown,
  Package,
  Grid,
  AlertCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { useGeneratePixelArt } from "@/hooks/use-api";
import useUser from "@/hooks/use-user";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import {
  downloadAsZip,
  downloadAsSpritesheet,
  ImageResult,
} from "@/lib/utils/download";
import { SignInModal } from "@/components/modals/signin-modal";
import { useModal } from "@/hooks/use-modal";
import { getMaxGenerations, PLAN_LIMITS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [useOpenAI, setUseOpenAI] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [selectedVariants, setSelectedVariants] = useState<Set<number>>(
    new Set(),
  );
  const {
    mutate: generatePixelArt,
    isLoading,
    error,
    data,
  } = useGeneratePixelArt();
  const { isSignedIn, profile } = useUser();
  const [variants, setVariants] = useState<
    Array<{ id: string; image: string; name: string }>
  >([]);

  const handleGenerate = async () => {
    if (!isSignedIn) {
      setSignInModalOpen(true);
      return;
    }

    // Check generation limits
    if (
      profile?.tier &&
      profile.generation_count >= getMaxGenerations(profile.tier)
    ) {
      return;
    }

    // Set initial loading message
    setLoadingMessage("Preparing to generate your pixel art...");

    generatePixelArt(
      {
        prompt,
        useOpenAI,
      },
      {
        onSuccess: (imageData) => {
          setLoadingMessage("");
          const newVariant = {
            id: Date.now().toString(),
            image: imageData,
            name: prompt,
          };
          setVariants((prev) => [newVariant, ...prev]);
          // Shift all existing selected indices by 1 and add the new variant (index 0)
          setSelectedVariants((prev) => {
            const newSet = new Set<number>();
            // Add the new variant's index (0)
            newSet.add(0);
            // Shift all existing selections by 1
            prev.forEach((index) => {
              newSet.add(index + 1);
            });
            return newSet;
          });
        },
        onError: () => {
          setLoadingMessage("");
        },
      },
    );

    // Update loading message based on OpenAI usage
    if (useOpenAI) {
      setLoadingMessage("Using ChatGPT to enhance your prompt...");
      setTimeout(() => {
        if (isLoading) {
          setLoadingMessage("Generating pixel art from enhanced prompt...");
        }
      }, 3000);
    } else {
      setLoadingMessage("Generating your pixel art...");
    }
  };

  const handleVariantClick = (index: number) => {
    setSelectedVariants((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleDownloadZip = async () => {
    const imageResults = variants.map((variant) => {
      // Create a canvas to convert base64 to ImageData
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set image source and wait for it to load
      return new Promise<ImageResult>((resolve) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          const imageData = ctx?.getImageData(
            0,
            0,
            canvas.width,
            canvas.height,
          );
          if (imageData) {
            resolve({
              preset: variant.name,
              imageData: imageData,
            });
          }
        };
        img.src = variant.image;
      });
    });

    // Wait for all images to be processed
    const results = await Promise.all(imageResults);
    await downloadAsZip(results, selectedVariants);
  };

  const handleDownloadSpritesheet = async () => {
    const imageResults = variants.map((variant) => {
      // Create a canvas to convert base64 to ImageData
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set image source and wait for it to load
      return new Promise<ImageResult>((resolve) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          const imageData = ctx?.getImageData(
            0,
            0,
            canvas.width,
            canvas.height,
          );
          if (imageData) {
            resolve({
              preset: variant.name,
              imageData: imageData,
            });
          }
        };
        img.src = variant.image;
      });
    });

    // Wait for all images to be processed
    const results = await Promise.all(imageResults);
    downloadAsSpritesheet(results, selectedVariants);
  };

  const [signInModalOpen, setSignInModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 pt-20">
      <div className="duration-500 animate-in fade-in">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="w-full overflow-y-auto rounded-2xl border border-slate-700/50 bg-slate-800/50 p-4 lg:h-[90vh] lg:max-w-xl">
            <div className="border-b border-slate-700/50 ">
              <div className="mx-auto pb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Wand2 className="h-8 w-8 text-blue-400" />
                    <div className="">
                      <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
                        AI Pixel Art Generator
                        <Badge
                          variant="default"
                          className="mt-1.5 bg-purple-400 "
                        >
                          Beta
                        </Badge>
                      </h1>
                      <p className="text-slate-400">
                        Transform your ideas into pixel art using AI
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Show generation limit alert */}
            {profile?.tier &&
              profile.generation_count >= getMaxGenerations(profile.tier) && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Generation Limit Reached</AlertTitle>
                  <AlertDescription>
                    You've reached your{" "}
                    {PLAN_LIMITS[profile.tier].MAX_GENERATIONS} image generation
                    limit for this month.
                    {profile.tier === "NONE" ? (
                      <>
                        {" "}
                        Upgrade to Pro for {
                          PLAN_LIMITS.PRO.MAX_GENERATIONS
                        }{" "}
                        generations per month!
                      </>
                    ) : (
                      <div>
                        <p>
                          We plan on adding pay as you go soon. See{" "}
                          <a
                            href="/limits"
                            className="text-blue-400 hover:underline"
                          >
                            limits
                          </a>{" "}
                          for more information.
                        </p>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}

            {!!error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error instanceof Error
                    ? error.message
                    : "Failed to generate image"}
                </AlertDescription>
              </Alert>
            )}

            {/* Prompt Section */}
            <div className="mt-6 space-y-4">
              <h2 className="text-2xl font-bold text-white">
                Enter Your Prompt
              </h2>
              <p className="text-white">
                Be detailed for better results. For example, instead of "dog",
                write "cute golden retriever puppy." Describe what you want to
                use the image for (e.g. "game sprite", "game asset", "profile
                picture", etc). Different models will be different results.
              </p>
              {/* Show remaining generations */}
              {profile?.tier && (
                <div className="rounded-lg bg-slate-700/30 p-3 text-sm text-slate-200">
                  <p>
                    Generations remaining:{" "}
                    {Math.max(
                      0,
                      getMaxGenerations(profile.tier) -
                        (profile.generation_count || 0),
                    )}{" "}
                    / {PLAN_LIMITS[profile.tier].MAX_GENERATIONS}
                  </p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Switch checked={useOpenAI} onCheckedChange={setUseOpenAI} />
                <p className="text-white">
                  Automatically use ChatGPT to improve prompt <br />{" "}
                  (recommended - may take longer)
                </p>
              </div>
              <Textarea
                value={prompt}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setPrompt(e.target.value)
                }
                placeholder="Describe the pixel art you want to generate..."
                className="h-32 resize-none bg-slate-800/30 text-white placeholder:text-slate-400"
                disabled={isLoading}
              />
              <div className="flex flex-col items-center gap-3">
                <Button
                  onClick={handleGenerate}
                  disabled={
                    !prompt.trim() ||
                    isLoading ||
                    (profile?.tier &&
                      profile.generation_count >=
                        getMaxGenerations(profile.tier))
                  }
                  size="lg"
                  className="relative mt-4 w-full bg-gradient-to-r from-purple-600 to-orange-600 px-12 py-4 text-lg font-semibold"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Generating...</span>
                    </div>
                  ) : (
                    "Generate Pixel Art"
                  )}
                </Button>
                {isLoading && loadingMessage && (
                  <div className="animate-pulse text-center text-sm text-slate-300">
                    {loadingMessage}
                  </div>
                )}
              </div>
              <p className="pt-4 text-xs text-slate-400">
                Disclaimer: This is a beta feature. We are working on adding
                more models and features. If you have any feedback, please
                contact us at{" "}
                <a href="mailto:support@pixelnova.ai" className="text-blue-400">
                  support@pixelnova.ai
                </a>
                .
              </p>
              <p className="text-xs text-slate-400">
                By using this tool, you agree to our{" "}
                <a
                  href="/terms-of-service"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  terms of service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  privacy policy
                </a>
                , as well as the{" "}
                <a
                  href="https://huggingface.co/spaces/CompVis/stable-diffusion-license"
                  className="text-blue-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  model provider license
                </a>
                .
              </p>
            </div>
          </div>

          {/* Results Section */}
          <div className="w-full flex-1 overflow-y-auto rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8 lg:h-[90vh]">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                Generated Results
              </h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    disabled={
                      variants.length === 0 || selectedVariants.size === 0
                    }
                    className="bg-gradient-to-r from-purple-400 to-pink-400"
                    size="sm"
                  >
                    <Download className="mr-1 h-4 w-4" />
                    Download ({selectedVariants.size})
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDownloadZip}>
                    <Package className="mr-2 h-4 w-4" />
                    Download as ZIP
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownloadSpritesheet}>
                    <Grid className="mr-2 h-4 w-4" />
                    Download as Spritesheet
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {isLoading && variants.length === 0 && (
              <div className="flex h-64 items-center justify-center">
                <div className="space-y-4 text-center">
                  <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-white">
                      Creating Your Pixel Art
                    </p>
                    <p className="animate-pulse text-slate-400">
                      {loadingMessage}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-3">
              {variants.map((variant, index) => (
                <div
                  key={variant.id}
                  className={`flex cursor-pointer flex-col items-center rounded-xl border ${
                    selectedVariants.has(index)
                      ? "border-amber-400 bg-amber-500/10"
                      : "border-slate-600 bg-slate-700/20"
                  } p-4 transition-colors hover:border-amber-400`}
                  onClick={() => handleVariantClick(index)}
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-contain">
                    <img
                      src={variant.image}
                      alt={variant.name}
                      className="h-full w-full object-contain"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </div>
                  <span className="mt-2 text-sm font-medium text-white">
                    {variant.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <SignInModal
        isOpen={signInModalOpen}
        onClose={() => setSignInModalOpen(false)}
        featureName="AI Pixel Art Generator"
      />
    </div>
  );
}
