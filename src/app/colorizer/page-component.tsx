"use client";

import { useState, useRef, useCallback, memo, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Palette,
  Info,
  Loader2,
  Upload,
  X,
  Download,
  Package,
  Grid,
  ChevronDown,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  convertToGrayscale,
  colorizeGrayscale,
  COLOR_PRESETS,
} from "@/lib/utils/colorizer";
import { Checkbox } from "@/components/ui/checkbox";
import { MouseEvent } from "react";
import { Slider } from "@/components/ui/slider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  downloadAsZip,
  downloadAsSpritesheet,
  ImageResult,
} from "@/lib/utils/download";

export default function ColorizerPageComponent() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const colorOffsetRef = useRef(0);
  const colorOffsetDisplayRef = useRef<HTMLSpanElement>(null);
  const [sliderValue, setSliderValue] = useState(0);

  const [uploadedImage, setUploadedImage] = useState<{
    file: File;
    imageData: ImageData;
    url: string;
  } | null>(null);
  const [selectedPresets, setSelectedPresets] = useState<Set<string>>(
    new Set(COLOR_PRESETS.map((p) => p.name)),
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<
    Array<{ preset: string; imageData: ImageData }>
  >([]);
  const [selectedResults, setSelectedResults] = useState<Set<number>>(
    new Set(),
  );
  const [grayscaleImage, setGrayscaleImage] = useState<ImageData | null>(null);

  // Pre-compute image URLs to avoid repeated canvas operations
  const imageUrls = useMemo(
    () =>
      results.map((result) => {
        const canvas = document.createElement("canvas");
        canvas.width = result.imageData.width;
        canvas.height = result.imageData.height;
        const ctx = canvas.getContext("2d");
        ctx?.putImageData(result.imageData, 0, 0);
        return canvas.toDataURL();
      }),
    [results],
  );

  // Update slider handling to use ref for display
  const handleSliderChange = useCallback((values: number[]) => {
    const value = values[0] ?? 0;
    setSliderValue(value);
    if (colorOffsetDisplayRef.current) {
      colorOffsetDisplayRef.current.textContent = `${value}%`;
    }
    colorOffsetRef.current = value * 0.25;
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const grayscale = convertToGrayscale(imageData);

        setUploadedImage({
          file,
          imageData,
          url: e.target?.result as string,
        });
        setGrayscaleImage(grayscale);
        setResults([]); // Clear previous results
        setSelectedResults(new Set());
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setUploadedImage(null);
    setGrayscaleImage(null);
    setResults([]);
    setSelectedResults(new Set());
    colorOffsetRef.current = 0;
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const toggleAllPresets = () => {
    if (selectedPresets.size === COLOR_PRESETS.length) {
      setSelectedPresets(new Set());
    } else {
      setSelectedPresets(new Set(COLOR_PRESETS.map((p) => p.name)));
    }
  };

  const togglePreset = (presetName: string) => {
    const newSelected = new Set(selectedPresets);
    if (selectedPresets.has(presetName)) {
      newSelected.delete(presetName);
    } else {
      newSelected.add(presetName);
    }
    setSelectedPresets(newSelected);
  };

  const handleColorize = async () => {
    if (!grayscaleImage || selectedPresets.size === 0) return;

    setIsProcessing(true);
    // Clear previous results when starting new generation
    setResults([]);
    setSelectedResults(new Set());

    try {
      const newResults: Array<{ preset: string; imageData: ImageData }> = [];

      // Process each selected preset
      for (const preset of COLOR_PRESETS) {
        if (!selectedPresets.has(preset.name)) continue;

        const colorized = colorizeGrayscale(
          grayscaleImage,
          [...preset.colors],
          colorOffsetRef.current,
        );
        newResults.push({
          preset: preset.name,
          imageData: colorized,
        });
      }

      setResults(newResults);

      // Auto-select all new results
      setSelectedResults(new Set(newResults.map((_, i) => i)));
    } catch (error) {
      console.error("Error processing image:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedResults(new Set());
    setSliderValue(0);
    colorOffsetRef.current = 0;
    if (colorOffsetDisplayRef.current) {
      colorOffsetDisplayRef.current.textContent = "0%";
    }
    setResults([]);
  };

  const generateUniqueFilename = (result: ImageResult, index: number) => {
    const timestamp = Date.now();
    const randomId = Math.floor(Math.random() * 1000);
    const sanitizedPreset = result.preset
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_");
    return `colorized_${sanitizedPreset}_${timestamp}_${randomId}.png`;
  };

  const handleSingleDownload = async (
    result: ImageResult,
    imageUrl: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = generateUniqueFilename(result, 0);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 pt-20">
      <div className="duration-500 animate-in fade-in">
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Left Column - Upload and Controls */}
          <div
            className={`overflow-y-auto rounded-2xl border border-slate-700/50 bg-slate-800/50 p-4 lg:h-[90vh] ${
              uploadedImage ? "w-full lg:max-w-xl" : "w-screen"
            }`}
          >
            {/* Header */}
            <div className="border-b border-slate-700/50">
              <div className="mx-auto pb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Palette className="h-8 w-8 text-blue-400" />
                    <div>
                      <h1 className="text-3xl font-bold text-white">
                        Smart Colorizer
                      </h1>
                      <p className="text-slate-400">
                        Transform your images with fun color palettes
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <h2 className="mb-6 mt-6 text-2xl font-bold text-white">
              1. Upload Your Image
            </h2>
            {!uploadedImage ? (
              <div className="space-y-4">
                <div
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-600 bg-slate-800/30 p-12 hover:border-blue-400"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mb-4 h-12 w-12 text-slate-400" />
                  <p className="mb-2 text-lg font-medium text-white">
                    Click to upload an image
                  </p>
                  <p className="text-sm text-slate-400">
                    PNG, JPG, or GIF up to 10MB
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {(uploadedImage.imageData.width > 256 ||
                  uploadedImage.imageData.height > 256) && (
                  <Alert className="border-amber-600/50 bg-amber-500/10 text-amber-200">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      This image ({uploadedImage.imageData.width}x
                      {uploadedImage.imageData.height}) is larger than 256x256
                      pixels and may not be pixel art. Expect longer processing
                      times. <br />
                      Convert to pixel art{" "}
                      <Link href="/convert" className="text-blue-500">
                        here
                      </Link>
                      .
                    </AlertDescription>
                  </Alert>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 overflow-hidden rounded-lg border border-slate-600">
                      <img
                        src={uploadedImage.url}
                        alt="Uploaded"
                        className="h-full w-full object-contain"
                        style={{ imageRendering: "pixelated" }}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {uploadedImage.file.name}
                      </p>
                      <p className="text-sm text-slate-400">
                        {Math.round(uploadedImage.file.size / 1024)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeImage}
                    className="text-slate-400 hover:bg-slate-700/50 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {uploadedImage && (
              <>
                {/* Color Presets Section */}
                <div className="mt-8">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">
                      2. Choose Color Presets
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleAllPresets}
                      className="border-slate-600 bg-slate-700/50 text-slate-300 hover:bg-slate-600"
                    >
                      {selectedPresets.size === COLOR_PRESETS.length
                        ? "Deselect All"
                        : "Select All"}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
                    {COLOR_PRESETS.map((preset) => (
                      <div
                        key={preset.name}
                        className={`cursor-pointer rounded-xl border p-4 ${
                          selectedPresets.has(preset.name)
                            ? "border-blue-400 bg-blue-500/10"
                            : "border-slate-600 bg-slate-700/20"
                        }`}
                        onClick={() => togglePreset(preset.name)}
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-medium text-white">
                            {preset.name}
                          </span>
                          <Checkbox
                            checked={selectedPresets.has(preset.name)}
                            onCheckedChange={() => togglePreset(preset.name)}
                            onClick={(e: MouseEvent) => e.stopPropagation()}
                          />
                        </div>
                        <div className="flex gap-1 overflow-hidden rounded">
                          {preset.colors.map((color, colorIndex) => (
                            <div
                              key={`${preset.name}-${color}-${colorIndex}`}
                              className="h-4 flex-1"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Color Offset Controls */}
                <div className="mt-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="color-offset"
                        className="text-xl font-bold text-white"
                      >
                        Color Offset
                      </Label>
                      <span
                        ref={colorOffsetDisplayRef}
                        className="font-mono text-xl text-emerald-400"
                      >
                        0%
                      </span>
                    </div>
                    <Slider
                      id="color-offset"
                      min={-100}
                      max={100}
                      step={1}
                      value={[sliderValue]}
                      onValueChange={handleSliderChange}
                      className="w-full"
                    />
                    <p className="text-slate-400">
                      Adjust to shift colors darker (-) or lighter (+)
                    </p>
                  </div>
                </div>

                {/* Generate Button */}
                <div className="mt-8 flex justify-center">
                  <Button
                    onClick={handleColorize}
                    disabled={isProcessing || selectedPresets.size === 0}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-orange-600 px-12 py-4 text-lg font-semibold"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Generate Colors"
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Right Column - Results */}
          {uploadedImage && (
            <div className="w-full flex-1 overflow-y-auto rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8 lg:h-[90vh]">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  Generated Colors
                </h2>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      disabled={results.length === 0}
                      className="bg-gradient-to-r from-purple-400 to-pink-400"
                      size="sm"
                    >
                      <Download className="mr-1 h-4 w-4" />
                      Download ({selectedResults.size})
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => downloadAsZip(results, selectedResults)}
                    >
                      <Package className="mr-2 h-4 w-4" />
                      Download as ZIP
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        downloadAsSpritesheet(results, selectedResults)
                      }
                    >
                      <Grid className="mr-2 h-4 w-4" />
                      Download as Spritesheet
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-3">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`group cursor-pointer rounded-xl border p-4 ${
                      selectedResults.has(index)
                        ? "border-amber-400 bg-amber-500/10"
                        : "border-slate-600 bg-slate-700/20"
                    }`}
                    onClick={() => {
                      const newSelected = new Set(selectedResults);
                      if (selectedResults.has(index)) {
                        newSelected.delete(index);
                      } else {
                        newSelected.add(index);
                      }
                      setSelectedResults(newSelected);
                    }}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-white">
                        {result.preset}
                      </span>
                      <Checkbox
                        checked={selectedResults.has(index)}
                        onCheckedChange={() => {
                          const newSelected = new Set(selectedResults);
                          if (selectedResults.has(index)) {
                            newSelected.delete(index);
                          } else {
                            newSelected.add(index);
                          }
                          setSelectedResults(newSelected);
                        }}
                        onClick={(e: MouseEvent) => e.stopPropagation()}
                      />
                    </div>
                    <div className="relative aspect-square overflow-hidden rounded-lg">
                      <img
                        src={imageUrls[index]}
                        alt={`${result.preset} Result`}
                        className="h-full w-full object-contain"
                        style={{
                          imageRendering: "pixelated",
                        }}
                      />
                      {/* Download button in top right */}
                      <button
                        onClick={(e) => {
                          const imageUrl = imageUrls[index];
                          if (imageUrl) {
                            void handleSingleDownload(result, imageUrl, e);
                          }
                        }}
                        className="absolute right-2 top-2 rounded-full bg-slate-800/80 p-2 opacity-0 transition-all duration-200 hover:scale-110 hover:bg-slate-700/80 group-hover:opacity-100"
                      >
                        <Download className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
