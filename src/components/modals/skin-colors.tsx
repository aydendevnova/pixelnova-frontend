"use client";

import { useCallback, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Loader2, ArrowDownUp } from "lucide-react";
import { Layer } from "@/types/editor";
import { convertToGrayscale } from "@/lib/utils/colorizer";
import { Checkbox } from "@/components/ui/checkbox";
import {
  SKIN_TONE_RANGES,
  colorizeToSkinTone,
  extractColors,
} from "@/lib/utils/skin-colors";

interface SkinColorModalProps {
  open: boolean;
  onClose: () => void;
  layers: Layer[];
  onImportImage: (imageData: ImageData) => void;
}

export default function SkinColorModal({
  open,
  onClose,
  layers,
  onImportImage,
}: SkinColorModalProps) {
  const [selectedLayer, setSelectedLayer] = useState<Layer | null>(null);
  const [selectedRanges, setSelectedRanges] = useState<Set<number>>(
    new Set(SKIN_TONE_RANGES.map((_, i) => i)),
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<
    Array<{ rangeName: string; imageData: ImageData }>
  >([]);
  const [selectedResults, setSelectedResults] = useState<Set<number>>(
    new Set(),
  );
  const [selectedColors, setSelectedColors] = useState<Set<string>>(new Set());
  const [layerColors, setLayerColors] = useState<string[]>([]);
  const [colorOffset, setColorOffset] = useState(0);

  const handleLayerSelect = (layer: Layer) => {
    setSelectedLayer(layer);
    if (layer.imageData) {
      // Extract and sort colors from the layer
      const colors = extractColors(layer.imageData);
      setLayerColors(colors);
      setSelectedColors(new Set());
    } else {
      setLayerColors([]);
      setSelectedColors(new Set());
    }
  };

  const handleColorize = async () => {
    if (
      !selectedLayer?.imageData ||
      selectedRanges.size === 0 ||
      selectedColors.size === 0
    )
      return;

    setIsProcessing(true);
    try {
      // Clear existing results before generating new ones
      setResults([]);
      setSelectedResults(new Set());

      const newResults = [];

      // Process each selected range
      for (const rangeIndex of selectedRanges) {
        const range = SKIN_TONE_RANGES[rangeIndex];
        if (!range) continue;

        const colorized = colorizeToSkinTone(
          selectedLayer.imageData,
          range,
          Array.from(selectedColors),
          colorOffset,
        );
        newResults.push({
          rangeName: `Skin Tone ${rangeIndex + 1}`,
          imageData: colorized,
        });
      }

      setResults(newResults);

      // Auto-select all new results
      const newSelectedResults = new Set<number>();
      for (let i = 0; i < newResults.length; i++) {
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
      const result = results[index];
      if (!result) return;

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

  const toggleAllRanges = () => {
    if (selectedRanges.size === SKIN_TONE_RANGES.length) {
      setSelectedRanges(new Set());
    } else {
      setSelectedRanges(new Set(SKIN_TONE_RANGES.map((_, i) => i)));
    }
  };

  const handleReset = () => {
    setSelectedResults(new Set());
    setSelectedRanges(new Set());
    setSelectedColors(new Set());
    setColorOffset(0);
    setResults([]);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-4xl">
        <DialogHeader className="flex-none">
          <DialogTitle>Skin Colors</DialogTitle>
          <DialogDescription>
            Select colors from your layer to transform into skin tones
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 gap-4 overflow-hidden">
          {/* Left Panel - Layer Selection and Controls */}
          <div className="flex w-1/3 flex-col">
            <div className="flex-1 overflow-y-auto pr-2">
              {/* Layer Selection */}
              <div className="mb-4 rounded-lg border p-4">
                <h3 className="mb-2 font-medium">Select Layer</h3>
                <div className="max-h-40 space-y-2 overflow-y-auto">
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
                            style={{
                              imageRendering: "pixelated",
                            }}
                          />
                        </div>
                      )}
                      <span>{layer.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              {layerColors.length > 0 && (
                <div className="mb-4 rounded-lg border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-medium">Select Skin Colors Only</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (selectedColors.size === layerColors.length) {
                          setSelectedColors(new Set());
                        } else {
                          setSelectedColors(new Set(layerColors));
                        }
                      }}
                      className="text-xs"
                    >
                      {selectedColors.size === layerColors.length
                        ? "Deselect All"
                        : "Select All"}
                    </Button>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto pr-2">
                    <div className="grid grid-cols-6 gap-1">
                      {layerColors.map((color) => (
                        <div
                          key={color}
                          className={`aspect-square cursor-pointer rounded-md border ${
                            selectedColors.has(color)
                              ? "ring-2 ring-primary"
                              : ""
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => {
                            const newSelected = new Set(selectedColors);
                            if (selectedColors.has(color)) {
                              newSelected.delete(color);
                            } else {
                              newSelected.add(color);
                            }
                            setSelectedColors(newSelected);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Skin Tone Range Selection */}
              <div className="mb-4 rounded-lg border p-4">
                <div className="mb-2">
                  <h3 className="font-medium">Select Skin Tone Ranges</h3>
                </div>
                <div className="space-y-2">
                  {SKIN_TONE_RANGES.map((range, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-50"
                    >
                      <Checkbox
                        id={`range-${index}`}
                        checked={selectedRanges.has(index)}
                        onCheckedChange={(checked) => {
                          const newSelected = new Set(selectedRanges);
                          if (checked) {
                            newSelected.add(index);
                          } else {
                            newSelected.delete(index);
                          }
                          setSelectedRanges(newSelected);
                        }}
                      />
                      <div className="flex h-6 flex-1 overflow-hidden rounded">
                        <div
                          className="h-full w-1/2"
                          style={{ backgroundColor: range[0] }}
                        />
                        <div
                          className="h-full w-1/2"
                          style={{ backgroundColor: range[1] }}
                        />
                      </div>
                      <label
                        htmlFor={`range-${index}`}
                        className="cursor-pointer"
                      >
                        Range {index + 1}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Offset Slider */}
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-medium">Color Offset</h3>
                <div className="px-2">
                  <Slider
                    value={[colorOffset]}
                    onValueChange={(values) => setColorOffset(values[0] ?? 0)}
                    min={-100}
                    max={100}
                    step={1}
                    className="py-4"
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Darker</span>
                  <span>{colorOffset}</span>
                  <span>Lighter</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Results */}
          <div className="flex w-2/3 flex-col gap-4">
            <div className="flex-1 overflow-y-auto rounded-lg border p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-medium">Results</h3>
                {results.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleAllResults}
                    className="text-xs"
                  >
                    {selectedResults.size === results.length
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer rounded-lg border p-2 hover:bg-gray-50 ${
                      selectedResults.has(index) ? "ring-2 ring-primary" : ""
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
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[url(/transparent-bg.png)] bg-contain">
                      <img
                        src={(() => {
                          const canvas = document.createElement("canvas");
                          canvas.width = result.imageData.width;
                          canvas.height = result.imageData.height;
                          const ctx = canvas.getContext("2d");
                          ctx?.putImageData(result.imageData, 0, 0);
                          return canvas.toDataURL();
                        })()}
                        alt={result.rangeName}
                        className="h-full w-full object-contain"
                        style={{
                          imageRendering: "pixelated",
                        }}
                      />
                    </div>
                    <div className="mt-2 text-sm">{result.rangeName}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
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
                !selectedLayer ||
                isProcessing ||
                selectedRanges.size === 0 ||
                selectedColors.size === 0
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
