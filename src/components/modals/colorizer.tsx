"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Palette, Info, Loader2 } from "lucide-react";
import { Layer } from "@/types/editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { convertToGrayscale, colorizeGrayscale } from "@/lib/utils/colorizer";
import { Checkbox } from "@/components/ui/checkbox";
import { MouseEvent } from "react";
import { Slider } from "@/components/ui/slider";

export const COLOR_PRESETS = [
  {
    name: "Sunset",
    colors: [
      "#1a0f00",
      "#331e00",
      "#4d2d00",
      "#663c00",
      "#804b00",
      "#995a00",
      "#b36900",
      "#cc7800",
      "#e68700",
      "#ff9500",
      "#ffaa33",
      "#ffbb4d",
      "#ffcc66",
      "#ffdd8a",
      "#ffeecc",
    ],
  },
  {
    name: "Ocean",
    colors: [
      "#000033",
      "#000066",
      "#000099",
      "#0000cc",
      "#0000ff",
      "#0066ff",
      "#0099ff",
      "#00ccff",
      "#00ffff",
      "#33ffff",
      "#66ffff",
      "#99ffff",
      "#ccffff",
      "#e5ffff",
      "#f0ffff",
    ],
  },
  {
    name: "Forest",
    colors: [
      "#001a00",
      "#003300",
      "#004d00",
      "#006600",
      "#008000",
      "#009900",
      "#00b300",
      "#00cc00",
      "#00e600",
      "#00ff00",
      "#33ff33",
      "#66ff66",
      "#99ff99",
      "#ccffcc",
      "#e6ffe6",
    ],
  },
  {
    name: "Purple",
    colors: [
      "#1a001a",
      "#330033",
      "#4d004d",
      "#660066",
      "#800080",
      "#990099",
      "#b300b3",
      "#cc00cc",
      "#e600e6",
      "#ff00ff",
      "#ff33ff",
      "#ff66ff",
      "#ff99ff",
      "#ffccff",
      "#ffe6ff",
    ],
  },
  {
    name: "Fire",
    colors: [
      "#1a0000",
      "#330000",
      "#4d0000",
      "#660000",
      "#800000",
      "#990000",
      "#b30000",
      "#cc0000",
      "#e60000",
      "#ff0000",
      "#ff3333",
      "#ff6666",
      "#ff9999",
      "#ffcccc",
      "#ffe6e6",
    ],
  },
  {
    name: "Retro",
    colors: [
      "#2c1810",
      "#4c2a1c",
      "#6d3c28",
      "#8d4e34",
      "#ae6040",
      "#c87248",
      "#e28450",
      "#fc9658",
      "#ffa76b",
      "#ffb77e",
      "#ffc791",
      "#ffd7a4",
      "#ffe7b7",
      "#fff7ca",
      "#fffdd8",
    ],
  },
  {
    name: "Neon",
    colors: [
      "#0d0429",
      "#1a0852",
      "#270c7b",
      "#3410a4",
      "#4114cd",
      "#4e18f6",
      "#6633ff",
      "#7f52ff",
      "#9871ff",
      "#b190ff",
      "#caafff",
      "#e3ceff",
      "#f0e5ff",
      "#f8f2ff",
      "#fdfaff",
    ],
  },
  {
    name: "Pastel",
    colors: [
      "#ffb3b3",
      "#ffb3d1",
      "#ffb3f0",
      "#d9b3ff",
      "#b3b3ff",
      "#b3d1ff",
      "#b3f0ff",
      "#b3ffd9",
      "#b3ffb3",
      "#d1ffb3",
      "#f0ffb3",
      "#ffd9b3",
      "#ffb3b3",
      "#ffb3d1",
      "#ffb3f0",
    ],
  },
  {
    name: "Sepia",
    colors: [
      "#1a1410",
      "#2a231c",
      "#3b3228",
      "#4c4134",
      "#5d5040",
      "#6e5f4c",
      "#7f6e58",
      "#907d64",
      "#a18c70",
      "#b29b7c",
      "#c3aa88",
      "#d4b994",
      "#e5c8a0",
      "#f6d7ac",
      "#ffe6b8",
    ],
  },
  {
    name: "Cyberpunk",
    colors: [
      "#0c001a",
      "#18002e",
      "#240042",
      "#300056",
      "#3c006a",
      "#48007e",
      "#540092",
      "#6000a6",
      "#6c00ba",
      "#7800ce",
      "#8400e2",
      "#9000f6",
      "#9c00ff",
      "#b94dff",
      "#d699ff",
    ],
  },
] as const;

