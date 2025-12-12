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
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { useGeneratePixelArt, useCheckout } from "@/hooks/use-api";
import { loadStripe } from "@stripe/stripe-js";
import { env } from "@/env";
import useUser, { setPostSignInRedirectUrl } from "@/hooks/use-user";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  downloadAsZip,
  downloadAsSpritesheet,
  ImageResult,
} from "@/lib/utils/download";
import { SignInModal } from "@/components/modals/signin-modal";
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
import toast from "react-hot-toast";

export default function AIGeneratePageSuspense() {
  return (
    <Suspense fallback={<AIGeneratePageLoading />}>
      <AIGeneratePage />
    </Suspense>
  );
}

function AIGeneratePageLoading() {
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

function AIGeneratePage() {
  const searchParams = useSearchParams();
  const [prompt, setPrompt] = useState("");
  const [useOpenAI, setUseOpenAI] = useState(false);
  const [resolution, setResolution] = useState<
    "64x64" | "96x96" | "128x128" | "256x256"
  >("128x128");
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
  const checkout = useCheckout();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  async function handleUpgradeCheckout() {
    setIsCheckoutLoading(true);

    const stripe = await loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    if (!stripe) {
      toast.error("Payment system unavailable. Please try again.");
      setIsCheckoutLoading(false);
      return;
    }

    try {
      const { id: sessionId } = await checkout.mutateAsync(
        env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO,
      );
      await stripe.redirectToCheckout({ sessionId });
    } catch (e) {
      console.error(e);
      toast.error("Failed to initiate checkout. Please try again.");
      setIsCheckoutLoading(false);
    }
  }

  // Resolution mapping
  const resolutionToNumber: Record<
    "64x64" | "96x96" | "128x128" | "256x256",
    number
  > = {
    "64x64": 64,
    "96x96": 96,
    "128x128": 128,
    "256x256": 256,
  };

  // Effect to load prompt from localStorage on mount
  useEffect(() => {
    const savedPrompt = localStorage.getItem("ai-generator-prompt");
    if (savedPrompt && !searchParams.get("prompt")) {
      setPrompt(savedPrompt);
    }
  }, []);

  // Effect to set initial prompt from URL (takes precedence over localStorage)
  useEffect(() => {
    const urlPrompt = searchParams.get("prompt");
    if (urlPrompt) {
      setPrompt(decodeURIComponent(urlPrompt));
    }
  }, [searchParams]);

  // Effect to save prompt to localStorage whenever it changes
  useEffect(() => {
    if (prompt.trim()) {
      localStorage.setItem("ai-generator-prompt", prompt);
    }
  }, [prompt]);

  const handleGenerate = async () => {
    if (!isSignedIn) {
      setPostSignInRedirectUrl(window.location.href);
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
        onError: (error: any) => {
          setLoadingMessage("");
          toast.error(error);
          throw error;
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
      <DialogContent className="overflow-hidden border-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-0 sm:max-w-lg">
        {/* Animated gradient border effect */}
        <div className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 opacity-20 blur-xl" />

        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500" />

        <div className="px-6 pb-6 pt-5">
          {/* Badge */}
          <div className="mb-4 flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-3 py-1 text-sm font-semibold text-amber-300">
              <Sparkles className="h-3.5 w-3.5" />
              Limited Time: 20% OFF
            </span>
          </div>

          {/* Headline */}
          <DialogHeader className="space-y-2 text-center">
            <DialogTitle className="text-3xl font-bold tracking-tight text-white">
              Unlimited Creativity Starts Now
            </DialogTitle>
            <p className="text-lg text-slate-300">
              Unlock{" "}
              <span className="font-semibold text-purple-400">
                {PLAN_LIMITS.PRO.MAX_GENERATIONS} AI generations
              </span>{" "}
              and keep creating
            </p>
          </DialogHeader>

          {/* Price block */}
          <div className="my-6 rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl text-slate-500 line-through">
                $12.99
              </span>
              <span className="text-4xl font-bold text-white">$9.99</span>
              <span className="text-slate-400">/month</span>
            </div>
            <p className="mt-1 text-sm text-emerald-400">
              New User Limited Time Offer!
            </p>
          </div>

          {/* Benefits */}
          <DialogDescription asChild>
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-lg bg-purple-500/10 p-3">
                <div className="mt-0.5 rounded-full bg-purple-500/20 p-1.5">
                  <Wand2 className="h-4 w-4 text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">
                    {PLAN_LIMITS.PRO.MAX_GENERATIONS} AI Generations/Month
                  </p>
                  <p className="text-sm text-slate-400">
                    Create professional pixel art in seconds
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg bg-blue-500/10 p-3">
                <div className="mt-0.5 rounded-full bg-blue-500/20 p-1.5">
                  <Package className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">
                    Unlimited Image Conversions
                  </p>
                  <p className="text-sm text-slate-400">
                    Convert any image to pixel art instantly
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg bg-emerald-500/10 p-3">
                <div className="mt-0.5 rounded-full bg-emerald-500/20 p-1.5">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">
                    Priority Support + Early Features
                  </p>
                  <p className="text-sm text-slate-400">
                    Get help fast & access new tools first
                  </p>
                </div>
              </div>
            </div>
          </DialogDescription>

          {/* CTA */}
          <div className="mt-6 space-y-3">
            <Button
              size="lg"
              onClick={handleUpgradeCheckout}
              disabled={isCheckoutLoading}
              className="relative w-full overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 py-6 text-lg font-bold shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/30 disabled:opacity-80"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isCheckoutLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Preparing checkout...
                  </>
                ) : (
                  <>
                    Unlock Pro Now
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </span>
            </Button>

            {/* Trust signals */}
            <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <svg
                  className="h-3.5 w-3.5 text-emerald-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Cancel anytime
              </span>
              <span className="flex items-center gap-1">
                <svg
                  className="h-3.5 w-3.5 text-emerald-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Instant access
              </span>
              <span className="flex items-center gap-1">
                <svg
                  className="h-3.5 w-3.5 text-emerald-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Secure checkout
              </span>
            </div>
          </div>

          {/* Social proof */}
          <p className="mt-4 text-center text-sm text-slate-400">
            Join <span className="font-medium text-white">1,000+</span> creators
            making pixel art with Pixel Nova
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );

  const generateUniqueFilename = (variant: { name: string; image: string }) => {
    const timestamp = Date.now();
    const randomId = Math.floor(Math.random() * 1000);
    const sanitizedPrompt = variant.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .slice(0, 50);
    const imgWidth = resolution.split("x")[0];
    return `pixel_art_${sanitizedPrompt}_${imgWidth}px_${timestamp}_${randomId}.png`;
  };

  const handleSingleDownload = async (variant: {
    name: string;
    image: string;
  }) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    return new Promise<void>((resolve) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = generateUniqueFilename(variant);
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          resolve();
        });
      };
      img.src = variant.image;
    });
  };

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
                      <div className="flex gap-2">
                        <Link href="/tutorials/ai-pixel-art">
                          <Button
                            variant="outline"
                            className="mt-2 border-slate-600 bg-slate-800/50 px-8 text-slate-300 hover:bg-slate-700"
                          >
                            <HelpCircle className="mr-2 h-4 w-4" />
                            View Tutorial
                          </Button>
                        </Link>
                        <Link href="/gallery">
                          <Button
                            variant="outline"
                            className="mt-2 border-slate-600 bg-slate-800/50 px-8 text-slate-300 hover:bg-slate-700"
                          >
                            <Grid className="mr-2 h-4 w-4" />
                            View Your Gallery
                          </Button>
                        </Link>
                      </div>
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
                  {typeof error === "string"
                    ? error
                    : "An error occurred while generating your pixel art. Please try again."}
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
                picture", etc).
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
                      setResolution(
                        value as "64x64" | "96x96" | "128x128" | "256x256",
                      )
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
                      <SelectItem value="256x256">256x256</SelectItem>
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
            </div>
            <DisclaimerText className="hidden lg:block" />
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
                <div className="space-y-6 text-center">
                  <div className="relative mx-auto h-16 w-16">
                    <div className="absolute h-full w-full animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
                    <div className="absolute h-full w-full animate-ping rounded-full border-4 border-purple-400/30"></div>
                    <div className="absolute h-full w-full animate-pulse rounded-full bg-purple-400/10"></div>
                  </div>
                  <div className="space-y-3">
                    <p className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-2xl font-bold text-transparent">
                      ✨ Pixel Magic in Progress ✨
                    </p>
                    <p className="animate-pulse bg-gradient-to-r from-slate-400 to-slate-300 bg-clip-text text-lg font-medium text-transparent">
                      {loadingMessage}
                    </p>
                    <p className="text-sm text-slate-400">
                      Transforming your imagination into pixel perfection...
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {variants.map((variant, index) => (
                <div
                  key={variant.id}
                  className={`group flex cursor-pointer flex-col items-center rounded-xl border ${
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
                    {/* Download button in top right */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        void handleSingleDownload(variant);
                      }}
                      className="absolute right-2 top-2 rounded-full bg-slate-800/80 p-2 opacity-0 transition-all duration-200 hover:scale-110 hover:bg-slate-700/80 group-hover:opacity-100"
                    >
                      <Download className="h-4 w-4 text-white" />
                    </button>
                  </div>
                  <span className="mt-2 text-sm font-medium text-white">
                    {variant.name}
                  </span>
                </div>
              ))}
              <DisclaimerText className="block lg:hidden" />
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

function DisclaimerText({ className }: { className?: string }) {
  return (
    <div className={className}>
      <p className="pt-4 text-xs text-slate-400">
        Disclaimer: This is a beta feature. We are working on adding more models
        and features. If you have any feedback, please contact us at{" "}
        <a href="mailto:support@pixelnova.app" className="text-blue-400">
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
  );
}
