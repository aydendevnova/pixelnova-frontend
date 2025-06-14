"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import NextImage from "next/image";
import {
  Crosshair,
  Download,
  ArrowDownUp,
  Upload,
  X,
  Package,
  Palette,
  Info,
  Grid,
  ChevronDown,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import CanvasOverlay from "@/app/skin-tone-generator/canvas-overlay";
import { sortByLuminance } from "@/lib/image-processing";
import {
  generateSkinTones,
  downloadVariations,
  downloadAsSpritesheet,
  type GeneratedVariant,
} from "@/lib/skin-tone-processing";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { MouseEvent } from "react";

interface SkinToneColor {
  id: string;
  color: string;
}

// Sortable color item component
function SortableColorItem({ color }: { color: SkinToneColor }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: color.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: color.color,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="h-12 w-12 cursor-move touch-none rounded ring-2 ring-primary ring-offset-2"
      style={style}
    />
  );
}

export default function ClientComponent() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedColors, setSelectedColors] = useState<SkinToneColor[]>([]);
  const [imageColors, setImageColors] = useState<string[]>([]);
  const [variants, setVariants] = useState<GeneratedVariant[]>([]);
  const [isPickerActive, setIsPickerActive] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [maskedPixels, setMaskedPixels] = useState<Set<string>>(new Set());
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [selectedVariants, setSelectedVariants] = useState<Set<number>>(
    new Set(),
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setUploadedImage(dataUrl);

        // Get image dimensions
        const img = new Image();
        img.onload = () => {
          setImageDimensions({ width: img.width, height: img.height });
        };
        img.src = dataUrl;

        setSelectedColors([]);
        setImageColors([]);
        extractColors(dataUrl);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const extractColors = useCallback((imageUrl: string) => {
    const img = document.createElement("img");
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const scale = 4;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const colors = new Set<string>();

      for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const hex = `#${r?.toString(16).padStart(2, "0")}${g
          ?.toString(16)
          .padStart(2, "0")}${b?.toString(16).padStart(2, "0")}`;
        colors.add(hex);
        if (colors.size > 100) break;
      }

      setImageColors(Array.from(colors));
    };
  }, []);

  useEffect(() => {
    if (!uploadedImage) return;

    const img = document.createElement("img");
    img.src = uploadedImage;
    img.onload = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
  }, [uploadedImage]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPickerActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate the actual image dimensions within the container
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageAspectRatio = canvas.width / canvas.height;
    const containerAspectRatio = rect.width / rect.height;

    let renderWidth = rect.width;
    let renderHeight = rect.height;
    let renderX = 0;
    let renderY = 0;

    if (containerAspectRatio > imageAspectRatio) {
      // Container is wider than image
      renderWidth = rect.height * imageAspectRatio;
      renderX = (rect.width - renderWidth) / 2;
    } else {
      // Container is taller than image
      renderHeight = rect.width / imageAspectRatio;
      renderY = (rect.height - renderHeight) / 2;
    }

    // Adjust coordinates relative to the actual image position
    const adjustedX = x - renderX;
    const adjustedY = y - renderY;

    // Check if click is within image bounds
    if (
      adjustedX < 0 ||
      adjustedX > renderWidth ||
      adjustedY < 0 ||
      adjustedY > renderHeight
    ) {
      return;
    }

    const scaleX = canvas.width / renderWidth;
    const scaleY = canvas.height / renderHeight;

    const pixel = ctx.getImageData(
      adjustedX * scaleX,
      adjustedY * scaleY,
      1,
      1,
    ).data;
    const color = `#${[pixel[0], pixel[1], pixel[2]]
      .map((x) => x?.toString(16).padStart(2, "0"))
      .join("")}`;

    if (!imageColors.includes(color)) {
      setImageColors((prev) => [...prev, color]);
    }

    if (!selectedColors.some((c) => c.color === color)) {
      const newColor: SkinToneColor = {
        id: crypto.randomUUID(),
        color,
      };
      setSelectedColors((prev) => [...prev, newColor]);
    }

    setIsPickerActive(false);
  };

  const toggleColor = (color: string) => {
    const isSelected = selectedColors.some((c) => c.color === color);
    if (isSelected) {
      setSelectedColors(selectedColors.filter((c) => c.color !== color));
    } else {
      const newColor: SkinToneColor = {
        id: crypto.randomUUID(),
        color,
      };
      setSelectedColors([...selectedColors, newColor]);
    }
  };

  const generateVariants = async () => {
    if (!uploadedImage || selectedColors.length === 0) return;

    setIsGenerating(true);
    try {
      const data = await generateSkinTones({
        image: uploadedImage,
        selectedColors: selectedColors.map((c) => c.color),
        maskedPixels: Array.from(maskedPixels),
      });

      if (data.variations) {
        setVariants(data.variations);
      }
    } catch (error) {
      console.error("Error generating variations:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setSelectedColors((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDownloadVariations = async () => {
    if (!variants.length) return;

    try {
      const selectedVariantsArray = Array.from(selectedVariants)
        .map((index) => variants[index])
        .filter(
          (variant): variant is GeneratedVariant => variant !== undefined,
        );

      const blob = await downloadVariations(
        selectedVariantsArray.map(({ name, image }) => ({
          name,
          image,
        })),
      );

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "skin-tone-variations.zip";
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading variations:", error);
    }
  };

  const handleDownloadSpritesheet = async () => {
    if (!variants.length) return;

    try {
      const selectedVariantsArray = Array.from(selectedVariants)
        .map((index) => variants[index])
        .filter(
          (variant): variant is GeneratedVariant => variant !== undefined,
        );

      await downloadAsSpritesheet(
        selectedVariantsArray.map(({ name, image }) => ({
          name,
          image,
        })),
      );
    } catch (error) {
      console.error("Error downloading spritesheet:", error);
    }
  };

  const autoSortColors = () => {
    setSelectedColors((colors) => {
      const sortedHexColors = sortByLuminance(colors.map((c) => c.color));
      const sortedColors = [...colors].sort((a, b) => {
        return (
          sortedHexColors.indexOf(a.color) - sortedHexColors.indexOf(b.color)
        );
      });
      return sortedColors;
    });
  };

  const removeImage = () => {
    setUploadedImage(null);
    setSelectedColors([]);
    setImageColors([]);
    setVariants([]);
    setMaskedPixels(new Set());
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Add keyboard handler
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "p") {
        setIsPickerActive((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Add effect to auto-select all new variants when they are generated
  useEffect(() => {
    if (variants.length > 0) {
      setSelectedVariants(new Set(variants.map((_, i) => i)));
    }
  }, [variants]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 pt-20 ">
      <div className="duration-500 animate-in fade-in">
        <div className="flex flex-col gap-4 lg:flex-row ">
          {/* Column Sections */}

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
                    <div className="">
                      <h1 className="text-3xl font-bold text-white">
                        Skin Tone Generator
                      </h1>
                      <p className="text-slate-400">
                        Create skin tone variations for your pixel art
                        characters
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <h2 className="my-6 text-2xl font-bold text-white">
              1. Upload Your Image
            </h2>
            {/* Image Upload Section */}
            {!uploadedImage ? (
              <div className="w-full space-y-4">
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
                {(imageDimensions.width > 256 ||
                  imageDimensions.height > 256) && (
                  <Alert className="border-amber-600/50 bg-amber-500/10 text-amber-200">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      This image ({imageDimensions.width}x
                      {imageDimensions.height}) is larger than 256x256 pixels
                      and may not be pixel art. Expect longer processing times.{" "}
                      <br />
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
                        src={uploadedImage}
                        alt="Uploaded"
                        className="h-full w-full object-contain"
                        style={{ imageRendering: "pixelated" }}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-white">Uploaded Image</p>
                      <p className="text-sm text-slate-400">
                        {imageDimensions.width}x{imageDimensions.height} pixels
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

            {/* 2. Color Selection & 3. Masking Section */}
            {uploadedImage && (
              <>
                {/* 2. Color Selection */}
                <div>
                  <div className="my-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">
                      2. Select Skin Tone Colors
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsPickerActive(!isPickerActive)}
                      className={`${
                        isPickerActive
                          ? "bg-primary text-primary-foreground"
                          : ""
                      } border-slate-600 bg-slate-700/50 text-slate-300 hover:bg-slate-600`}
                    >
                      <Crosshair className="mr-2 h-4 w-4" />
                      {isPickerActive ? "Cancel" : "Pick Color (P)"}
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="relative mx-auto mb-8">
                      <div className="relative h-[400px]">
                        <NextImage
                          src={uploadedImage}
                          alt="Uploaded pixel art"
                          fill
                          className="object-contain"
                          style={{
                            imageRendering: "pixelated",
                            cursor: isPickerActive ? "crosshair" : "default",
                          }}
                        />
                        <canvas
                          ref={canvasRef}
                          onClick={handleCanvasClick}
                          className="absolute inset-0 h-full w-full cursor-crosshair"
                          style={{
                            opacity: 0,
                            display: isPickerActive ? "block" : "none",
                          }}
                        />
                      </div>
                    </div>

                    {imageColors.length > 99 && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertTitle>Too Many Colors</AlertTitle>
                        <AlertDescription>
                          Image contains 100+ colors. Please reduce the image
                          size or use our{" "}
                          <Link href="/pixelator" className="text-primary">
                            Color Optimization
                          </Link>{" "}
                          tool.
                        </AlertDescription>
                      </Alert>
                    )}

                    {imageColors.length > 0 && imageColors.length < 100 && (
                      <div>
                        <h3 className="mb-2 text-sm font-medium text-white">
                          Click colors to select skin tones:
                        </h3>
                        <div className="mb-6 flex flex-wrap gap-2">
                          {imageColors.map((color) => {
                            const isSelected = selectedColors.some(
                              (c) => c.color === color,
                            );
                            return (
                              <button
                                key={color}
                                className={`h-8 w-8 rounded transition-all ${
                                  isSelected
                                    ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-800"
                                    : "border-slate-600 hover:ring-2 hover:ring-blue-400/50"
                                }`}
                                style={{ backgroundColor: color }}
                                onClick={() => toggleColor(color)}
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {selectedColors.length > 0 && (
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <h3 className="text-sm font-medium text-white">
                            Selected skin tone colors (drag to reorder - first
                            color is darkest, last is lightest):
                          </h3>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={autoSortColors}
                            className="gap-2 border-purple-600 bg-purple-500/50 text-slate-300 hover:bg-purple-500"
                          >
                            <ArrowDownUp className="h-4 w-4" />
                            Auto Sort
                          </Button>
                        </div>
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={handleDragEnd}
                        >
                          <SortableContext
                            items={selectedColors}
                            strategy={horizontalListSortingStrategy}
                          >
                            <div className="flex flex-wrap gap-4">
                              {selectedColors.map((color, index) => (
                                <div
                                  key={color.id}
                                  className="flex flex-col items-center"
                                >
                                  <SortableColorItem color={color} />
                                  <span className="mt-1 text-xs text-slate-400">
                                    {index === 0
                                      ? "Darkest"
                                      : index === selectedColors.length - 1
                                        ? "Lightest"
                                        : ""}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </SortableContext>
                        </DndContext>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Masking Section */}

                <div className="mt-6">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="masking">
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <h2 className="text-2xl font-bold text-white">
                            3. Mark Areas to Ignore (optional)
                          </h2>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="mb-4 text-sm text-slate-400">
                          Paint over areas you don't want to be affected by the
                          skin tone changes
                        </p>
                        <div className="mx-auto">
                          <CanvasOverlay
                            imageUrl={uploadedImage}
                            onMaskUpdate={setMaskedPixels}
                            width={imageDimensions.width}
                            height={imageDimensions.height}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                {/* Generate Button */}
                <div className="flex justify-center">
                  <Button
                    onClick={generateVariants}
                    disabled={
                      !uploadedImage ||
                      selectedColors.length === 0 ||
                      isGenerating
                    }
                    size="lg"
                    className="mt-4 bg-gradient-to-r from-purple-600 to-orange-600 px-12 py-4 text-lg font-semibold"
                  >
                    {isGenerating ? "Generating..." : "Generate Variations"}
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Results Section */}
          {uploadedImage && (
            <div className="w-full flex-1 overflow-y-auto rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8 lg:h-[90vh]">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  Generated Variations
                </h2>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      disabled={variants.length === 0}
                      className="bg-gradient-to-r from-purple-400 to-pink-400"
                      size="sm"
                    >
                      <Download className="mr-1 h-4 w-4" />
                      Download ({selectedVariants.size})
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleDownloadVariations}>
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

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-3">
                {variants.map((variant, index) => (
                  <div
                    key={variant.id}
                    className={`flex cursor-pointer flex-col items-center rounded-xl border p-4 ${
                      selectedVariants.has(index)
                        ? "border-amber-400 bg-amber-500/10"
                        : "border-slate-600 bg-slate-700/20"
                    }`}
                    onClick={() => {
                      const newSelected = new Set(selectedVariants);
                      if (selectedVariants.has(index)) {
                        newSelected.delete(index);
                      } else {
                        newSelected.add(index);
                      }
                      setSelectedVariants(newSelected);
                    }}
                  >
                    <div className="mb-2 flex w-full items-center justify-between">
                      <span className="text-sm font-medium text-white">
                        {variant.name}
                      </span>
                      <Checkbox
                        checked={selectedVariants.has(index)}
                        onCheckedChange={() => {
                          const newSelected = new Set(selectedVariants);
                          if (selectedVariants.has(index)) {
                            newSelected.delete(index);
                          } else {
                            newSelected.add(index);
                          }
                          setSelectedVariants(newSelected);
                        }}
                        onClick={(e: MouseEvent) => e.stopPropagation()}
                      />
                    </div>
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-contain">
                      <img
                        src={variant.image}
                        alt={`${variant.name} skin tone variation`}
                        className="h-full w-full object-contain"
                        style={{ imageRendering: "pixelated" }}
                      />
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