interface ColorizerModalProps {
  open: boolean;
  onClose: () => void;
  layers: Layer[];
  onImportImage: (imageData: ImageData) => void;
}

export default function ColorizerModal({
  open,
  onClose,
  layers,
  onImportImage,
}: ColorizerModalProps) {
  const [selectedLayer, setSelectedLayer] = useState<Layer | null>(null);
  const [selectedPresets, setSelectedPresets] = useState<Set<string>>(
    new Set(),
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<
    Array<{ preset: string; imageData: ImageData }>
  >([]);
  const [selectedResults, setSelectedResults] = useState<Set<number>>(
    new Set(),
  );
  const [grayscaleImage, setGrayscaleImage] = useState<ImageData | null>(null);
  const [colorOffset, setColorOffset] = useState(0);

  const handleLayerSelect = (layer: Layer) => {
    setSelectedLayer(layer);
    if (layer.imageData) {
      const grayImage = convertToGrayscale(layer.imageData);
      setGrayscaleImage(grayImage);
    } else {
      setGrayscaleImage(null);
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
    if (
      !selectedLayer?.imageData ||
      !grayscaleImage ||
      selectedPresets.size === 0
    )
      return;

    setIsProcessing(true);
    try {
      const newResults = [...results]; // Keep existing results

      // Process each selected preset
      for (const preset of COLOR_PRESETS) {
        if (!selectedPresets.has(preset.name)) continue;

        // Always add as a new result with timestamp
        const timestamp = new Date().toLocaleTimeString();
        const colorized = colorizeGrayscale(
          grayscaleImage,
          [...preset.colors],
          colorOffset,
        );
        newResults.push({
          preset: `${preset.name} (${timestamp})`,
          imageData: colorized,
        });
      }

      setResults(newResults);

      // Auto-select only the newly added results
      const newSelectedResults = new Set(selectedResults);
      const startIndex = newResults.length - selectedPresets.size; // Index where new results start
      for (let i = startIndex; i < newResults.length; i++) {
        newSelectedResults.add(i);
      }
      setSelectedResults(newSelectedResults);
    } catch (error) {
      console.error("Error processing image:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImportSelected = () => {
    // Import each selected result as a new layer
    Array.from(selectedResults).forEach((index) => {
      const result = results[index]!;
      const canvas = document.createElement("canvas");
      canvas.width = result.imageData.width;
      canvas.height = result.imageData.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.putImageData(result.imageData, 0, 0);
      const imageUrl = canvas.toDataURL();

      const image = new Image();
      image.onload = () => {
        const importCanvas = document.createElement("canvas");
        importCanvas.width = image.width;
        importCanvas.height = image.height;
        const importCtx = importCanvas.getContext("2d");
        if (!importCtx) return;

        importCtx.drawImage(image, 0, 0);
        const imageData = importCtx.getImageData(
          0,
          0,
          importCanvas.width,
          importCanvas.height,
        );
        onImportImage(imageData);
      };
      image.src = imageUrl;
    });

    onClose();
  };

  const toggleAllResults = () => {
    if (selectedResults.size === results.length) {
      setSelectedResults(new Set());
    } else {
      setSelectedResults(new Set(results.map((_, i) => i)));
    }
  };

  const handleReset = () => {
    setSelectedResults(new Set());
    setColorOffset(0);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setSelectedResults(new Set());
          setColorOffset(0);
        }
        onClose();
      }}
    >
      <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-4xl">
        <DialogHeader className="flex-none">
          <DialogTitle>Smart Colorizer</DialogTitle>
          <DialogDescription>
            Select a layer to colorize and choose color presets
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Layer Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">1. Select Layer</h3>
                <div className="max-h-[300px] overflow-y-auto rounded-lg border p-2">
                  {layers.map((layer) => (
                    <div
                      key={layer.id}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg p-2 hover:bg-gray-100 ${
                        selectedLayer?.id === layer.id ? "bg-gray-100" : ""
                      }`}
                      onClick={() => handleLayerSelect(layer)}
                    >
                      {layer.imageData && (
                        <div className="h-12 w-12">
                          <img
                            src={(() => {
                              const canvas = document.createElement("canvas");
                              canvas.width = layer.imageData.width;
                              canvas.height = layer.imageData.height;
                              const ctx = canvas.getContext("2d");
                              ctx?.putImageData(layer.imageData, 0, 0);
                              return canvas.toDataURL();
                            })()}
                            alt={layer.name}
                            className="h-full w-full object-contain"
                          />
                        </div>
                      )}
                      <span>{layer.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Presets */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">
                    2. Choose Color Presets
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleAllPresets}
                  >
                    {selectedPresets.size === COLOR_PRESETS.length
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {COLOR_PRESETS.map((preset) => (
                    <div
                      key={preset.name}
                      className={`cursor-pointer space-y-2 rounded-lg border p-4 hover:bg-gray-100 ${
                        selectedPresets.has(preset.name)
                          ? "border-primary bg-gray-100"
                          : ""
                      }`}
                      onClick={() => togglePreset(preset.name)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{preset.name}</span>
                        <Checkbox
                          checked={selectedPresets.has(preset.name)}
                          onCheckedChange={() => togglePreset(preset.name)}
                          onClick={(e: MouseEvent) => e.stopPropagation()}
                        />
                      </div>
                      <div className="flex gap-1">
                        {preset.colors.map((color, colorIndex) => (
                          <div
                            key={`${preset.name}-${color}-${colorIndex}`}
                            className="h-2 w-full"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Color Offset Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="color-offset">Color Offset</Label>
                <span className="text-sm text-gray-500">{colorOffset}%</span>
              </div>
              <Slider
                id="color-offset"
                min={-100}
                max={100}
                step={1}
                value={[colorOffset]}
                onValueChange={(values) => setColorOffset(values[0] ?? 0)}
                className="w-full"
              />
              <p className="text-sm text-gray-500">
                Adjust to shift colors darker (-) or lighter (+)
              </p>
            </div>

            {/* Results Section */}
            {results.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">
                    3. Select Results to Import
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleAllResults}
                  >
                    {selectedResults.size === results.length
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className={`cursor-pointer space-y-2 rounded-lg border p-4 ${
                        selectedResults.has(index)
                          ? "border-primary bg-gray-100"
                          : ""
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
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{result.preset}</span>
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
                      <img
                        src={(() => {
                          const canvas = document.createElement("canvas");
                          canvas.width = result.imageData.width;
                          canvas.height = result.imageData.height;
                          const ctx = canvas.getContext("2d");
                          ctx?.putImageData(result.imageData, 0, 0);
                          return canvas.toDataURL();
                        })()}
                        alt={`${result.preset} Result`}
                        className="h-48 w-48 rounded border object-contain"
                        style={{
                          imageRendering: "pixelated",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-none pt-6">
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {results.length > 0 && (
              <>
                <Button variant="outline" onClick={handleReset}>
                  Reset
                </Button>
                <Button
                  onClick={handleImportSelected}
                  disabled={selectedResults.size === 0}
                >
                  Import Selected ({selectedResults.size})
                </Button>
              </>
            )}
            <Button
              onClick={handleColorize}
              disabled={
                !selectedLayer || isProcessing || selectedPresets.size === 0
              }
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : results.length > 0 ? (
                "Regenerate Colors"
              ) : (
                "Generate Colors"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
