"use client";

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import {
  Wand2,
  Download,
  ChevronDown,
  Package,
  Grid,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
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
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function GeneratePageSuspense() {
  return (
    <Suspense fallback={<GeneratePageLoading />}>
      <GeneratePage />
    </Suspense>
  );
}

function GeneratePageLoading() {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
        <div className="space-y-2">
          <p className="text-lg font-medium text-white">Loading...</p>
        </div>
      </div>
    </div>
  );
}

function GeneratePage() {
  const searchParams = useSearchParams();
  const [prompt, setPrompt] = useState("");
  const [useOpenAI, setUseOpenAI] = useState(false);
  const [resolution, setResolution] = useState<"64x64" | "96x96" | "128x128">(
    "128x128",
  );
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
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Resolution mapping
  const resolutionToNumber: Record<"64x64" | "96x96" | "128x128", number> = {
    "64x64": 64,
    "96x96": 96,
    "128x128": 128,
  };

  // Effect to set initial prompt from URL
  useEffect(() => {
    const urlPrompt = searchParams.get("prompt");
    if (urlPrompt) {
      setPrompt(decodeURIComponent(urlPrompt));
    }
  }, [searchParams]);

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
      if (profile.tier === "NONE") {
        setShowUpgradeModal(true);
        return;
      }
      // Pro users will see the alert that's already in the UI
      return;
    }

    // Set initial loading message
    setLoadingMessage("Preparing to generate your pixel art...");

    generatePixelArt(
      {
        prompt,
        useOpenAI,
        resolution: resolutionToNumber[resolution],
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
    const imageResults = await Promise.all(
      variants.map(async (variant) => {
        // Create a canvas to convert base64 to ImageData
        const img = new Image();
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Convert base64 to ImageData
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
      }),
    );

    await downloadAsZip(imageResults, selectedVariants);
  };

  const handleDownloadSpritesheet = async () => {
    const imageResults = await Promise.all(
      variants.map(async (variant) => {
        // Create a canvas to convert base64 to ImageData
        const img = new Image();
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Convert base64 to ImageData
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
      }),
    );

    downloadAsSpritesheet(imageResults, selectedVariants);
  };

  const [signInModalOpen, setSignInModalOpen] = useState(false);

  const UpgradeModal = () => (
    <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-yellow-400" />
            Unlock Unlimited Creativity
          </DialogTitle>
          <DialogDescription className="pt-2 text-gray-800">
            <div className="text-md space-y-4">
              <p>
                You've reached your free tier limit of{" "}
                {PLAN_LIMITS.NONE.MAX_GENERATIONS} generations this month.
                Upgrade to Pro to unlock:
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <div className="rounded-full bg-green-500/20 p-1">
                    <Wand2 className="h-4 w-4 text-green-500" />
                  </div>
                  <span>
                    {PLAN_LIMITS.PRO.MAX_GENERATIONS} Monthly AI Generations
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="rounded-full bg-blue-500/20 p-1">
                    <Package className="h-4 w-4 text-blue-500" />
                  </div>
                  <span>Unlimited Image Conversions</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="rounded-full bg-purple-500/20 p-1">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                  </div>
                  <span>Priority Support</span>
                </li>
              </ul>
              <div className="flex justify-center pt-4">
                <Link href="/pricing" className="w-full">
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-purple-600 to-orange-600 text-lg font-semibold"
                  >
                    Upgrade to Pro
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <p className="text-center text-sm text-gray-500">
                Cancel anytime. Instant access upon upgrade.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );

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
                      <Link href="/tutorials/ai-pixel-art">
                        <Button
                          variant="outline"
                          className="mt-2 border-slate-600 bg-slate-800/50 px-8 text-slate-300 hover:bg-slate-700"
                        >
                          <HelpCircle className="mr-2 h-4 w-4" />
                          View Tutorial
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Show generation limit alert */}
            {profile?.tier === "PRO" &&
              profile.generation_count >= getMaxGenerations(profile.tier) && (
                <Alert variant="default" className="mt-4 bg-purple-900/50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Generation Limit Reached</AlertTitle>
                  <AlertDescription>
                    <div>
                      <p>
                        Great news! We're working on flexible pay-as-you-go
                        options to keep your creativity flowing. Check our{" "}
                        <a
                          href="/limits"
                          className="text-blue-400 hover:underline"
                        >
                          limits page
                        </a>{" "}
                        for updates and early access information.
                      </p>
                    </div>
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

              <div className="flex items-center gap-4 py-2">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="resolution"
                    className="text-sm font-medium text-white"
                  >
                    Resolution:
                  </Label>
                  <Select
                    value={resolution}
                    onValueChange={(value) =>
                      setResolution(value as "64x64" | "96x96" | "128x128")
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-[120px] border-slate-600 bg-slate-800/30 text-white">
                      <SelectValue placeholder="Select resolution" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="64x64">64x64</SelectItem>
                      <SelectItem value="96x96">96x96</SelectItem>
                      <SelectItem value="128x128">128x128</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <span className="text-sm text-slate-300">
                  Change if your result looks blurry
                </span>
              </div>

              {/* <div className="flex items-center gap-2">
                <Switch checked={useOpenAI} onCheckedChange={setUseOpenAI} />
                <p className="text-white">
                  Automatically use ChatGPT to improve prompt <br />{" "}
                  (recommended - may take longer)
                </p>
              </div> */}

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
                    (profile?.tier === "PRO" &&
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
                <a
                  href="mailto:support@pixelnova.app"
                  className="text-blue-400"
                >
                  support@pixelnova.app
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
      <UpgradeModal />
    </div>
  );
}
